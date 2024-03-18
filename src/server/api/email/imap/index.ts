import { downloadEmailAttachment, downloadEmailByUid } from "./download";
import { fetchFolderTree, fetchFolders } from "./folders";
import { transferEmailToDbByUId } from "./transfer";
import { emailSearch, fetchEmailByUid, fetchEmails } from "./fetch";

const IMAPService = {
  downloadEmailAttachment,
  downloadEmailByUid,
  fetchEmailByUid,
  fetchEmails,
  fetchFolderTree,
  fetchFolders,
  emailSearch,
  transferEmailToDbByUId,
};

export default IMAPService;
