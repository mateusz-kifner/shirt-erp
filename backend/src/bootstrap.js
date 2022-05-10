const fs = require("fs");
const path = require("path");
const mime = require("mime-types");
const _ = require("lodash");
const data = require("../data/data.json");
const data_files = require("../data/data-files.json");
const set = _.set;

/**
 * !!! use singular names in data.json and data_files.json !!!
 */

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
async function createEntry({ model, entry, files }) {
  try {
    if (files) {
      for (const [key, file] of Object.entries(files)) {
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
      }
    }

    // Actually create the entry in Strapi
    console.log(`api::${model}.${model}`, entry);
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

async function populateDatabase(data, data_files) {
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
      // console.log(files);

      // console.log({ model: model, entry: data[model][entryIndex], files });
      let new_entry = await createEntry({
        model: model,
        entry: data[model][entryIndex],
        files,
      });
      // console.log(new_entry);
      index++;
    }
  }
}

module.exports = async () => {
  // if (await isFirstRun()) {
  try {
    console.log("Setting up the template...");
    await populateDatabase(data, data_files);
    console.log("Ready to go");
  } catch (error) {
    console.log("Could not import data");
    console.error(error);
  }
  // }
};
