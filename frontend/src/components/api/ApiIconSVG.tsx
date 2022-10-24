import { FC } from "react"
import { X } from "tabler-icons-react"
import SVG from "react-inlinesvg"
import { env } from "../../env/client.mjs"
import { useMantineTheme } from "@mantine/core"
import { useAuthContext } from "../../context/authContext"
import { IconType, useIconsContext } from "../../context/iconsContext"

interface ApiIconSVGProps {
  color?: string
  size?: string | number
  entryName?: string
  id?: number | null
  noError?: boolean
}

const ApiIconSVG = ({
  color,
  size,
  entryName,
  id,
  noError,
}: ApiIconSVGProps) => {
  const { jwt } = useAuthContext()
  const { iconsData } = useIconsContext()
  const theme = useMantineTheme()
  const new_size = size ? size : 24
  const new_color = color
    ? color
    : theme.colorScheme === "dark"
    ? "#fff"
    : "#000"
  const icon =
    iconsData && id && entryName
      ? iconsData[entryName as keyof typeof iconsData].filter(
          (val: IconType) => val.id === id
        )
      : []
  const url = icon.length > 0 ? icon[0]?.url : ""
  if (!entryName) return null
  return (
    <>
      {url ? (
        <SVG
          src={env.NEXT_PUBLIC_SERVER_API_URL + url}
          fill={new_color}
          width={new_size}
          height={new_size}
          onError={(error) => console.log(error.message)}
          loader={<X color={new_color} size={new_size} />}
          fetchOptions={{ headers: { Authorization: "Bearer " + jwt } }}
        />
      ) : (
        !noError && <X color={new_color} size={new_size} />
      )}
    </>
  )
}

export default ApiIconSVG
