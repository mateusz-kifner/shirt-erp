import { useLocalStorage } from "@mantine/hooks";
import { useEffect } from "react";
import { useLoaded } from "./useLoaded";
import { type ZodDefault, z } from "zod";
import { flags, type Flags } from "@/components/Flags/flags";

export type FlagGroups = keyof Flags;

export function useFlag<T extends FlagGroups = "root">(group: T) {
  const [flagData, setFlagData] = useLocalStorage<Flags | undefined>({
    key: "flags",
    defaultValue: undefined,
  });
  const isLoaded = useLoaded();
  const set = <K extends keyof Flags[T]>(name: K, value: Flags[T][K]) => {
    if (flagData === undefined) return;
    const val = { ...flagData } as Flags;
    val[group][name] = value;
    setFlagData(val); // cannot use (prev)=>{} due to bug in localstorage hook
  };

  const toggle = (name: keyof Flags[T]) => {
    if (flagData === undefined) return;

    const zInternalGroup = flags._def.innerType._def
      .shape()
      [group]._def.innerType._def.shape();
    const zInternal = zInternalGroup[
      name as keyof typeof zInternalGroup
    ] as ZodDefault<any>;
    if (zInternal._def.typeName !== "ZodDefault")
      throw new Error(
        "[Flags]: All flags need to have default value set via .default()",
      );
    const zInternalValidatorDef = zInternal._def.innerType._def;

    if (zInternalValidatorDef.typeName === "ZodEnum") {
      const options: string[] = zInternalValidatorDef.values;

      const val = { ...flagData } as any;
      const lastVal = val[group][name] ?? options[options.length - 1];
      const index = options.findIndex((e) => e === lastVal);
      if (options.length === 0) throw new Error("[Flags]: Enum has no options");
      if (index === -1) return undefined;

      if (index === options.length - 1) {
        val[group][name] = options[0] as string;
      }
      if (index < options.length - 1) {
        val[group][name] = options[index + 1] as string;
      }
      setFlagData(val); // cannot use (prev)=>{} due to bug in localstorage hook
    } else if (zInternalValidatorDef.typeName === "ZodBoolean") {
      const val = { ...flagData } as any;
      val[group][name] = !val[group][name];
      setFlagData(val); // cannot use (prev)=>{} due to bug in localstorage hook
    } else {
      throw new Error("[Flags]: Cannot be toggled");
    }
  };

  useEffect(() => {
    if (isLoaded) {
      try {
        const validated = flags.parse(flagData);
        setFlagData(validated);
      } catch (err) {
        console.log("[Flags]: Validation error");
      }
    }
  }, [isLoaded]);

  return {
    flags: flagData?.[group],
    set,
    toggle,
  };
}
