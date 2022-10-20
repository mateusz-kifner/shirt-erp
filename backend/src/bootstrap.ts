import fs from "fs";
import path from "path";
import mime from "mime-types";
import _ from "lodash";
import data from "../data/data.json";
import data_files from "../data/data-files.json";
const set = _.set;

/**
 * !!! use singular names in data.json and data_files.json !!!
 */

import Crypto from "crypto";

function randomString(size = 48) {
  return Crypto.randomBytes(size).toString("base64").slice(0, size);
}

const generateToken = async (event) => {
  const { data } = event.params;
  data.token = await randomString().replace(/\//, "_").replace(/\+/, "-");
};

async function setApiPermissions(newPermissions, role = "Public") {
  // Find the ID of the public role
  const strapiRole = await strapi
    .query("plugin::users-permissions.role")
    .findOne({
      where: {
        name: role,
      },
    });

  // Create the new permissions and link them to the public role
  const allPermissionsToCreate = [];
  Object.keys(newPermissions).map((controller) => {
    const actions = newPermissions[controller];
    const permissionsToCreate = actions.map((action) => {
      return strapi.query("plugin::users-permissions.permission").create({
        data: {
          action: `api::${controller}.${controller}.${action}`,
          role: strapiRole.id,
        },
      });
    });
    allPermissionsToCreate.push(...permissionsToCreate);
  });
  await Promise.all(allPermissionsToCreate);
}

async function setPluginPermissions(
  plugin,
  controller,
  actions,
  role = "Public"
) {
  // Find the ID of the public role
  const strapiRole = await strapi
    .query("plugin::users-permissions.role")
    .findOne({
      where: {
        name: role,
      },
    });

  // Create the new permissions and link them to the public role
  const permissionsToCreate = actions.map((action) => {
    return strapi.query("plugin::users-permissions.permission").create({
      data: {
        action: `plugin::${plugin}.${controller}.${action}`,
        role: strapiRole.id,
      },
    });
  });
  await Promise.all(permissionsToCreate);
}

async function isFirstRun() {
  const pluginStore = strapi.store({
    environment: strapi.config.environment,
    type: "type",
    name: "setup",
  });
  const initHasRun = await pluginStore.get({ key: "initHasRun" });
  await pluginStore.set({ key: "initHasRun", value: true });
  return !initHasRun;
}

function getFileSizeInBytes(filePath) {
  const stats = fs.statSync(filePath);
  const fileSizeInBytes = stats["size"];
  return fileSizeInBytes;
}

function getFileData(fileName) {
  const filePath = `./data/uploads/${fileName}`;

  // Parse the file metadata
  const size = getFileSizeInBytes(filePath);
  const ext = fileName.split(".").pop();
  const mimeType = mime.lookup(ext);

  return {
    path: filePath,
    name: fileName,
    size,
    type: mimeType,
  };
}

// Create an entry and attach files if there are any
async function createEntry({ model, entry, files, isPublic }) {
  try {
    if (files) {
      for (const [key, file] of Object.entries(files) as any) {
        // Get file name without the extension
        const [fileName] = file.name.split(".");
        // Upload each individual file
        const uploadedFile = await strapi
          .plugin("upload")
          .service("upload")
          .upload({
            files: file,
            data: {
              fileInfo: {
                alternativeText: fileName,
                caption: fileName,
                name: fileName,
              },
            },
          });

        // Attach each file to its entry
        set(entry, key, uploadedFile[0].id);

        if (isPublic) {
          const file = await strapi.plugins.upload.services.upload.update(
            uploadedFile[0].id,
            {
              public: true,
            }
          );
        }
      }
    }

    // Actually create the entry in Strapi
    strapi.log.info(`api::${model}.${model}`);
    strapi.log.debug(JSON.stringify(entry, undefined, 2));

    const createdEntry = await strapi.entityService.create(
      `api::${model}.${model}`,
      {
        data: entry,
      }
    );
  } catch (e) {
    console.log("model", entry, e);
  }
}

async function populateDatabase(data, data_files, isPublic = false) {
  if (!(data && Object.keys(data).length > 0)) return;
  for (let model in data) {
    let index = 0;
    for (let entryIndex in data[model]) {
      let files = null;
      if (data_files[model] && data_files[model][index]) {
        files = { ...data_files[model][index] };
        Object.keys(files).map((key) => {
          files[key] = getFileData(files[key]);
        });
      }
      console.log(files);

      // console.log({ model: model, entry: data[model][entryIndex], files });
      let new_entry = await createEntry({
        model: model,
        entry: data[model][entryIndex],
        files,
        isPublic,
      });

      index++;
    }
  }
}

async function setupEmployeeRole() {
  await strapi
    .query("plugin::users-permissions.role")
    .create({ data: { name: "Employee", description: "Employee" } });
  await setApiPermissions(
    {
      global: ["find"],
      icon: ["find", "update", "delete"],
      client: ["create", "delete", "find", "findOne", "update"],
      expense: ["create", "delete", "find", "findOne", "update"],
      log: ["create", "find", "findOne"],
      order: ["create", "delete", "find", "findOne", "update"],
      "order-archive": ["create", "delete", "find", "findOne", "update"],
      product: ["create", "delete", "find", "findOne", "update"],
      workstation: ["create", "delete", "find", "findOne", "update"],
      procedure: ["create", "delete", "find", "findOne", "update"],
      "email-message": ["find", "findOne", "delete"],
    },
    "Employee"
  );
  await setPluginPermissions(
    "upload",
    "content-api",
    ["count", "destroy", "find", "findOne", "upload", "public", "download"],
    "Employee"
  );
  // await setPluginPermissions(
  //   "users-permissions",
  //   "auth",
  //   ["resetPassword"],
  //   "Employee"
  // );
  await setPluginPermissions(
    "users-permissions",
    "role",
    ["find", "findOne"],
    "Employee"
  );
  await setPluginPermissions(
    "users-permissions",
    "user",
    ["find", "findOne", "count", "me", "setWelcomeMessageHash"],
    "Employee"
  );
  await setPluginPermissions(
    "fuzzy-search",
    "searchController",
    ["search"],
    "Employee"
  );
}

module.exports = async () => {
  if ((await isFirstRun()) || process.env.RERUN_SETUP) {
    try {
      strapi.log.info(
        "SETUP: First run detected setting up database, don't restart"
      );
      strapi.log.info("Set upload settings");
      const uploadSettings = await strapi.store({
        type: "plugin",
        name: "upload",
        key: "settings",
      });
      await uploadSettings.set({
        value: {
          sizeOptimization: false,
          responsiveDimensions: false,
          autoOrientation: false,
        },
      });
      strapi.log.info("Setting up Public role");
      await setApiPermissions({
        global: ["find"],
        icon: ["find"],
        product: ["find", "findOne"],
      });
      strapi.log.info("Setting up Employee role");
      await setupEmployeeRole();
      strapi.log.info("Setting up the test data ");
      await populateDatabase(data, data_files, true);
      strapi.log.info(" --- SETUP END ---");
    } catch (error) {
      strapi.log.error("Could not import data");
      strapi.log.error(error);
    }
  }

  strapi.db.lifecycles.subscribe({
    // @ts-ignore
    models: ["plugin::upload.file"],
    beforeCreate: generateToken,
  });
};
