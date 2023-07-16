import { useDebouncedValue } from "@mantine/hooks";
import { IconSearch, IconX } from "@tabler/icons-react";
import { useState } from "react";
import Button from "../ui/Button";
import { Dialog, DialogContent, DialogTrigger } from "../ui/Dialog";
import { Input } from "../ui/Input";

interface SearchProps {}

function Search(props: SearchProps) {
  const {} = props;
  const [query, setQuery] = useState("");
  const [debouncedQuery] = useDebouncedValue(query, 200);
  return (
    <Dialog modal={true}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon" className="rounded-full">
          <IconSearch className="stroke-gray-200" />
        </Button>
      </DialogTrigger>
      <DialogContent disableClose className=" top-24 p-2">
        <Input
          className="h-12"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <Button
          size="icon"
          variant="ghost"
          className="absolute right-5 top-5 h-6 w-6 rounded-full"
          onClick={() => setQuery("")}
        >
          <IconX size={18} />
        </Button>
      </DialogContent>
    </Dialog>
  );
}

export default Search;
