async function setWelcomeMessageHash(ctx, next) {
  try {
    if (typeof ctx?.request?.body?.welcomeMessageHash !== "string") {
      return ctx.badRequest("Type of welcomeMessageHash must be string");
    }
    if (!ctx?.state?.user?.id) throw new Error("user id not found");
    await strapi
      .plugin("users-permissions")
      .service("user")
      .edit(ctx.state.user.id, {
        welcomeMessageHash: ctx?.request?.body?.welcomeMessageHash,
      });

    return { success: true };
  } catch (err) {
    strapi.log.error(err);
    return { success: false };
  }
}

export default setWelcomeMessageHash;
