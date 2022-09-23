// plugin.controllers["content-api"].token = async (ctx, next) => {
//   try {
//     const { id } = ctx.params;
//     const file = await strapi.plugins.upload.services.upload.findOne(id);

//     if (!file) return ctx.badRequest("File not found");
//     let token = file.token;
//     if (token === null) {
//       token = randomString().replace(/\//, "_").replace(/\+/, "-");
//       const file2 = await strapi.plugins.upload.services.upload.update(id, {
//         token: token,
//       });
//     }

//     ctx.body = { token: token };
//   } catch (err) {
//     console.log(err);
//     ctx.body = err;
//   }
// };
