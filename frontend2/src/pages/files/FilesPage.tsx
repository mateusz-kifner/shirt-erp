import { FC } from "react"

import useFiles from "../../hooks/useFiles"

import SplitPaneWithSnap from "../../components/SplitPaneWithSnap"
import UploadComponent from "./components/UploadComponent"
import FilesList from "./components/FilesList"

const FilesPage: FC = () => {
  const [files] = useFiles()
  return (
    <SplitPaneWithSnap
      split="vertical"
      gap={8}
      minSize={152}
      defaultSize={152 * 3 + 8 * 4}
    >
      <FilesList files={files} search />
      <UploadComponent />
    </SplitPaneWithSnap>
  )
}

export default FilesPage
