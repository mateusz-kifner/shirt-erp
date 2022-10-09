import fs from "fs";

async function downloadController(ctx, next) {
  try {
    const { id } = ctx.params;
    const file = await strapi.plugins.upload.services.upload.findOne(id);
    if (!file) return ctx.badRequest("File not found");

    const path = "./public/" + file.url;

    ctx.type = file.mime;
    ctx.set(
      "Content-disposition",
      "attachment; filename=" +
        encodeURI(file.name + (file.name.endsWith(file.ext) ? "" : file.ext))
    );
    // console.log({ ...ctx });
    // console.log(file.name + file.ext);
    ctx.body = await fs.createReadStream(path);
    await ctx.response.send(ctx.body);
    return ctx.body;
  } catch (err) {
    console.log(err);
    ctx.body = err;
  }
}

export default downloadController;
