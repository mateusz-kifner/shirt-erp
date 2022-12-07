import { useEffect, useId } from "react"
import { Input, SimpleGrid, Stack } from "@mantine/core"
import { FileType } from "../../../types/FileType"
import axios from "axios"
import { useQuery } from "react-query"
import { Search } from "tabler-icons-react"
import ResponsivePaper from "../../../components/ResponsivePaper"
import FileDisplay from "./FilesDisplay"
import { useViewportSize } from "@mantine/hooks"

const previewFileType = [""]
const fetchFiles = async () => {
  const res = await axios.get("upload/files")
  return res.data
}
const FilesPage = () => {
  const uuid = useId()
  const { height, width } = useViewportSize()

  const { data } = useQuery<any>(["files"], () => fetchFiles(), {
    keepPreviousData: true,
  })

  useEffect(() => {
    if (data) {
      ;(async () => {
        for (let file of data) {
          if (typeof file.token !== "string") {
            let res = await axios.get("upload/token/" + file.id).catch(() => {})
          }
        }
      })()
    }
  }, [data])

  return (
    <ResponsivePaper m="xl">
      {/* <FileList value={data}></FileList> */}
      <Input placeholder="Szukaj" rightSection={<Search />} radius="xl" />
      <div className="flex flex-col gap-3 p-3">
        <SimpleGrid cols={Math.floor((width - 340) / 400)}>
          {data &&
            data.map((fileData: FileType, index: number) => {
              console.log(fileData.mime)
              return (
                <FileDisplay
                  fileData={fileData}
                  key={uuid + index}
                ></FileDisplay>
              )
            })}
        </SimpleGrid>
      </div>
    </ResponsivePaper>
  )
}

export default FilesPage
