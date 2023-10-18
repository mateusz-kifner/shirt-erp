import { useEffect, useState } from "react";

import EditableApiEntry from "@/components/editable/EditableApiEntry";
import EditableText from "@/components/editable/EditableText";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/Dialog";
import { type User } from "@/schema/userZodSchema";
// import { api } from "@/utils/api";
import UserListItem from "./UserListItem";

interface UserAddModalProps {
  opened: boolean;
  onClose: (id?: number) => void;
}

const UserAddModal = ({ opened, onClose }: UserAddModalProps) => {
  const [username, setUsername] = useState<string>("Użytkownik");
  const [template, setTemplate] = useState<Partial<User> | null>(null);
  const [error, setError] = useState<string | null>(null);
  // const { mutateAsync: createUser } = api.user.create.useMutation();

  useEffect(() => {
    if (!opened) {
      setUsername("Użytkownik");
      // setTemplate(null);
      setError(null);
    }
  }, [opened]);

  return (
    <Dialog open={opened} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogTitle>Utwórz nowego użytkownika</DialogTitle>
        <div className="flex flex-col gap-2">
          {/* <EditableApiEntry
            label="Szablon"
            entryName="users"
            Element={UserListItem}
            onSubmit={setTemplate}
            value={template ?? undefined}
            allowClear
            listProps={{ defaultSearch: "Szablon", filterKeys: ["name"] }}
          /> */}
          <EditableText
            label="Nazwa użytkownika"
            onSubmit={(val) => {
              val && setUsername(val);
            }}
            value={username}
            required
          />

          {/* <Button
          onClick={() => {
            if (username.length == 0)
              return setError("Musisz podać nie pustą nazwę użytkownika");
            const new_user = {
              ...(template ? omit(template, "id") : {}),
              username: username,
            };
            createUser(new_user).then((data)=>onClose(data.id)).catch((e)=>{
              console.log(e)
              setError("Użytkownik o takiej nazwie istnieje.");
            })
          }}
          className="mt-4"
        >
          <IconPlus />
          Utwórz klienta
        </Button> */}
          <div className="text-red-600">{error}</div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UserAddModal;
