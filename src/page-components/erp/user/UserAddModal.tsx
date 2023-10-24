import { useEffect, useState } from "react";

import { IconPlus } from "@tabler/icons-react";

import EditableText from "@/components/editable/EditableText";
import Button from "@/components/ui/Button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/Dialog";
import { api } from "@/utils/api";
import { omit } from "lodash";
import UserListItem from "./UserListItem";

interface UserAddModalProps {
  opened: boolean;
  onClose: (id?: string) => void;
}

const UserAddModal = ({ opened, onClose }: UserAddModalProps) => {
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");

  const [error, setError] = useState<string | null>(null);
  const { mutateAsync: createUser } = api.user.create.useMutation();

  useEffect(() => {
    if (!opened) {
      setUsername("");
      setEmail("");
      setError(null);
    }
  }, [opened]);

  return (
    <Dialog open={opened} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogTitle>Utwórz nowego pracownika</DialogTitle>
        <div className="flex flex-col gap-2">
          <EditableText
            label="Nazwa użytkownika"
            onSubmit={(val) => {
              val && setUsername(val);
            }}
            value={username}
            required
          />
          <EditableText
            label="Email"
            onSubmit={(val) => {
              val && setEmail(val);
            }}
            value={email}
            required
          />

          <Button
            onClick={() => {
              if (username.length == 0)
                return setError("Musisz podać nie pustą nazwę użytkownika");

              createUser({ name: username, email })
                .then((data) => data && onClose(data.id))
                .catch(() => {
                  setError("Klient o takiej nazwie istnieje.");
                });
            }}
            className="mt-4"
          >
            <IconPlus />
            Utwórz klienta
          </Button>
          <div className="text-red-600">{error}</div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UserAddModal;
