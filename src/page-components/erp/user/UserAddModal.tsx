import { useEffect, useState } from "react";

import { useRouter } from "next/router";

import EditableApiEntry from "@/components/editable/EditableApiEntry";
import EditableText from "@/components/editable/EditableText";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/Dialog";
import { type UserType } from "@/schema/userSchema";
import { api } from "@/utils/api";
import UserListItem from "./UserListItem";

interface UserAddModalProps {
  opened: boolean;
  onClose: (id?: number) => void;
}

const UserAddModal = ({ opened, onClose }: UserAddModalProps) => {
  const router = useRouter();
  const [username, setUsername] = useState<string>("Klient");
  const [template, setTemplate] = useState<Partial<UserType> | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { mutate: createUser } = api.user.create.useMutation({
    onSuccess(data) {
      // router.push(`/erp/user/${data.id}`).catch((e) => {
      //   throw e;
      // });
      onClose(data.id);
    },
    onError(error) {
      setError("Klient o takiej nazwie istnieje.");
    },
  });

  useEffect(() => {
    if (!opened) {
      setUsername("Klient");
      // setTemplate(null);
      setError(null);
    }
  }, [opened]);

  return (
    <Dialog open={opened} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogTitle>Utwórz nowego klienta</DialogTitle>
        <div className="flex flex-col gap-2">
          <EditableApiEntry
            label="Szablon"
            entryName="users"
            Element={UserListItem}
            onSubmit={setTemplate}
            value={template}
            allowClear
            listProps={{ defaultSearch: "Szablon", filterKeys: ["username"] }}
          />
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
            createUser(new_user);
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
