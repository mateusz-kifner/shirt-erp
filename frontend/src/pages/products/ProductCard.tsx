import { FC } from "react"
import { Card } from "antd"

import { ProductType } from "../../types/ProductType"

import styles from "./ProductCard.module.css"

const { Meta } = Card
const serverURL = process.env.REACT_APP_SERVER_URL || "http://localhost:1337"

const ProductCard: FC<ProductType & { onClick: () => void }> = ({
  id,
  name,
  category,
  color,
  desc,
  icon,
  previewImg,
  onClick,
}) => {
  const preview = previewImg?.formats?.thumbnail
    ? serverURL + previewImg?.formats?.thumbnail.url
    : serverURL + previewImg?.url
  return (
    <Card
      hoverable
      className={styles.card}
      cover={
        <img
          className={styles.preview}
          alt={previewImg?.alternativeText}
          src={preview}
        />
      }
      onClick={onClick}
      // actions={[
      //   <SettingOutlined key="setting" />,
      //   <EditOutlined key="edit" />,
      //   <EllipsisOutlined key="ellipsis" />,
      // ]}
    >
      <Meta
        avatar={
          <img
            className={styles.icon}
            style={{ backgroundColor: color.colorHex }}
            alt={icon?.alternativeText}
            src={serverURL + icon?.url}
          />
        }
        title={name}
        description={desc}
      />
    </Card>
  )
}

export default ProductCard
