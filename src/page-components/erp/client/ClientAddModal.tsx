import { useEffect, useState } from "react";

import { IconPlus } from "@tabler/icons-react";
import { useRouter } from "next/router";

import EditableApiEntry from "@/components/editable/EditableApiEntry";
import EditableText from "@/components/editable/EditableText";
import Button from "@/components/ui/Button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/Dialog";
import { type ClientType } from "@/schema/clientSchema";
import { api } from "@/utils/api";
import { omit } from "lodash";
import ClientListItem from "./ClientListItem";

interface ClientAddModalProps {
  opened: boolean;
  onClose: (id?: number) => void;
}

const ClientAddModal = ({ opened, onClose }: ClientAddModalProps) => {
  const router = useRouter();
  const [username, setUsername] = useState<string>("Klient");
  const [template, setTemplate] = useState<Partial<ClientType> | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { mutate: createClient } = api.client.create.useMutation({
    onSuccess(data) {
      // router.push(`/erp/client/${data.id}`).catch((e) => {
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
            entryName="clients"
            Element={ClientListItem}
            onSubmit={setTemplate}
            value={template}
            withErase
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
                address: template?.address
                  ? omit(template.address, "id")
                  : null,
                username: username,
                orders: [],
                "orders-archive": [],
              };
              createClient(new_client);
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
