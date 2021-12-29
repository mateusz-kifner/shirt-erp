import axios from "axios"
import { useRecoilState } from "recoil"

import { filesState } from "../atoms/filesState"
import useEffectOnce from "./useEffectOnce"

import { FileType } from "../types/FileType"

export default function useFiles(): [
  files: FileType[],
  forceUpdateFiles: Function,
] {
  const [filesData, setFilesData] = useRecoilState(filesState)
  const { files } = filesData

  function forceUpdateFiles() {
    axios
      .get("/upload/files")
      .then(function (response) {
        console.log("Update files: ", response)
        setFilesData({ files: [...response.data], lastUpdate: Date.now() })
      })
      .catch(function (error) {
        console.log("Update files: ", error)
      })
  }

  useEffectOnce(() => {
    if (Date.now() - filesData.lastUpdate < 10000) return
    forceUpdateFiles()
  })

  return [files, forceUpdateFiles]
}
