import Button from "@/components/ui/Button";
import { Checkbox } from "@/components/ui/Checkbox";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";
import { env } from "@/env";
import useTranslation from "@/hooks/useTranslation";
import { trpc } from "@/utils/trpc";
import { IconPlus, IconTrashX } from "@tabler/icons-react";
import { useId, useState } from "react";

function EmailCredentials() {
  const uuid = useId();
  const t = useTranslation();
  const { data, refetch } = trpc.settings.getAllMailCredentials.useQuery();
  const { mutateAsync: createMailCredentialAsync } =
    trpc.settings.createMailCredential.useMutation();
  const { mutateAsync: deleteMailCredentialAsync } =
    trpc.settings.deleteMailCredential.useMutation();
  const [secure, setSecure] = useState(false);
  console.log(data);
  return (
    <div className="flex w-full flex-row items-start justify-center font-sans dark:text-gray-200">
      <div className="card mx-auto mt-8 w-[36rem] rounded bg-white p-2 shadow-xl dark:bg-stone-800">
        <div>
          {!env.NEXT_PUBLIC_DEMO ? (
            <form
              onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
                e.preventDefault();
                console.log(e);
                const form = e.target as typeof e.target & {
                  host: HTMLInputElement;
                  port: HTMLInputElement;
                  protocol: HTMLSelectElement;
                  user: HTMLInputElement;
                  password: HTMLInputElement;
                  secure: HTMLInputElement;
                };

                const hostInput = form.host;
                const portInput = form.port;
                const protocolInput = form.protocol;
                const userInput = form.user;
                const passwordInput = form.password;

                createMailCredentialAsync({
                  host: hostInput.value,
                  port: Number.parseInt(portInput.value),
                  protocol: protocolInput.value,
                  user: userInput.value,
                  password: passwordInput.value,
                  secure: secure,
                })
                  .then(() => refetch())
                  .catch(console.log);
              }}
            >
              <div>
                <Label htmlFor={`${uuid}:host:`} label="Host" />
                <Input id={`${uuid}:host:`} name="host" />
              </div>
              <div>
                <Label htmlFor={`${uuid}:port:`} label="Port" />
                <Input id={`${uuid}:port:`} name="port" />
              </div>
              <div>
                <Label label="Protocol" />
                <Select defaultValue="imap" name="protocol">
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder={`${t.select} ...`} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="imap">IMAP</SelectItem>
                    <SelectItem value="smtp">SMTP</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor={`${uuid}:user:`} label="User" />
                <Input id={`${uuid}:user:`} name="user" />
              </div>
              <div>
                <Label htmlFor={`${uuid}:password:`} label="Password" />
                <Input id={`${uuid}:password:`} name="password" />
              </div>
              <div className="flex h-12 items-center gap-2">
                <Label htmlFor={`${uuid}:secure:`} label="secure" />
                <Checkbox
                  id={`${uuid}:secure:`}
                  onCheckedChange={(checked) => setSecure(checked as boolean)}
                />
              </div>
              <Button>
                <IconPlus />
                {t.add}
              </Button>
            </form>
          ) : (
            <div> DEMO </div>
          )}
        </div>
        <hr className="mt-8 dark:border-stone-600" />

        <div className="flex flex-col gap-2">
          <div key={`${uuid}:heder`} className="flex flex-grow">
            <div className="w-32">Host</div>
            <div className="w-12">Port</div>
            <div className="w-20">Protocol</div>
            <div className="flex-grow">User</div>
          </div>
          {data?.map((val, index) => (
            <div key={`${uuid}:${index}:`} className="flex flex-grow">
              <div className="w-32">{val.host}</div>
              <div className="w-12">{val.port}</div>
              <div className="w-20">{val.protocol}</div>
              <div className="flex flex-grow items-start justify-between">
                {val.user}
                {!env.NEXT_PUBLIC_DEMO && (
                  <Button
                    size="icon"
                    variant="destructive"
                    onClick={() => {
                      deleteMailCredentialAsync(val.id)
                        .then(() => refetch())
                        .catch(console.log);
                    }}
                  >
                    <IconTrashX />
                  </Button>
                )}{" "}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default EmailCredentials;
