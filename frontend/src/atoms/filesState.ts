import { atom } from "recoil";
import { FileType } from "../types/FileType";

interface FileStateType {
  files: FileType[]
  lastUpdate: number
}

export const filesState = atom<FileStateType>({
  key: 'filesState', 
  default: {  
    files: [],
    lastUpdate: 0
  },
});