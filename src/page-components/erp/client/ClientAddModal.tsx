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
import Editable from "@/components/editable/Editable";

interface ClientAddModalProps {
  opened: boolean;
  onClose: (id?: number) => void;
}

const defaultData = { username: "Klient", template: null };

const ClientAddModal = ({ opened, onClose }: ClientAddModalProps) => {
  const [data, setData] = useState<{
    username: string;
    template: Partial<ClientWithRelations> | null;
  }>(defaultData);
  const [error, setError] = useState<string | null>(null);
  const { mutateAsync: createClient } = api.client.create.useMutation();

  useEffect(() => {
    if (!opened) {
      setData(defaultData);
      setError(null);
    }
  }, [opened]);

  return (
    <Dialog open={opened} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogTitle>Utwórz nowego klienta</DialogTitle>
        <div className="flex flex-col gap-2">
          <Editable
            data={data}
            onSubmit={(key, val) => {
              setData((prev) => ({ ...prev, [key]: val }));
            }}
          >
            <EditableApiEntry
              label="Szablon"
              keyName="template"
              entryName="clients"
              Element={ClientListItem}
              allowClear
              listProps={{ defaultSearch: "Szablon", filterKeys: ["username"] }}
            />
            <EditableText
              label="Nazwa użytkownika"
              keyName="username"
              required
            />
          </Editable>

          <Button
            onClick={() => {
              if (data.username.length == 0)
                return setError("Musisz podać nie pustą nazwę użytkownika");
              const new_client = {
                ...(data.template ? omit(data.template, "id") : {}),
                username: data.username,
                orders: [],
                "orders-archive": [],
              };
              if (data.template?.address) {
                new_client.address = omit(data.template.address, "id");
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
