import { FC } from "react"
import { Form, Input, Select, Typography } from "antd"

import { v4 as uuidv4 } from "uuid"

import { AddressType } from "../../types/AddressType"

const { Option } = Select

interface InputAddressProps {
  name: string
  initialValue?: Partial<AddressType>
  label?: Partial<AddressType> & { name?: string }
  disabled?: boolean
  required?: boolean
}

const InputAddress: FC<InputAddressProps> = ({
  name,
  label,
  disabled,
  required,
  initialValue,
}) => {
  return (
    <>
      <Form.Item
        // style={{ display: "none" }}
        name={name}
        // label={label?.name}
        wrapperCol={{ span: undefined }}
        initialValue={initialValue}
        rules={[{ required: required }]}
      >
        {/* @ts-ignore */}
        <AddressInputBox disabled={disabled} label={label} />
      </Form.Item>
    </>
  )
}

interface OnChangeHandler {
  (e: Partial<AddressType>): void
}
interface AddressInputBoxProps {
  value: Partial<AddressType>
  onChange: OnChangeHandler
  disabled?: boolean
  label?: {
    streetName: string
    streetNumber: string
    apartmentNumber: string
    city: string
    province: string
    postCode: string
    name?: string
  }
}

const AddressInputBox: FC<AddressInputBoxProps> = ({
  label,
  value,
  disabled,
  onChange,
}) => {
  return (
    <div
      style={{
        display: "flex",
        gap: 10,
        flexDirection: "column",
        marginBottom: "0.5rem",
      }}
    >
      <Typography>{label?.name}: </Typography>
      <Input.Group compact>
        <Input
          style={{ width: "55%" }}
          value={value?.streetName ? value?.streetName : ""}
          addonBefore={label?.streetName}
          formNoValidate
          onChange={(e) => onChange({ ...value, streetName: e.target.value })}
        />

        <Input
          style={{ width: "20%" }}
          value={value?.streetNumber ? value?.streetNumber : ""}
          formNoValidate
          addonBefore={label?.streetNumber}
          onChange={(e) => onChange({ ...value, streetNumber: e.target.value })}
        />

        <Input
          style={{ width: "25%" }}
          value={value?.apartmentNumber ? value?.apartmentNumber : ""}
          addonBefore={label?.apartmentNumber}
          formNoValidate
          onChange={(e) =>
            onChange({ ...value, apartmentNumber: e.target.value })
          }
        />
      </Input.Group>
      <Input.Group compact>
        <Input
          style={{ width: "30%" }}
          value={value?.postCode ? value?.postCode : ""}
          addonBefore={label?.postCode}
          formNoValidate
          onChange={(e) => onChange({ ...value, postCode: e.target.value })}
        />
        <Input
          style={{ width: "70%" }}
          value={value?.city ? value?.city : ""}
          addonBefore={label?.city}
          formNoValidate
          onChange={(e) => onChange({ ...value, city: e.target.value })}
        />
      </Input.Group>
      <Select
        showSearch
        optionFilterProp="children"
        filterOption={(input, option: any) =>
          option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
        }
        disabled={disabled}
        value={value?.province ? value?.province : "pomorskie"}
        onChange={(province) => onChange({ ...value, province: province })}
        // addonBefore={label?.province}
      >
        {[
          "dolnośląskie",
          "kujawsko-pomorskie",
          "lubelskie",
          "lubuskie",
          "łódzkie",
          "małopolskie",
          "mazowieckie",
          "opolskie",
          "podkarpackie",
          "podlaskie",
          "pomorskie",
          "śląskie",
          "świętokrzyskie",
          "warmińsko-mazurskie",
          "wielkopolskie",
          "zachodniopomorskie",
        ].map((value: string) => (
          <Option value={value} key={uuidv4()}>
            {value}
          </Option>
        ))}
      </Select>
    </div>
  )
}

export default InputAddress
