import { FC } from "react"
import { Form, Card, Button } from "antd"
import { PlusOutlined } from "@ant-design/icons"

import { ProductComponentType } from "../../types/ProductComponentType"
import { ProductComponentPicker } from "./InputProductComponent"

const serverURL = (import.meta.env.SERVER_URL ||
  (function () {
    let origin_split = window.location.origin.split(":")
    return `${origin_split[0]}:${origin_split[1]}:1337/api`
  })()) as string

interface InputProductComponentsProps {
  name: string
  initialValue?: ProductComponentType[]
  label: string
  disabled?: boolean
  required?: boolean
}

const InputProductComponents: FC<InputProductComponentsProps> = ({
  name,
  label,
  disabled,
  required,
  initialValue,
}) => {
  return (
    <Form.Item
      name={name}
      // label={label}
      initialValue={initialValue}
      rules={[{ required: required }]}
      wrapperCol={{ span: undefined }}
    >
      {/* @ts-ignore */}
      <ProductComponentsPicker label={label} />
    </Form.Item>
  )
}

interface OnChangeHandler {
  (e: Partial<ProductComponentType | null>[]): void
}
interface ProductComponentsPickerProps {
  value: Partial<ProductComponentType | null>[]
  onChange: OnChangeHandler
  label: string
}
const ProductComponentsPicker: FC<ProductComponentsPickerProps> = ({
  value,
  onChange,
  label,
}) => {
  return (
    <Card
      style={{ width: "100%" }}
      size="small"
      title={<span>{label}</span>}
      bodyStyle={{
        display: "flex",
        gap: "0.25rem",
        padding: "0.rem",
        flexDirection: "column",
      }}
    >
      {value &&
        value.map(
          (
            productComponent: Partial<ProductComponentType> | null,
            index: number
          ) => (
            <div key={"productComponent" + index}>
              <ProductComponentPicker
                value={productComponent}
                onChange={(productC) => {
                  onChange(
                    value
                      .map((val, i) => (i != index ? val : productC))
                      .filter((val) => val !== null)
                  )
                }}
              />
              <hr />
            </div>
          )
        )}
      <Button
        onClick={() =>
          value
            ? onChange([
                ...value,
                {
                  count: 0,
                  product: undefined,
                  size: "",
                  notes: "",
                  ready: false,
                },
              ])
            : onChange([
                {
                  count: 0,
                  product: undefined,
                  size: "",
                  notes: "",
                  ready: false,
                },
              ])
        }
        type="primary"
      >
        <PlusOutlined />
      </Button>
    </Card>
  )
}

export default InputProductComponents
