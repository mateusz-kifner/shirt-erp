async function allow_access_to_uploadsController(ctx, next) {
  return {
    message: "this route is used only for configuration of secure upload",
  };
}

export default allow_access_to_uploadsController;
