import { useState } from "react";

import { IconPlus } from "@tabler/icons-react";

import Button from "@/components/ui/Button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/Dialog";

interface EmailSendModalProps {
  opened: boolean;
  onClose: (id?: number) => void;
}

const EmailSendModal = ({ opened, onClose }: EmailSendModalProps) => {
  const [error] = useState<string | null>(null);
  // const { mutate: createEmail } = trpc.product.create.useMutation({
  //   onSuccess(data) {
  //     //void  router.push(`/erp/product/${data.id}`)
  //     onClose(data.id);
  //   },
  //   onError(error) {
  //     setError("Produkt o takiej nazwie już istnieje.");
  //   },
  // });

  // useEffect(() => {
  //   if (!opened) {
  //     setEmailName("Produkt");
  //     // setTemplate(null);
  //     setError(null);
  //   }
  // }, [opened]);

  return (
    <Dialog open={opened} onOpenChange={() => onClose()}>
      <DialogContent>
        <DialogTitle>Wyslij maila</DialogTitle>
        <div className="flex flex-col gap-2">
          {/* <EditableApiEntry
            label="Szablon"
            entryName="products"
            Element={EmailListItem}
            onSubmit={setTemplate}
            value={template}
            allowClearr
            listProps={{ defaultSearch: "Szablon", filterKeys: ["username"] }}
          />
          <EditableText
            label="Nazwa użytkownika"
            onSubmit={(val) => {
              val && setEmailName(val);
            }}
            value={productName}
            required
          /> */}

          <Button
            onClick={() => {
              // if (productName.length == 0)
              //   return setError("Musisz podać nie pustą nazwę produktu");
              // const new_mail = {
              // };
              // createMail({  });
            }}
            className="mt-4"
          >
            <IconPlus />
            Wyślij
          </Button>
          <div className="text-red-600">{error}</div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EmailSendModal;
