import { FC, useState } from "react";
import { Button, Form, Modal, Upload, Image } from "antd";
import { FileType } from "../../types/FileType";
import {
  DeleteOutlined,
  DownloadOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import { UploadChangeParam } from "antd/lib/upload";
import { RcFile, UploadFile } from "antd/lib/upload/interface";
import axios, { AxiosError } from "axios";
import useEffectOnce from "../../hooks/useEffectOnce";

const { Dragger } = Upload;

const serverURL =
  import.meta.env.REACT_APP_SERVER_URL || "http://localhost:1337";

function getBase64(file: RcFile | undefined) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file as Blob);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
}

interface InputFileProps {
  name: string;
  label: string;
  initialValue?: FileType;
  disabled?: boolean;
  required?: boolean;
}

const InputFile: FC<InputFileProps> = ({
  name,
  label,
  initialValue,
  disabled,
  required,
}) => {
  return (
    <>
      <Form.Item
        name={name}
        label={label}
        initialValue={initialValue ? initialValue : undefined}
        rules={[{ required: required }]}
      >
        {/* @ts-ignore */}
        <FilePicker disabled={disabled} />
      </Form.Item>
    </>
  );
};

interface OnChangeHandler {
  (e: Partial<FileType> | null): void;
}

interface FilePickerProps {
  disabled?: boolean;
  value: Partial<FileType> | null;
  onChange: OnChangeHandler;
}

export const FilePicker: FC<FilePickerProps> = ({
  disabled,
  onChange,
  value,
}) => {
  const [wasFileSet, setWasFileSet] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<any>();
  const [previewImage, setPreviewImage] = useState<string>();
  const [previewVisible, setPreviewVisible] = useState<boolean>(false);
  const [previewTitle, setPreviewTitle] = useState<string>();
  console.log(value);

  useEffectOnce(() => {
    if (value) setWasFileSet(true);
  });

  const handlePreview = async (file: UploadFile<any>) => {
    if (!file.url && !file.preview) {
      file.preview = (await getBase64(file.originFileObj)) as string;
    }

    setPreviewImage(file.url || file.preview);
    setPreviewVisible(true);
    setPreviewTitle(
      file.name ||
        (file.url && file.url.substring(file.url.lastIndexOf("/") + 1))
    );
  };

  const handleChange = (info: UploadChangeParam<UploadFile<any>>) => {
    const { file } = info;
    console.log(info);
    if (info.fileList.length === 0) return;

    const formData = new FormData();
    //@ts-ignore
    formData.append("files", file);

    setUploading(true);
    axios
      .post(serverURL + "/upload", formData)
      .then((val) => {
        setUploading(false);
        setWasFileSet(false);
        onChange({ ...val.data[0] });
        console.log(val);
      })
      .catch((err: AxiosError) => {
        setError(err.response?.statusText);
        setUploading(false);
        console.log({ ...err });
      });
  };

  const onRemove = () => {
    axios
      .delete(serverURL + `/upload/files/${value?.id}`)
      .then((value) => {
        console.log(value);
      })
      .catch((err: AxiosError) => {
        setError(err.response?.statusText);
        console.log({ ...err });
      });
    onChange(null);
  };
  return (
    <div>
      <Dragger
        // name="files"
        listType="picture-card"
        onChange={handleChange}
        onPreview={handlePreview}
        beforeUpload={() => false}
        maxCount={1}
        multiple={false}
        style={{ display: value || uploading ? "none" : undefined }}
        onRemove={onRemove}
      >
        <p className="ant-upload-drag-icon">
          <DownloadOutlined />
        </p>
        <p className="ant-upload-text">Przeciągnij plik tutaj aby go wgrać</p>
      </Dragger>

      {wasFileSet && value && (
        <div className="ant-upload-list ant-upload-list-picture-card">
          <div
            style={{
              position: "relative",
              minHeight: "100%",
              maxWidth: 86,
              margin: 0,
              padding: "8px",
              border: "1px solid #434343",
              borderRadius: 2,
              boxSizing: "content-box",
              textAlign: "center",
              wordBreak: "break-all",
            }}
          >
            <Image
              style={{ minHeight: 86, minWidth: 86, objectFit: "cover" }}
              // @ts-ignore
              src={serverURL + value?.url}
              fallback="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='64 64 896 896' focusable='false'%3E%3Cpath d='M854.6 288.7L639.4 73.4c-6-6-14.2-9.4-22.7-9.4H192c-17.7 0-32 14.3-32 32v832c0 17.7 14.3 32 32 32h640c17.7 0 32-14.3 32-32V311.3c0-8.5-3.4-16.6-9.4-22.6zM790.2 326H602V137.8L790.2 326zm1.8 562H232V136h302v216a42 42 0 0042 42h216v494zM402 549c0 5.4 4.4 9.5 9.8 9.5h32.4c5.4 0 9.8-4.2 9.8-9.4 0-28.2 25.8-51.6 58-51.6s58 23.4 58 51.5c0 25.3-21 47.2-49.3 50.9-19.3 2.8-34.5 20.3-34.7 40.1v32c0 5.5 4.5 10 10 10h32c5.5 0 10-4.5 10-10v-12.2c0-6 4-11.5 9.7-13.3 44.6-14.4 75-54 74.3-98.9-.8-55.5-49.2-100.8-108.5-101.6-61.4-.7-111.5 45.6-111.5 103zm78 195a32 32 0 1064 0 32 32 0 10-64 0z' /%3E%3C/svg%3E"
            />
            <div title={value?.name}>{value?.name}</div>{" "}
            <Button
              title="Usuń plik"
              size="small"
              type="primary"
              danger
              icon={<DeleteOutlined />}
              style={{
                position: "absolute",
                top: "0.125rem",
                right: "0.125rem",
              }}
              onClick={() => {
                // if (value.related && value.related?.length > 0)
                onChange(null);
                // else onRemove()
                // FIXME: removing file with related data is dengerous
              }}
            />
          </div>
        </div>
      )}
      <Modal
        visible={previewVisible}
        title={previewTitle}
        footer={null}
        onCancel={() => setPreviewVisible(false)}
        width={1000}
      >
        <img alt="example" style={{ width: "100%" }} src={previewImage} />
      </Modal>
    </div>
  );
};

export default InputFile;
