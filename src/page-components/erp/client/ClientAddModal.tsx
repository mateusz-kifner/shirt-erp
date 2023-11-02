import { useEffect, useState } from "react";

import { IconPlus } from "@tabler/icons-react";

import EditableApiEntry from "@/components/editable/EditableApiEntry";
import EditableText from "@/components/editable/EditableText";
import Button from "@/components/ui/Button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/Dialog";
import { type ClientWithRelations } from "@/schema/clientZodSchema";
import { api } from "@/utils/api";
import { omit } from "lodash";
import ClientListItem from "./ClientListItem";

interface ClientAddModalProps {
  opened: boolean;
  onClose: (id?: number) => void;
}

const ClientAddModal = ({ opened, onClose }: ClientAddModalProps) => {
  const [username, setUsername] = useState<string>("Klient");
  const [template, setTemplate] = useState<Partial<ClientWithRelations> | null>(
    null,
  );
  const [error, setError] = useState<string | null>(null);
  const { mutateAsync: createClient } = api.client.create.useMutation();

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
            entryName="clients"
            Element={ClientListItem}
            onSubmit={setTemplate}
            value={template ?? undefined}
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

          <Button
            onClick={() => {
              if (username.length == 0)
                return setError("Musisz podać nie pustą nazwę użytkownika");
              const new_client = {
                ...(template ? omit(template, "id") : {}),
                username: username,
                orders: [],
                "orders-archive": [],
              };
              if (template?.address) {
                new_client.address = omit(template.address, "id");
              }

              createClient(new_client)
                .then((data) => onClose(data.id))
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

export default ClientAddModal;
