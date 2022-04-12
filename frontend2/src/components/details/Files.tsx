import { FC } from "react"
import { FileType } from "../../types/FileType"

import { v4 as uuidv4 } from "uuid"
import styles from "../../pages/files/components/FilesList.module.css"
import {
  CheckCircleFilled,
  DownloadOutlined,
  FileOutlined,
} from "@ant-design/icons"
import download from "../../utils/download"
import { Button } from "antd"
import { serverURL } from "../.."

interface ColorProps {
  files?: FileType[]
}
const Color: FC<ColorProps> = ({ files }) =>
  files && files?.length > 0 ? (
    <div className={styles.fileContainer} style={{ gap: "0.25rem" }}>
      <Button
        style={{
          height: "100%",
          width: 96,
        }}
        onClick={() => {
          if (!files) return
          for (let file of files) {
            download(file.url, file.name)
          }
        }}
      >
        <DownloadOutlined style={{ fontSize: "2.5rem" }} />
        <br />
        <div>
          pobierz
          <br /> wszystkie
        </div>
      </Button>
      {files &&
        files
          // .filter((file) => file.name.startsWith(searchString))
          .map((file) => {
            let imgPrev = undefined
            if (file.mime == "image/svg+xml" && file.url)
              imgPrev = serverURL + file.url
            if (file.formats?.thumbnail)
              imgPrev = serverURL + file.formats?.thumbnail.url
            const is_selected = false
            // selected.findIndex((id) => id === file.id) > -1
            return (
              <div
                className={styles.item}
                key={uuidv4()}
                style={{ position: "relative" }}
              >
                <Button
                  onClick={() => download(file.url, file.name)}
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    height: "100%",
                    width: "100%",
                    zIndex: 100,
                    fontSize: "2.5rem",
                  }}
                  download
                >
                  <DownloadOutlined />
                </Button>
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
              </div>
            )
          })}
    </div>
  ) : (
    <div>Brak</div>
  )

export default Color
