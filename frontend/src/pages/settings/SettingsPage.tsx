import { Button, message, Modal, Space, Form as FormAntd } from "antd"
import { FC, useState } from "react"
import { useRecoilState } from "recoil"
import { loginState } from "../../atoms/loginState"
import DebugComponent from "../../components/DebugComponent"
import DebugData from "../../components/DebugData"
import FilesButton from "../../components/FilesButton"
import Form from "../../components/form/Form"
import InputFile, { FilePicker } from "../../components/form/InputFile"

const SettingsPage: FC = () => {
  const [login, setLogin] = useRecoilState(loginState)
  const [testFormVisible, setTestFormVisible] = useState(false)
  const data: any = {
    name: {
      label: "Napis",
      type: "string",
      initialValue: "test",
    },

    bool: {
      label: "checkbox",
      type: "boolean",
      initialValue: false,
      checkbox: true,
    },
    switch: {
      label: "switch",
      type: "boolean",
      initialValue: false,
    },
    category: {
      label: "Enum",
      type: "enum",
      initialValue: "option 1",
      enum_data: ["option 1", "option 2", "option 3"],
    },
    color: {
      label: "Kolor",
      type: "color",
      initialValue: { colorName: "Red", colorHex: "#ff0000" },
      // disabled: true,
      showText: true,
    },
    date: {
      label: "Date",
      type: "date",
      initialValue: "2021-11-05T12:24:05.097Z",
    },
    product: {
      label: "product",
      type: "product",
      // initialValue: null,
    },
    productcomponent: {
      label: "productcomponent",
      type: "productcomponent",
      initialValue: [],
    },
    productcomponents: {
      label: "productcomponents",
      type: "productcomponents",
      initialValue: [],
    },

    image: {
      label: "Image",
      type: "image",
      initialValue: null,
    },
    file: {
      label: "File",
      type: "file",

      initialValue: {
        id: 40,
        name: "test7.png",
        alternativeText: null,
        caption: null,
        width: 1920,
        height: 1080,
        formats: {
          large: {
            ext: ".png",
            url: "/uploads/large_test7_d10bd369ae.png",
            hash: "large_test7_d10bd369ae",
            mime: "image/png",
            name: "large_test7.png",
            path: null,
            size: 198.86,
            width: 1000,
            height: 563,
          },
          small: {
            ext: ".png",
            url: "/uploads/small_test7_d10bd369ae.png",
            hash: "small_test7_d10bd369ae",
            mime: "image/png",
            name: "small_test7.png",
            path: null,
            size: 68.33,
            width: 500,
            height: 281,
          },
          medium: {
            ext: ".png",
            url: "/uploads/medium_test7_d10bd369ae.png",
            hash: "medium_test7_d10bd369ae",
            mime: "image/png",
            name: "medium_test7.png",
            path: null,
            size: 126.47,
            width: 750,
            height: 422,
          },
          thumbnail: {
            ext: ".png",
            url: "/uploads/thumbnail_test7_d10bd369ae.png",
            hash: "thumbnail_test7_d10bd369ae",
            mime: "image/png",
            name: "thumbnail_test7.png",
            path: null,
            size: 24.04,
            width: 245,
            height: 138,
          },
        },
        hash: "test7_d10bd369ae",
        ext: ".png",
        mime: "image/png",
        size: 355.94,
        url: "/uploads/test7_d10bd369ae.png",
        previewUrl: null,
        provider: "local",
        provider_metadata: null,
        created_at: "2021-12-02T21:46:47.894Z",
        updated_at: "2021-12-02T21:46:47.894Z",
        related: [{}],
      },
    },
    files: {
      label: "Files",
      type: "files",
      // initialValue: null,
    },
    workstations: {
      label: "Workstation",
      type: "workstationId",
      initialValue: 6,
    },
    employee: {
      label: "User",
      type: "user",
      // initialValue: undefined,
    },
    employees: {
      label: "Users",
      type: "users",
      // initialValue: undefined,
    },
    submit: {
      label: "Submit",
      type: "submit",
      // centered: true, // not inmplemented
    },
  }
  return (
    <Space direction="vertical">
      <Button
        type="primary"
        onClick={() => {
          setLogin({ jwt: "", user: null, debug: false })
        }}
      >
        Wyloguj
      </Button>

      <Button
        onClick={() => {
          setLogin((user) => ({ ...user, debug: !user.debug }))
        }}
      >
        Debug {login.debug ? "ON" : "OFF"}
      </Button>
      {login.debug && (
        <>
          <DebugComponent
            {...login.user}
            jwt={login.jwt}
            name={login.user?.username}
          />

          <DebugData />

          {/* <InputImage /> */}
          {/* <FilePicker /> */}

          {/* <FormAntd>
            <InputFile name="files" label="files" />
            <FormAntd.Item
            // key={uuidv4()}
            // wrapperCol={{ offset: props.labelCol?.span }}
            >
              <Button type="primary" htmlType="submit">
                submit
              </Button>
            </FormAntd.Item>
          </FormAntd> */}
          <Button
            type="primary"
            onClick={() => {
              setTestFormVisible(true)
            }}
          >
            Open Test Form
          </Button>
          <Modal
            visible={testFormVisible}
            onCancel={() => setTestFormVisible(false)}
            onOk={() => setTestFormVisible(false)}
          >
            <Form
              labelCol={{ span: 4 }}
              wrapperCol={{ span: 16 }}
              onFinish={(data) => {
                console.log(data)
              }}
              onFinishFailed={(data) => {
                console.log(data)
              }}
              data={data}
            />
          </Modal>
          <Button
            onClick={() => {
              message.success("test msg", 10)
            }}
          >
            Test MSG
          </Button>
        </>
      )}
    </Space>
  )
}

export default SettingsPage
