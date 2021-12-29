import { FC } from "react"

interface ColorProps {
  color?: { colorName: string; colorHex: string }
  small?: boolean
}
const Color: FC<ColorProps> = ({ color, small }) => (
  <div
    style={{
      backgroundColor: color?.colorHex && color.colorHex,
      color: color?.colorHex && color.colorHex,
      borderRadius: 2,
      display: "inline-block",
      border: "1px solid #333",
      paddingLeft: "1rem",
      paddingRight: "1rem",
      paddingTop: small ? undefined : "0.5rem",
      paddingBottom: small ? undefined : "0.5rem",
    }}
  >
    <div style={{ filter: "invert(100%)" }}>
      {color?.colorName && color.colorName}
    </div>
  </div>
)

export default Color
