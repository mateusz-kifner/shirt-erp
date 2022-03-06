import { FC, ChangeEvent, useEffect, useState } from "react"
import { Input } from "antd"
import {
  CheckCircleFilled,
  DownloadOutlined,
  FileOutlined,
  SearchOutlined,
} from "@ant-design/icons"

import { v4 as uuidv4 } from "uuid"

import download from "../../../utils/download"

import { FileType } from "../../../types/FileType"

import styles from "./FilesList.module.css"

const serverURL = (import.meta.env.SERVER_URL ||
  (function () {
    let origin_split = window.location.origin.split(":")
    return `${origin_split[0]}:${origin_split[1]}:1337/api`
  })()) as string

interface FilesListProps {
  files: FileType[]
  selectedFiles?: number[]
  onSelect?: (ids: number[]) => void
  search?: boolean
}

const FilesList: FC<FilesListProps> = ({
  selectedFiles,
  files,
  onSelect,
  search,
}) => {
  const [selected, setSelected] = useState<number[]>([])
  const [searchString, setSearchString] = useState<string>("")
  useEffect(() => {
    selectedFiles && setSelected(selectedFiles)
  }, [selectedFiles])

  useEffect(() => {
    onSelect && onSelect(selected)
  }, [selected])

  const onSelectFile = (file: FileType) => {
    const index = selected.findIndex((elem) => elem == file.id)
    if (index == -1) {
      setSelected((ids) => [...ids, file.id])
      return
    }
    setSelected((ids) => {
      const new_ids = [...ids]
      new_ids.splice(index, 1)
      return new_ids
    })
  }

  const onChange = (val: ChangeEvent<HTMLInputElement>) => {
    setSearchString(val.target.value)
  }

  return (
    <div className={styles.container}>
      {search && (
        <Input
          placeholder="Wyszukaj pliki"
          onChange={onChange}
          suffix={<SearchOutlined />}
        />
      )}
      <div className={styles.fileContainer}>
        {files
          .filter((file) => file.name.startsWith(searchString))
          .map((file) => {
            let imgPrev = undefined
            if (file.mime == "image/svg+xml" && file.url)
              imgPrev = serverURL + file.url
            if (file.formats?.thumbnail)
              imgPrev = serverURL + file.formats?.thumbnail.url
            const is_selected = selected.findIndex((id) => id === file.id) > -1
            return (
              <div
                className={styles.item}
                onClick={() => {
                  onSelectFile(file)
                }}
                key={uuidv4()}
              >
                <div
                  className={styles.icon}
                  style={{
                    boxShadow: is_selected
                      ? "0 0 0.5rem 0 var(--primary)"
                      : undefined,
                  }}
                >
                  {imgPrev ? (
                    <img
                      src={imgPrev}
                      style={{ height: 64, width: 64, objectFit: "cover" }}
                    />
                  ) : (
                    <div
                      style={{
                        height: 64,
                        width: 64,
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <FileOutlined style={{ color: "#333", fontSize: 72 }} />
                    </div>
                  )}
                  {is_selected && (
                    <CheckCircleFilled
                      style={{
                        color: "var(--primary)",
                        position: "absolute",
                        top: "0.125rem",
                        left: "0.125rem",
                      }}
                    />
                  )}
                </div>

                <div
                  style={{
                    backgroundColor: is_selected ? "var(--primary)" : undefined,
                    padding: "0.125rem",
                    borderRadius: "0.125rem",
                  }}
                >
                  {file.name}
                </div>
                <div
                  //@ts-ignore
                  hrefa={file.url}
                  target="_blank"
                  onClick={() => download(file.url)}
                  download
                >
                  <DownloadOutlined />
                </div>
              </div>
            )
          })}
      </div>
    </div>
  )
}

export default FilesList
