import { FC } from "react"
import { Card } from "antd"

import { ProductType } from "../../types/ProductType"

import styles from "./ProductCard.module.css"
import { serverURL } from "../.."

const { Meta } = Card

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
    : // @ts-ignore
      serverURL + previewImg?.url
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
            // @ts-ignore
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
