import { FC } from "react"
import { useRecoilValue } from "recoil"
import X from "tabler-icons-react/dist/icons/x.js"
import { iconState } from "../../atoms/iconState"
import SVG from "react-inlinesvg"
import { serverURL } from "../../env"
import { useMantineTheme } from "@mantine/core"
import { loginState } from "../../atoms/loginState"

interface ApiIconSVGProps {
  color?: string
  size?: string | number
  entryName?: string
  id?: number | null
  noError?: boolean
}

const ApiIconSVG: FC<ApiIconSVGProps> = ({
  color,
  size,
  entryName,
  id,
  noError,
}) => {
  const login = useRecoilValue(loginState)
  const iconsData = useRecoilValue(iconState)
  const theme = useMantineTheme()
  const new_size = size ? size : 24
  const new_color = color
    ? color
    : theme.colorScheme === "dark"
    ? "#fff"
    : "#000"
  const icon =
    iconsData &&
    id &&
    entryName &&
    iconsData[entryName].filter((val: any) => val.id === id)
  const url = icon?.length > 0 ? icon[0].url : ""
  if (!entryName) return null
  return (
    <>
      {url ? (
        <SVG
          src={serverURL + url}
          fill={new_color}
          width={new_size}
          height={new_size}
          onError={(error) => console.log(error.message)}
          loader={<X color={new_color} size={new_size} />}
          fetchOptions={{ headers: { Authorization: "Bearer " + login.jwt } }}
        />
      ) : (
        !noError && <X color={new_color} size={new_size} />
      )}
    </>
  )
}

export default ApiIconSVG
