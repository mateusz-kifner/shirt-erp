import { sanitize } from "@strapi/utils";

async function publicController(ctx, next) {
  try {
    const { id } = ctx.params;
    if (typeof ctx?.request?.body?.public !== "boolean") {
      return ctx.badRequest("Type of public must be boolean");
    }
    const file = await strapi.plugins.upload.services.upload.update(id, {
      public: ctx.request.body.public,
    });

    const sanitizedEntity = await sanitize.contentAPI.output(
      file,
      strapi.getModel("plugin::upload.file"),
      { auth: ctx?.state?.auth }
    );

    ctx.body = sanitizedEntity;
  } catch (err) {
    console.log(err);
    ctx.body = err;
  }
}

export default publicController;
