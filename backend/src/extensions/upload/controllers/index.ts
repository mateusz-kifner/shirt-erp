import allow_access_to_api_file_downloadController from "./allow_access_to_api_file_download";
import allow_access_to_uploadsController from "./allow_access_to_uploads";
import downloadController from "./download";
import publicController from "./public";

export default {
  download: downloadController,
  public: publicController,
  allow_access_to_uploads: allow_access_to_uploadsController,
  allow_access_to_api_file_download:
    allow_access_to_api_file_downloadController,
};
