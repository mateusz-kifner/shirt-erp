import { useLocalStorage } from "@mantine/hooks";
import { useEffect } from "react";
import { type ZodDefault, z } from "zod";

export const userFlags = z
  .object({
    root: z
      .object({
        editable_address_mode: z
          .enum(["popup", "extend", "always_visible"])
          .default("always_visible"),
        mobile_override: z.enum(["auto", "mobile", "desktop"]).default("auto"),
      })
      .default({}),
    navigation: z
      .object({
        main_navigation_type: z.enum(["icons", "list"]).default("list"),
        main_navigation_hover: z.boolean().default(false),
      })
      .default({}),
    calendar: z
      .object({
        default_click: z.enum(["order", "task"]).default("task"),
        default_view_mode: z.enum(["month", "week"]).default("month"),
        default_data_source: z.enum(["all", "user"]).default("user"),
      })
      .default({}),
  })
  .default({});

export type UserFlags = z.infer<typeof userFlags>;

export type FlagGroups = keyof UserFlags;

export function useFlag<T extends FlagGroups = "root">(group: T) {
  const [flagData, setFlagData] = useLocalStorage<UserFlags | undefined>({
    key: "flags",
    defaultValue: undefined,
  });
  const set = <K extends keyof UserFlags[T]>(
    name: K,
    value: UserFlags[T][K],
  ) => {
    if (flagData === undefined) return;
    const val = { ...flagData } as UserFlags;
    val[group][name] = value;
    setFlagData(val); // cannot use (prev)=>{} due to bug in localstorage hook
  };

  const toggle = (name: keyof UserFlags[T]) => {
    if (flagData === undefined) return;

    const zInternalGroup = userFlags._def.innerType._def
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
    try {
      const validated = userFlags.parse(flagData);
      setFlagData(validated);
    } catch (err) {
      console.log("[Flags]: Validation error");
    }
  }, []);

  return {
    flags: flagData?.[group],
    set,
    toggle,
  };
}
