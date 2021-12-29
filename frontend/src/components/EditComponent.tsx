import { FC, useEffect, useRef, useState } from "react"
import { Button, Tooltip, Typography, message } from "antd"
import { CheckOutlined, CloseOutlined, EditFilled } from "@ant-design/icons"

import useForm from "antd/lib/form/hooks/useForm"
import Logger from "js-logger"

import Form from "./form/Form"
import DetailsComponent from "./DetailsComponent"

import styles from "./EditComponent.module.css"
import { useDebounce } from "../hooks/useDebounce"
import DeleteButton from "./DeleteButton"

const serverURL = process.env.REACT_APP_SERVER_URL || "http://localhost:1337"

const { Title } = Typography

function data_value_to_initialValue(data: any) {
  return Object.keys(data)
    .map((key: any) => ({
      ...data[key],
      initialValue: data[key].value,
      key: key,
    }))
    .reduce((prev: any, current: any) => {
      let new_obj = { ...prev }
      new_obj[current.key] = { ...current }
      delete new_obj[current.key].key
      return new_obj
    }, {})
}

interface EditComponentProps {
  data: any
  title?: string
  deleteTitle?: string
  onSubmit: (data: any) => void
  onDelete?: (data: any) => void
}

const EditComponent: FC<EditComponentProps> = ({
  title,
  deleteTitle,
  data,
  onSubmit,
  onDelete,
}) => {
  const [form] = useForm()
  const [edit, setEdit] = useState(false)
  const debouncedEdit = useDebounce(edit, 30)
  const [currentData, setCurrentData] = useState<any>(null)

  useEffect(() => {
    if (edit) {
      form.resetFields()
      setEdit(false)
    }
    setCurrentData(data)
    //eslint-ignore-next-line
  }, [data])

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        {title && currentData && currentData[title] && (
          <Title level={3}>{currentData[title].value}</Title>
        )}
        <div className={styles.actions}>
          {edit && (
            <Tooltip title="Cancel">
              <Button
                danger
                type={"ghost"}
                shape="circle"
                icon={<CloseOutlined />}
                // size="large"
                onClick={() => {
                  setEdit(false)
                }}
              />
            </Tooltip>
          )}
          <Tooltip title={edit ? "Save" : "Edit"}>
            <Button
              type="primary"
              shape="circle"
              icon={edit ? <CheckOutlined /> : <EditFilled />}
              // size="large"
              onClick={() => {
                debouncedEdit &&
                  form
                    .validateFields()
                    .then((values) => {
                      onSubmit(values)
                      form.resetFields()
                    })
                    .catch((info) => {
                      Logger.error({ message: "Walidacja nie udana", ...info })
                    })
                !debouncedEdit && form.resetFields()
                setEdit((val) => !val)
              }}
            />
          </Tooltip>
        </div>
      </div>

      {currentData && edit && (
        <>
          {/* <hr style={{ margin: "1rem 0" }} /> */}
          <Form
            form={form}
            wrapperCol={{ span: 16 }}
            labelCol={{ span: 8 }}
            data={data_value_to_initialValue(currentData)}
            onFinish={onSubmit}
            onFinishFailed={() => {
              form.resetFields()
              setEdit(false)
              message.error("Failed")
            }}
          />
          <div style={{ minHeight: "10vh" }}></div>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <DeleteButton
              message={"Operacja jest nieodwracalna !!!"}
              title={deleteTitle ? deleteTitle : "Usuń"}
              onClick={() => {
                onDelete &&
                  currentData.id.value !== null &&
                  currentData.id.value !== undefined &&
                  onDelete(currentData.id.value)
              }}
            ></DeleteButton>
          </div>
        </>
      )}
      {currentData && !edit && <DetailsComponent data={currentData} />}

      <div style={{ minHeight: "50vh" }}></div>
    </div>
  )
}

export default EditComponent
