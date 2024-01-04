import { useEffect, useState } from "react";

import { IconPlus } from "@tabler/icons-react";

import EditableText from "@/components/editable/EditableText";
import Button from "@/components/ui/Button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/Dialog";
import { api } from "@/utils/api";
import Editable from "@/components/editable/Editable";

interface UserAddModalProps {
  opened: boolean;
  onClose: (id?: string) => void;
}

const defaultData = { username: "", email: "" };

const UserAddModal = ({ opened, onClose }: UserAddModalProps) => {
  const [data, setData] = useState<{ username: string; email: string }>(
    defaultData,
  );

  const [error, setError] = useState<string | null>(null);
  const { mutateAsync: createUser } = api.user.create.useMutation();

  useEffect(() => {
    if (!opened) {
      setData(defaultData);
      setError(null);
    }
  }, [opened]);

  return (
    <Dialog open={opened} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogTitle>Utwórz nowego pracownika</DialogTitle>
        <Editable
          data={data}
          onSubmit={(key, val) => {
            setData((prev) => ({ ...prev, [key]: val }));
          }}
        >
          <EditableText label="Nazwa użytkownika" keyName="username" required />
          <EditableText label="Email" keyName="email" required />

          <Button
            onClick={() => {
              if (data.username.length == 0)
                return setError("Musisz podać nie pustą nazwę użytkownika");

              createUser({ name: data.username, email: data.email })
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
        </Editable>
      </DialogContent>
    </Dialog>
  );
};

export default UserAddModal;
