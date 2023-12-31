import EditableInput from "@/schema/EditableInput";
import { useId, useRef, useState } from "react";
import { useEditableContext } from "./Editable";
import { Label } from "../ui/Label";
import { IconX } from "@tabler/icons-react";

import { Badge } from "@/components/ui/Badge";
import { Command, CommandGroup, CommandItem } from "@/components/ui/Command";
import { CommandInput as CommandPrimitiveInput } from "cmdk";
import { api } from "@/utils/api";

interface EditableMultiSelectProps extends EditableInput<string[]> {
  enumData?: string[];
  entryCategory?: string;
  collapse?: boolean;
  freeInput?: boolean;
}

function EditableMultiSelect(props: EditableMultiSelectProps) {
  const {
    enumData,
    label,
    value,
    onSubmit,
    disabled,
    required,
    collapse = false,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    keyName,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    rightSection,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    leftSection,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    data,
    entryCategory,
    freeInput,
    ...moreProps
  } = useEditableContext(props);
  console.log(value);
  const uuid = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);
  // const [selected, setSelected] = useState<string[]>();
  const selected = value ?? [];
  const setSelected = (data: string[]) => onSubmit(data);
  const [inputValue, setInputValue] = useState("");

  const { data: globalPropertiesData } = api[
    "global-properties"
  ].getByCategory.useQuery(entryCategory as string, {
    enabled: entryCategory !== undefined,
  });

  console.log(globalPropertiesData);

  const handleUnselect = (enum_string: string) => {
    console.log(enum_string, selected);
    setSelected(selected.filter((s: string) => s !== enum_string));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const input = inputRef.current;
    if (input) {
      if (e.key === "Delete" || e.key === "Backspace") {
        if (input.value === "") {
          console.log(selected);
          const newSelected = [...selected];
          newSelected.pop();
          setSelected(newSelected);
        }
      }
      // This is not a default behaviour of the <input /> field
      if (e.key === "Escape") {
        input.blur();
      }
    }
  };

  const selectables = (enumData ?? []).filter(
    (enumString) => !selected.includes(enumString),
  );

  const value_str = value?.reduce(
    (prev, next, index) => (index == 0 ? next : prev + ", " + next),
    "",
  );

  return (
    <div className={`flex flex-grow  ${collapse ? "gap-3 pt-3" : "flex-col"}`}>
      <Label label={label} copyValue={value_str} required={required} />
      <Command
        onKeyDown={handleKeyDown}
        className="overflow-visible bg-transparent"
      >
        <div className="group rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-within:ring-2 focus-within:ring-ring ">
          <div className="flex flex-wrap gap-1">
            {selected.map((s) => {
              return (
                <Badge
                  key={`${uuid}${s}`}
                  variant="secondary"
                  className={
                    s === inputValue
                      ? "border-transparent bg-green-700 hover:bg-green-700/80"
                      : undefined
                  }
                >
                  {s}
                  <button
                    className="ml-1 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleUnselect(s);
                      }
                    }}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                    onClick={() => handleUnselect(s)}
                  >
                    <IconX className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                  </button>
                </Badge>
              );
            })}
            {/* Avoid having the "Search" Icon */}
            <CommandPrimitiveInput
              ref={inputRef}
              value={inputValue}
              onValueChange={setInputValue}
              onBlur={() => setOpen(false)}
              onFocus={() => setOpen(true)}
              placeholder="Select..."
              className="ml-2 flex-1 bg-transparent outline-none placeholder:text-muted-foreground"
            />
          </div>
        </div>
        <div className="relative mt-2">
          {open && (selectables.length > 0 || freeInput) ? (
            <div className="absolute top-0 z-10 w-full rounded-md border bg-popover text-popover-foreground shadow-md outline-none animate-in">
              <CommandGroup className="h-full overflow-auto">
                {freeInput &&
                inputValue.length > 0 &&
                !selected.includes(inputValue) ? (
                  <CommandItem
                    key={`${uuid}freeinput:`}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                    onSelect={(_v) => {
                      setSelected([...selected, inputValue]);
                      setInputValue("");
                    }}
                    className={"cursor-pointer"}
                  >
                    {inputValue}
                  </CommandItem>
                ) : null}
                {selectables.map((s) => {
                  return (
                    <CommandItem
                      key={`${uuid}${s}`}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                      }}
                      onSelect={(_v) => {
                        setInputValue("");
                        setSelected([...selected, s]);
                      }}
                      className={"cursor-pointer"}
                    >
                      {s}
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            </div>
          ) : null}
        </div>
      </Command>
    </div>
  );
}

export default EditableMultiSelect;
