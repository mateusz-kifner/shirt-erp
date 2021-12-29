"use strict";

/**
 * An asynchronous bootstrap function that runs before
 * your application gets started.
 *
 * This gives you an opportunity to set up your data model,
 * run jobs, or perform some special logic.
 *
 * See more details here: https://strapi.io/documentation/developer-docs/latest/setup-deployment-guides/configurations.html#bootstrap
 */

module.exports = async () => {
  // Create Role Employee
  let roles = await strapi.plugins[
    "users-permissions"
  ].services.userspermissions.getRoles();
  // console.log(roles)
  //   let publicRoleId = roles
  //     .filter((role) => role.name == "Public")
  //     .map((_, index) => index)[0];
  roles = roles.map((role) => role.name);
  if (!roles.includes("Employee")) {
    console.log("Creating employee role");

    await strapi.plugins[
      "users-permissions"
    ].services.userspermissions.createRole({
      name: "Employee",
      description: "Employee",
      permissions: {
        application: {
          controllers: {
            product: {
              findone: {
                enabled: true,
                policy: "",
              },
              create: {
                enabled: true,
                policy: "",
              },
              find: {
                enabled: true,
                policy: "",
              },
              count: {
                enabled: true,
                policy: "",
              },
              update: {
                enabled: true,
                policy: "",
              },
              delete: {
                enabled: true,
                policy: "",
              },
            },
            order: {
              findone: {
                enabled: true,
                policy: "",
              },
              count: {
                enabled: true,
                policy: "",
              },
              find: {
                enabled: true,
                policy: "",
              },
              update: {
                enabled: true,
                policy: "",
              },
              archive: {
                enabled: true,
                policy: "",
              },
              create: {
                enabled: true,
                policy: "",
              },
              delete: {
                enabled: true,
                policy: "",
              },
            },
            procedure: {
              count: {
                enabled: true,
                policy: "",
              },
              update: {
                enabled: true,
                policy: "",
              },
              create: {
                enabled: true,
                policy: "",
              },
              findone: {
                enabled: true,
                policy: "",
              },
              find: {
                enabled: true,
                policy: "",
              },
              delete: {
                enabled: true,
                policy: "",
              },
            },
            expense: {
              create: {
                enabled: true,
                policy: "",
              },
              delete: {
                enabled: true,
                policy: "",
              },
              update: {
                enabled: true,
                policy: "",
              },
              count: {
                enabled: true,
                policy: "",
              },
              findone: {
                enabled: true,
                policy: "",
              },
              find: {
                enabled: true,
                policy: "",
              },
            },
            main: {
              update: {
                enabled: false,
                policy: "",
              },
              delete: {
                enabled: false,
                policy: "",
              },
              find: {
                enabled: true,
                policy: "",
              },
            },
            "order-archive": {
              find: {
                enabled: true,
                policy: "",
              },
              findone: {
                enabled: true,
                policy: "",
              },
              create: {
                enabled: true,
                policy: "",
              },
              delete: {
                enabled: true,
                policy: "",
              },
              unarchive: {
                enabled: true,
                policy: "",
              },
              update: {
                enabled: true,
                policy: "",
              },
              count: {
                enabled: true,
                policy: "",
              },
            },
            workstation: {
              find: {
                enabled: true,
                policy: "",
              },
              update: {
                enabled: true,
                policy: "",
              },
              delete: {
                enabled: true,
                policy: "",
              },
              count: {
                enabled: true,
                policy: "",
              },
              create: {
                enabled: true,
                policy: "",
              },
              findone: {
                enabled: true,
                policy: "",
              },
            },
            log: {
              delete: {
                enabled: false,
                policy: "",
              },
              update: {
                enabled: false,
                policy: "",
              },
              find: {
                enabled: true,
                policy: "",
              },
              create: {
                enabled: true,
                policy: "",
              },
              count: {
                enabled: true,
                policy: "",
              },
              findone: {
                enabled: true,
                policy: "",
              },
            },
            client: {
              update: {
                enabled: true,
                policy: "",
              },
              create: {
                enabled: true,
                policy: "",
              },
              findone: {
                enabled: true,
                policy: "",
              },
              find: {
                enabled: true,
                policy: "",
              },
              count: {
                enabled: true,
                policy: "",
              },
              delete: {
                enabled: true,
                policy: "",
              },
            },
          },
        },
        upload: {
          controllers: {
            upload: {
              find: {
                enabled: true,
                policy: "",
              },
              count: {
                enabled: true,
                policy: "",
              },
              getsettings: {
                enabled: true,
                policy: "",
              },
              upload: {
                enabled: true,
                policy: "",
              },
              destroy: {
                enabled: true,
                policy: "",
              },
              updatesettings: {
                enabled: true,
                policy: "",
              },
              search: {
                enabled: true,
                policy: "",
              },
              findone: {
                enabled: true,
                policy: "",
              },
            },
          },
          information: {
            description: {
              short: "Media file management.",
              long: "Media file management.",
            },
            id: "upload",
            icon: "cloud-upload-alt",
            logo: "https://raw.githubusercontent.com/strapi/strapi/v3.6.8/packages/strapi-plugin-upload/admin/src/assets/images/logo.svg?sanitize=true",
            isCompatible: true,
            name: "Media Library",
            price: 0,
            ratings: 5,
            registry: "https://registry.npmjs.org/",
          },
        },
        "users-permissions": {
          controllers: {
            auth: {
              callback: {
                enabled: false,
                policy: "",
              },
              forgotpassword: {
                enabled: false,
                policy: "",
              },
              emailconfirmation: {
                enabled: false,
                policy: "",
              },
              resetpassword: {
                enabled: false,
                policy: "",
              },
              connect: {
                enabled: true,
                policy: "",
              },
              sendemailconfirmation: {
                enabled: false,
                policy: "",
              },
              register: {
                enabled: false,
                policy: "",
              },
            },
            userspermissions: {
              getadvancedsettings: {
                enabled: false,
                policy: "",
              },
              getroutes: {
                enabled: false,
                policy: "",
              },
              getrole: {
                enabled: false,
                policy: "",
              },
              searchusers: {
                enabled: false,
                policy: "",
              },
              getproviders: {
                enabled: false,
                policy: "",
              },
              updaterole: {
                enabled: false,
                policy: "",
              },
              index: {
                enabled: false,
                policy: "",
              },
              createrole: {
                enabled: false,
                policy: "",
              },
              deleterole: {
                enabled: false,
                policy: "",
              },
              updateadvancedsettings: {
                enabled: false,
                policy: "",
              },
              getroles: {
                enabled: false,
                policy: "",
              },
              getpolicies: {
                enabled: false,
                policy: "",
              },
              getpermissions: {
                enabled: false,
                policy: "",
              },
              updateemailtemplate: {
                enabled: false,
                policy: "",
              },
              getemailtemplate: {
                enabled: false,
                policy: "",
              },
              updateproviders: {
                enabled: false,
                policy: "",
              },
            },
            user: {
              destroy: {
                enabled: false,
                policy: "",
              },
              me: {
                enabled: true,
                policy: "",
              },
              create: {
                enabled: false,
                policy: "",
              },
              findone: {
                enabled: true,
                policy: "",
              },
              destroyall: {
                enabled: false,
                policy: "",
              },
              count: {
                enabled: true,
                policy: "",
              },
              find: {
                enabled: true,
                policy: "",
              },
              update: {
                enabled: false,
                policy: "",
              },
            },
          },
        },
      },
    });
    // await strapi.plugins[
    //   "users-permissions"
    // ].services.userspermissions.updateRole(publicRoleId, {
    //   name: "Public",
    //   description: "Default role given to unauthenticated user.",
    //   permissions: {
    //     "users-permissions": {
    //       controllers: {
    //         userspermissions: {
    //           updateproviders: {
    //             enabled: false,
    //             policy: "",
    //           },
    //           updateadvancedsettings: {
    //             enabled: false,
    //             policy: "",
    //           },
    //           createrole: {
    //             enabled: false,
    //             policy: "",
    //           },
    //           index: {
    //             enabled: false,
    //             policy: "",
    //           },
    //           getroutes: {
    //             enabled: false,
    //             policy: "",
    //           },
    //           getproviders: {
    //             enabled: false,
    //             policy: "",
    //           },
    //           searchusers: {
    //             enabled: false,
    //             policy: "",
    //           },
    //           getpolicies: {
    //             enabled: false,
    //             policy: "",
    //           },
    //           getroles: {
    //             enabled: false,
    //             policy: "",
    //           },
    //           updaterole: {
    //             enabled: false,
    //             policy: "",
    //           },
    //           getadvancedsettings: {
    //             enabled: false,
    //             policy: "",
    //           },
    //           getrole: {
    //             enabled: false,
    //             policy: "",
    //           },
    //           deleterole: {
    //             enabled: false,
    //             policy: "",
    //           },
    //           getemailtemplate: {
    //             enabled: false,
    //             policy: "",
    //           },
    //           getpermissions: {
    //             enabled: false,
    //             policy: "",
    //           },
    //           updateemailtemplate: {
    //             enabled: false,
    //             policy: "",
    //           },
    //         },
    //         auth: {
    //           connect: {
    //             enabled: true,
    //             policy: "",
    //           },
    //           emailconfirmation: {
    //             enabled: true,
    //             policy: "",
    //           },
    //           resetpassword: {
    //             enabled: true,
    //             policy: "",
    //           },
    //           callback: {
    //             enabled: true,
    //             policy: "",
    //           },
    //           forgotpassword: {
    //             enabled: true,
    //             policy: "",
    //           },
    //           sendemailconfirmation: {
    //             enabled: false,
    //             policy: "",
    //           },
    //           register: {
    //             enabled: true,
    //             policy: "",
    //           },
    //         },
    //         user: {
    //           destroy: {
    //             enabled: false,
    //             policy: "",
    //           },
    //           update: {
    //             enabled: false,
    //             policy: "",
    //           },
    //           me: {
    //             enabled: true,
    //             policy: "",
    //           },
    //           create: {
    //             enabled: false,
    //             policy: "",
    //           },
    //           count: {
    //             enabled: false,
    //             policy: "",
    //           },
    //           find: {
    //             enabled: false,
    //             policy: "",
    //           },
    //           destroyall: {
    //             enabled: false,
    //             policy: "",
    //           },
    //           findone: {
    //             enabled: false,
    //             policy: "",
    //           },
    //         },
    //       },
    //       information: {
    //         description: {
    //           short:
    //             "Protect your API with a full authentication process based on JWT.",
    //           long: "Protect your API with a full authentication process based on JWT. This plugin comes also with an ACL strategy that allows you to manage the permissions between the groups of users.",
    //         },
    //         id: "users-permissions",
    //         icon: "users",
    //         logo: "https://raw.githubusercontent.com/strapi/strapi/v3.6.8/packages/strapi-plugin-users-permissions/admin/src/assets/images/logo.svg?sanitize=true",
    //         isCompatible: true,
    //         name: "Roles & Permissions",
    //         price: 0,
    //         ratings: 5,
    //         registry: "https://registry.npmjs.org/",
    //       },
    //     },
    //     application: {
    //       controllers: {
    //         client: {
    //           delete: {
    //             enabled: false,
    //             policy: "",
    //           },
    //           create: {
    //             enabled: false,
    //             policy: "",
    //           },
    //           findone: {
    //             enabled: false,
    //             policy: "",
    //           },
    //           update: {
    //             enabled: false,
    //             policy: "",
    //           },
    //           find: {
    //             enabled: false,
    //             policy: "",
    //           },
    //           count: {
    //             enabled: false,
    //             policy: "",
    //           },
    //         },
    //         log: {
    //           findone: {
    //             enabled: false,
    //             policy: "",
    //           },
    //           create: {
    //             enabled: false,
    //             policy: "",
    //           },
    //           find: {
    //             enabled: false,
    //             policy: "",
    //           },
    //           update: {
    //             enabled: false,
    //             policy: "",
    //           },
    //           count: {
    //             enabled: false,
    //             policy: "",
    //           },
    //           delete: {
    //             enabled: false,
    //             policy: "",
    //           },
    //         },
    //         expense: {
    //           find: {
    //             enabled: false,
    //             policy: "",
    //           },
    //           delete: {
    //             enabled: false,
    //             policy: "",
    //           },
    //           findone: {
    //             enabled: false,
    //             policy: "",
    //           },
    //           count: {
    //             enabled: false,
    //             policy: "",
    //           },
    //           create: {
    //             enabled: false,
    //             policy: "",
    //           },
    //           update: {
    //             enabled: false,
    //             policy: "",
    //           },
    //         },
    //         product: {
    //           update: {
    //             enabled: false,
    //             policy: "",
    //           },
    //           count: {
    //             enabled: false,
    //             policy: "",
    //           },
    //           delete: {
    //             enabled: false,
    //             policy: "",
    //           },
    //           findone: {
    //             enabled: false,
    //             policy: "",
    //           },
    //           create: {
    //             enabled: false,
    //             policy: "",
    //           },
    //           find: {
    //             enabled: false,
    //             policy: "",
    //           },
    //         },
    //         workstation: {
    //           update: {
    //             enabled: false,
    //             policy: "",
    //           },
    //           find: {
    //             enabled: false,
    //             policy: "",
    //           },
    //           delete: {
    //             enabled: false,
    //             policy: "",
    //           },
    //           create: {
    //             enabled: false,
    //             policy: "",
    //           },
    //           findone: {
    //             enabled: false,
    //             policy: "",
    //           },
    //           count: {
    //             enabled: false,
    //             policy: "",
    //           },
    //         },
    //         order: {
    //           count: {
    //             enabled: false,
    //             policy: "",
    //           },
    //           find: {
    //             enabled: false,
    //             policy: "",
    //           },
    //           create: {
    //             enabled: false,
    //             policy: "",
    //           },
    //           update: {
    //             enabled: false,
    //             policy: "",
    //           },
    //           delete: {
    //             enabled: false,
    //             policy: "",
    //           },
    //           archive: {
    //             enabled: false,
    //             policy: "",
    //           },
    //           findone: {
    //             enabled: false,
    //             policy: "",
    //           },
    //         },
    //         main: {
    //           update: {
    //             enabled: false,
    //             policy: "",
    //           },
    //           find: {
    //             enabled: false,
    //             policy: "",
    //           },
    //           delete: {
    //             enabled: false,
    //             policy: "",
    //           },
    //         },
    //         procedure: {
    //           count: {
    //             enabled: false,
    //             policy: "",
    //           },
    //           update: {
    //             enabled: false,
    //             policy: "",
    //           },
    //           create: {
    //             enabled: false,
    //             policy: "",
    //           },
    //           delete: {
    //             enabled: false,
    //             policy: "",
    //           },
    //           find: {
    //             enabled: false,
    //             policy: "",
    //           },
    //           findone: {
    //             enabled: false,
    //             policy: "",
    //           },
    //         },
    //         "order-archive": {
    //           findone: {
    //             enabled: false,
    //             policy: "",
    //           },
    //           delete: {
    //             enabled: false,
    //             policy: "",
    //           },
    //           count: {
    //             enabled: false,
    //             policy: "",
    //           },
    //           find: {
    //             enabled: false,
    //             policy: "",
    //           },
    //           unarchive: {
    //             enabled: false,
    //             policy: "",
    //           },
    //           create: {
    //             enabled: false,
    //             policy: "",
    //           },
    //           update: {
    //             enabled: false,
    //             policy: "",
    //           },
    //         },
    //       },
    //     },
    //   },
    // });
    await strapi.plugins[
      "users-permissions"
    ].services.userspermissions.initialize();
  }
  if (
    process.env.JWT_SECRET === undefined ||
    process.env.JWT_SECRET.length < 30
  ) {
    console.log("JWT_SECRET env must be set with minimal lenght of 30");
    process.exit(1);
  }
};
