import { FC, useState } from "react"
import { Form, Card, Modal, Button, Avatar } from "antd"
import { DeleteFilled } from "@ant-design/icons"

import ProductsList from "../../pages/products/ProductsList"
import { product_template } from "../../pages/products/ProductsPage"

import { ProductType } from "../../types/ProductType"
import Color from "../details/Color"
import { serverURL } from "../.."

const { Meta } = Card

interface InputProductProps {
  name: string
  initialValue?: ProductType
  label: string
  disabled?: boolean
  required?: boolean
}

const InputProduct: FC<InputProductProps> = ({
  name,
  label,
  disabled,
  required,
  initialValue,
}) => {
  return (
    <Form.Item
      name={name}
      label={label}
      initialValue={initialValue}
      rules={[{ required: required }]}
    >
      {/* @ts-ignore */}
      <ProductPicker />
    </Form.Item>
  )
}

interface OnChangeHandler {
  (e: any): void
}
export interface ProductPickerProps {
  value: Partial<ProductType>
  onChange: OnChangeHandler
}
export const ProductPicker: FC<ProductPickerProps> = ({ value, onChange }) => {
  const [modalOpen, setModalOpen] = useState(false)
  const [currentProduct, setCurrentProduct] =
    useState<Partial<ProductType>>(value)
  // console.log("product input", value)
  return (
    <>
      <Modal
        visible={modalOpen}
        onCancel={() => setModalOpen(false)}
        onOk={() => {
          onChange(currentProduct)
          setModalOpen(false)
        }}
      >
        <ProductsList
          template={product_template}
          onItemClick={setCurrentProduct}
        />
      </Modal>
      <div style={{ position: "relative" }}>
        <Button style={{ height: "100%", width: "100%", padding: 0 }}>
          <Card
            onClick={() => setModalOpen(true)}
            style={{ height: "100%", width: "100%" }}
          >
            {value ? (
              <Meta
                avatar={
                  <Avatar
                    icon={
                      value.icon?.url && (
                        <img
                          src={serverURL + value.icon?.url}
                          alt={value?.category}
                        />
                      )
                    }
                    style={{
                      backgroundColor: value?.color?.colorHex,
                    }}
                  />
                }
                title={value?.name}
                description={
                  <>
                    {`kod: ${value.name}, color: `}
                    <Color color={value.color} small />
                  </>
                }
              />
            ) : (
              <Meta title="Nie podano produktu" />
            )}
          </Card>
        </Button>
        {value && (
          <Button
            onClick={() => onChange(null)}
            style={{ position: "absolute", right: 0, top: 0, height: "100%" }}
          >
            <DeleteFilled />
          </Button>
        )}
      </div>
    </>
  )
}

export default InputProduct
