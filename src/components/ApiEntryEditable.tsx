import { useLoaded } from "@/hooks/useLoaded";
import { api } from "@/utils/api";
import { IconRefresh } from "@tabler/icons-react";
import { useRouter } from "next/router";
import { useId, useState } from "react";
import Editable from "./editable/Editable";
import ActionButton from "./ui/ActionButton";
// import ApiStatusIndicator from "./ApiStatusIndicator"

interface ApiEntryEditableProps<EntryType = any> {
  template: any;
  entryName: string;
  id: number | null;
  allowDelete?: boolean;
  disabled?: boolean;
}

const ApiEntryEditable = <EntryType,>({
  template,
  entryName,
  id,
  allowDelete = false,
  disabled = false,
}: ApiEntryEditableProps<EntryType>) => {
  const uuid = useId();
  const { data, refetch } = api[entryName as "client"].getById.useQuery(
    id as number,
    {
      enabled: id !== null,
    }
  );
  const { mutate: update } = api[entryName as "client"].update.useMutation({
    onSuccess: () => {
      refetch().catch((err) => console.log(err));
    },
  });
  const { mutate: deleteById } =
    api[entryName as "client"].deleteById.useMutation();

  const isLoaded = useLoaded();

  // const { data, update, remove, refetch } = useStrapi<EntryType>(
  //   entryName,
  //   id,
  //   {
  //     query: "populate=*",
  //   }
  // );
  const [status, setStatus] = useState<
    "loading" | "idle" | "error" | "success"
  >("idle");

  const router = useRouter();

  const apiUpdate = (key: string, val: any) => {
    if (!isLoaded) return;
    // @ts-ignore
    update({ id: data?.id, [key]: val });
    // console.log(key, val);
    /**/
  };
  //   setStatus("loading");
  //   update({ [key]: val } as Partial<EntryType>)
  //     .then((val) => {
  //       setStatus("success");
  //     })
  //     .catch((err) => {
  //       setStatus("error");
  //     });
  // };

  // const onDelete = () => {
  //   id &&
  //     remove(id)
  //       .then(() => router.push("."))
  //       .catch(() => {});
  // };

  return (
    <div className=" flex min-h-[200px] flex-grow flex-col gap-2">
      {data && Object.keys(data).length > 0 ? (
        <>
          {/* <div className="relative flex min-h-[200px] flex-col"> */}
          <Editable
            template={template}
            data={data as any}
            onSubmit={apiUpdate}
            disabled={disabled}
          />
          {/* </div> */}
          {/* {allowDelete && (
            <DeleteButton
              label={`${entryName}.singular`}
              onDelete={onDelete}
              buttonProps={{ mt: "4rem" }}
            />
          )} */}
        </>
      ) : (
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          Brak danych
        </div>
      )}
      {/* <ApiStatusIndicator
        status={status}
        style={{
          position: "fixed",
          top: "calc(var(--mantine-header-height, 0px) + 8px)",
          right: 8,
        }}
      /> */}
      {id !== null && (
        <ActionButton
          className="fixed right-4 top-[5.5] h-11 w-11 rounded-full border border-solid  border-gray-400  bg-white  dark:border-stone-600 dark:bg-stone-800 dark:hover:bg-stone-700"
          onClick={() => {
            refetch().catch(() => {
              /**/
            });
          }}
        >
          <IconRefresh size={24} />
        </ActionButton>
      )}
    </div>
  );
};

export default ApiEntryEditable;
