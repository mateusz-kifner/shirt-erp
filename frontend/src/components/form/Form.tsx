import { FC } from "react"
import { Button, Form as FormAntd, FormProps as FormPropsAntd } from "antd"

import { v4 as uuidv4 } from "uuid"

import { useRecoilValue } from "recoil"
import { loginState } from "../../atoms/loginState"

import InputId from "./InputId"
import InputString from "./InputString"
import InputNumber from "./InputNumber"
import InputBoolean from "./InputBoolean"
import InputEnum from "./InputEnum"
import InputDate from "./InputDate"
import InputColor from "./InputColor"
import InputImage from "./InputImage"
// import InputFiles from "./Inputfiles"
import InputAddress from "./InputAddress"
import InputMoney from "./InputMoney"
import InputClient from "./InputClient"
import InputDateTime from "./InputDateTime"
import InputProduct from "./InputProduct"
import InputProductComponents from "./InputProductComponents"
import InputFile from "./InputFile"
import InputProductComponent from "./InputProductComponent"

import { FileType } from "../../types/FileType"
import { ProductType } from "../../types/ProductType"
import { ProductComponentType } from "../../types/ProductComponentType"
import { ImageType } from "../../types/ImageType"
import { ClientType } from "../../types/ClientType"
import { AddressType } from "../../types/AddressType"
import InputFiles from "./InputFiles"
import { LinkedListComponentType } from "../../types/LinkedListComponentType"
import InputWorkstationsIds from "./InputWorkstationsIds"
import InputWorkstationId from "./InputWorkstationId"
import { UserType } from "../../types/UserType"
import InputUser from "./InputUser"
import InputUsers from "./InputUsers"

interface FormDataProps {
  data: {
    [key: string]: {
      label: string | any
      initialValue?:
        | boolean
        | string
        | number
        | { colorName: string; colorHex: string }
        | AddressType
        | ImageType
        | FileType
        | FileType[]
        | ClientType
        | ProductType
        | ProductComponentType
        | ProductComponentType[]
        | LinkedListComponentType
        | LinkedListComponentType[]
        | UserType
        | UserType[]

      disabled?: boolean
      type:
        | "id"
        | "boolean"
        | "money"
        | "string"
        | "number"
        | "color"
        | "date"
        | "datetime"
        | "image"
        | "file"
        | "files"
        | "enum"
        | "submit"
        | "address"
        | "client"
        | "product"
        | "productcomponent"
        | "productcomponents"
        | "workstationId"
        | "workstationsIds"
        | "user"
        | "users"

      enum_data?: string[]
      height?: string
      width?: string
      preview?: boolean
      hide?: boolean
    }
  }
}

const Form: FC<FormPropsAntd & FormDataProps> = (props) => {
  const data = props.data
  const login = useRecoilValue(loginState)

  return (
    <FormAntd {...props}>
      {Object.keys(data).map((name: any) => {
        if (data[name]?.hide) return undefined
        switch (data[name].type) {
          case "id":
            return (
              <InputId
                name={name}
                {...data[name]}
                initialValue={data[name]?.initialValue as number}
                key={name}
              />
            )
          case "boolean":
            return (
              <InputBoolean
                name={name}
                labelCol={props.labelCol}
                wrapperCol={props.wrapperCol}
                {...data[name]}
                initialValue={data[name]?.initialValue as boolean}
                key={name}
              />
            )
          case "string":
            return (
              <InputString
                name={name}
                {...data[name]}
                initialValue={data[name]?.initialValue as string}
                key={name}
              />
            )
          case "number":
            return (
              <InputNumber
                name={name}
                {...data[name]}
                initialValue={data[name]?.initialValue as number}
                key={name}
              />
            )
          case "money":
            return (
              <InputMoney
                name={name}
                {...data[name]}
                initialValue={data[name]?.initialValue as number}
                key={name}
              />
            )
          case "enum":
            return (
              data[name]["enum_data"] && (
                <InputEnum
                  name={name}
                  {...data[name]}
                  initialValue={data[name]?.initialValue as string}
                  enum_data={data[name]["enum_data"] as string[]}
                  key={name}
                />
              )
            )
          case "date":
            return (
              <InputDate
                name={name}
                {...data[name]}
                initialValue={data[name]?.initialValue as string}
                key={name}
              />
            )
          case "datetime":
            return (
              <InputDateTime
                name={name}
                {...data[name]}
                initialValue={data[name]?.initialValue as string}
                key={name}
              />
            )
          case "color":
            return (
              <InputColor
                name={name}
                {...data[name]}
                initialValue={
                  data[name]?.initialValue as {
                    colorName: string
                    colorHex: string
                  }
                }
                key={name}
              />
            )
          case "address":
            return (
              <InputAddress
                name={name}
                {...data[name]}
                label={data[name]?.label as AddressType}
                initialValue={data[name]?.initialValue as AddressType}
                key={name}
              />
            )
          case "image":
            return (
              <InputFile
                name={name}
                label={data[name].label}
                key={name}
                initialValue={data[name]?.initialValue as FileType}
              />
            )
          case "file":
            return (
              <InputFile
                name={name}
                label={data[name].label}
                key={name}
                initialValue={data[name]?.initialValue as FileType}
              />
            )
          case "files":
            return (
              <InputFiles
                name={name}
                label={data[name].label}
                key={name}
                initialValue={data[name]?.initialValue as FileType[]}
              />
            )
          case "client":
            return (
              <InputClient
                name={name}
                {...data[name]}
                initialValue={data[name]?.initialValue as ClientType}
                key={name}
              />
            )
          case "product":
            return (
              <InputProduct
                name={name}
                {...data[name]}
                initialValue={data[name]?.initialValue as ProductType}
                key={name}
              />
            )
          case "productcomponent":
            return (
              <InputProductComponent
                name={name}
                {...data[name]}
                initialValue={data[name]?.initialValue as ProductComponentType}
                key={name}
              />
            )
          case "productcomponents":
            return (
              <InputProductComponents
                name={name}
                {...data[name]}
                initialValue={
                  data[name]?.initialValue as ProductComponentType[]
                }
                key={name}
              />
            )
          case "workstationId":
            return (
              <InputWorkstationId
                name={name}
                {...data[name]}
                initialValue={data[name]?.initialValue as number}
                key={name}
              />
            )
          case "workstationsIds":
            return (
              <InputWorkstationsIds
                name={name}
                {...data[name]}
                initialValue={
                  data[name]?.initialValue as LinkedListComponentType[]
                }
                key={name}
              />
            )
          case "user":
            return (
              <InputUser
                name={name}
                {...data[name]}
                initialValue={data[name]?.initialValue as UserType}
                key={name}
              />
            )
          case "users":
            return (
              <InputUsers
                name={name}
                {...data[name]}
                initialValue={data[name]?.initialValue as UserType[]}
                key={name}
              />
            )
          case "submit":
            return (
              <FormAntd.Item
                key={name}
                wrapperCol={{ offset: props.labelCol?.span }}
              >
                <Button type="primary" htmlType="submit">
                  {data[name].label}
                </Button>
              </FormAntd.Item>
            )
          default:
            return login.debug ? (
              <div key={name}>
                Not implemented Input filed named: {name}
                <pre
                  style={{
                    overflow: "hidden",
                    padding: 10,
                    margin: 10,
                    background: "#111",
                    color: "#ddd",
                  }}
                >
                  {JSON.stringify(data[name], null, 2)}
                </pre>
              </div>
            ) : undefined
        }
      })}
    </FormAntd>
  )
}

export default Form
