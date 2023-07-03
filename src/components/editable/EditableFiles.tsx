import {
  useEffect,
  useId,
  useState,
  type ChangeEvent,
  type DragEvent,
} from "react";

import { IconPlus, IconTrashX, IconUpload } from "@tabler/icons-react";

import useTranslation from "@/hooks/useTranslation";
import useUploadMutation from "@/hooks/useUploadMutation";
import { type FileType } from "@/schema/fileSchema";
import type EditableInput from "@/types/EditableInput";
import * as RadixContextMenu from "@radix-ui/react-context-menu";
import { IconLoader2 } from "@tabler/icons-react";
import FileListItem from "../FileListItem";
import InputLabel from "../input/InputLabel";
import Modal from "../ui/Modal";

// FIXME: ENFORCE FILE LIMIT

interface EditableFilesProps extends EditableInput<FileType[]> {
  maxCount?: number;
}

const EditableFiles = (props: EditableFilesProps) => {
  const {
    label,
    required,
    onSubmit,
    value,
    initialValue,
    disabled,
    maxCount = 128,
  } = props;
  const t = useTranslation();
  const uuid = useId();
  const [files, setFiles] = useState<FileType[]>(value ?? initialValue ?? []);
  const [error, setError] = useState<string | undefined>();
  const [uploading, setUploading] = useState<number>(0);
  const [previewOpened, setPreviewOpened] = useState<boolean>(false);
  const [preview, setPreview] = useState<{
    url: string;
    width: number;
    height: number;
  }>({ url: "", width: 100, height: 100 });
  const [dragActive, setDragActive] = useState<boolean>(false);
  const { mutate: uploadMutate } = useUploadMutation({
    onSuccess: (data: Response, variables: FormData, context: unknown) => {
      data
        .json()
        .then((res) => {
          if (res?.statusCode === 201 && Array.isArray(res?.data)) {
            const filesData = res.data as FileType[];
            onSubmit?.([...files, ...filesData]);
            setFiles((files) => [...files, ...filesData]);
            setUploading((num: number) => num - filesData.length);
            setError(undefined);
          }
        })
        .catch((err) => console.log(err));
    },
    onError: function (error: unknown, variables: FormData, context: unknown) {
      console.log(error, variables, context);
      // setError(error.response?.statusText);
      // setUploading((num: number) => num - new_files.length);
    },
  });

  const onUploadMany = (new_files: File[]) => {
    if (!new_files) return;
    if (files.length + new_files.length > maxCount) {
      setError("File limit reached");
      return;
    }
    setUploading((num: number) => num + new_files.length);

    const formData = new FormData();

    for (let i = 0; i < new_files.length; i++) {
      formData.append("files", new_files[i] as Blob);
    }

    uploadMutate(formData);
  };

  const onDelete = (index: number) => {
    // axios
    //   .delete(env.NEXT_PUBLIC_SERVER_API_URL + `/api/upload/files/${index}`)
    //   .then((res) => {
    //     if (res?.data?.id !== undefined) {
    //       setFiles((files) => files.filter((file) => file.id !== res.data.id));
    //       onSubmit?.(files.filter((file) => file.id !== res.data.id));
    //     }
    //     setError(undefined);
    //     //        console.log(res)
    //   })
    //   .catch((err: AxiosError) => {
    //     setFiles((files) => files.filter((val) => val.id !== index));
    //     setError(err.response?.statusText);
    //     console.log(err);
    //   });
  };

  useEffect(() => {
    if (value === undefined || value === null) return;
    setFiles(value);
  }, [value]);

  const handleDrag = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files.length > 0) {
      onUploadMany(Array.from(e.target.files));
      console.log("files handleChange", Array.from(e.target.files));
    }
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onUploadMany(Array.from(e.dataTransfer.files));
      try {
        setDragActive(false);

        e.dataTransfer.clearData();
      } catch (error) {
        // already handled
      }
    }
  };

  return (
    <div
      // onClick={() => !disabled && setFocus(true)}
      // onFocus={() => !disabled && setFocus(true)}
      // ref={refClickOutside}
      onDragEnter={handleDrag}
    >
      <InputLabel
        label={label}
        copyValue={value?.reduce(
          (prev, next) => `${prev}${next.originalFilename}\n`,
          ""
        )}
        required={required}
      />
      <div className="pb-2">
        <Modal open={previewOpened} onClose={() => setPreviewOpened(false)}>
          <img
            src={preview.url}
            alt=""
            className="max-h-[85vh] max-w-[85vw]"
            style={{ width: preview.width }}
          />
        </Modal>

        <div
          className={`relative min-h-[44px]  rounded border border-solid transition-all before:absolute before:inset-0  ${
            dragActive
              ? "border-sky-600  before:bg-sky-600 before:bg-opacity-20"
              : "border-transparent before:bg-opacity-0"
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          {files.length > 0
            ? files.map((file, index) => (
                <FileListItem
                  key={`${uuid}_${file.id}_${file.filename}`}
                  value={file}
                  onPreview={(url, width, height) => {
                    setPreview({
                      url,
                      width: width ?? 300,
                      height: height ?? 300,
                    });
                    setPreviewOpened(true);
                  }}
                  style={{ flexGrow: 1 }}
                  contextMenuContent={
                    !disabled && (
                      <>
                        {/* <RadixContextMenu.Item
                          className="button flex-grow justify-start bg-stone-800 hover:bg-stone-600"
                          disabled={index === 0}
                        >
                          <IconArrowUp /> Up
                        </RadixContextMenu.Item>
                        <RadixContextMenu.Item
                          className="button flex-grow justify-start bg-stone-800 hover:bg-stone-600"
                          disabled={index === files.length - 1}
                        >
                          <IconArrowDown /> Down
                        </RadixContextMenu.Item> */}
                        <RadixContextMenu.Item className="button flex-grow justify-start bg-stone-800 hover:bg-stone-600">
                          <IconTrashX /> Delete
                        </RadixContextMenu.Item>
                      </>
                    )
                  }
                />
              ))
            : !uploading && (
                <div
                  className={`flex h-24 items-center justify-center gap-2 rounded-t border-l border-r border-t border-solid border-gray-400 dark:border-stone-600 ${
                    dragActive ? "text-xl" : ""
                  }`}
                >
                  {dragActive ? (
                    <>
                      <IconUpload size={44} />
                      {t.drop_files_here}
                    </>
                  ) : (
                    "Brak plików"
                  )}
                </div>
              )}
          <div className="relative w-full">
            <label
              htmlFor="file"
              className="
              button 
              button-outline
              h-10 
              w-full  
              rounded-b
              rounded-t-none
              "
            >
              {uploading ? (
                <IconLoader2 className="animate-spin" />
              ) : (
                <IconPlus />
              )}
              {uploading ? t.uploading : t.add_files}
            </label>
            <input
              id="file"
              type="file"
              className="absolute inset-0 -z-10 opacity-0"
              onChange={handleChange}
              multiple
            />
          </div>
          {error && <div className="text-red-500">{error}</div>}
        </div>
      </div>
    </div>
  );
};

export default EditableFiles;
