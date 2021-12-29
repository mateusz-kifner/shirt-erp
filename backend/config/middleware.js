module.exports = {
  settings: {
    parser: {
      enabled: true,
      multipart: true,
      formidable: {
        maxFileSize: 4 * 1024 * 1024 * 1024 // 4GB
      }
    }
  },
};