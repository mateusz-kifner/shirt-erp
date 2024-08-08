import { downloadEmailAttachment, downloadEmailByUid } from "./download";
import { fetchFolderTree, fetchFolders } from "./folders";
import { transferEmailToDbByUId } from "./transfer";
import { emailSearch, fetchEmailByUid, fetchEmails } from "./fetch";

const IMAPService = {
  downloadEmailAttachment,
  downloadEmailByUid,
  emailSearch,
  fetchEmailByUid,
  fetchEmails,
  fetchFolders,
  fetchFolderTree,
  transferEmailToDbByUId,
};

export default IMAPService;
