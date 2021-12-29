import { FC, useState } from "react"
import { Form, Card, Button, Input, InputNumber, Switch } from "antd"
import { DeleteOutlined } from "@ant-design/icons"
import { v4 as uuidv4 } from "uuid"

import { ProductType } from "../../types/ProductType"
import { ProductComponentType } from "../../types/ProductComponentType"
import { ProductPicker } from "./InputProduct"

const serverURL = process.env.REACT_APP_SERVER_URL || "http://localhost:1337"

const { Meta } = Card

interface InputProductComponentProps {
  name: string
  initialValue?: ProductComponentType
  label: string
  disabled?: boolean
  required?: boolean
}

const InputProductComponent: FC<InputProductComponentProps> = ({
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
      wrapperCol={{ span: undefined }}
    >
      {/* @ts-ignore */}
      <ProductComponentPicker />
    </Form.Item>
  )
}

interface OnChangeHandler {
  (e: Partial<ProductComponentType> | null): void
}
interface ProductComponentPickerProps {
  value: Partial<ProductComponentType> | null
  onChange: OnChangeHandler
}
export const ProductComponentPicker: FC<ProductComponentPickerProps> = ({
  value,
  onChange,
}) => (
  <Card
    size="small"
    bodyStyle={{
      padding: 0,
      display: "flex",
      flexDirection: "column",
      gap: "0.25rem",
    }}
    bordered={false}
    headStyle={{ border: "none" }}
    title={`Produkt`}
    extra={
      <Button type="text" shape="circle" onClick={() => onChange(null)}>
        <DeleteOutlined style={{ color: "#a61d24" }} />
      </Button>
    }
  >
    <ProductPicker
      value={value?.product as ProductType}
      onChange={(new_product) => onChange({ ...value, product: new_product })}
    />
    <InputNumber
      addonBefore={"Ilość"}
      value={value?.count}
      onChange={(num) => onChange({ ...value, count: num })}
    />
    <Input
      addonBefore={"Rozmiar"}
      value={value?.size ? value.size : undefined}
      onChange={(e) => onChange({ ...value, size: e.target.value })}
    />
    <Input
      addonBefore={"Notatki"}
      value={value?.notes ? value.notes : undefined}
      onChange={(e) => onChange({ ...value, notes: e.target.value })}
    />
    <div>
      <span>Gotowe: </span>
      <Switch
        checkedChildren={"Tak"}
        unCheckedChildren={"Nie"}
        checked={value?.ready ? value.ready : undefined}
        onChange={(val) => {
          onChange({ ...value, ready: val })
        }}
      />
    </div>
  </Card>
)

export default InputProductComponent
