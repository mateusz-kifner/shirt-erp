import { type FlagGroups, useFlag, userFlags } from "@/hooks/useFlag";
import { cn } from "@/utils/cn";
import { extractZodProperties } from "@/utils/extractZodProperties";
import { useId, type ComponentType, type ReactElement } from "react";
import { z } from "zod";

interface FlagSettingsProps {
  group: FlagGroups;
  EnumComponent: ComponentType<{
    name: string;
    onChange?: (value: string) => void;
    onToggle?: () => void;
    initialValue: string;
    options: string[];
  }>;
  BooleanComponent: ComponentType<{
    name: string;
    onChange?: (value: boolean) => void;
    onToggle?: () => void;
    initialValue: boolean;
  }>;
  StringComponent: ComponentType<{
    name: string;
    onChange: (value: string) => void;
    initialValue: string;
  }>;
  className: string;
}

function FlagSettings(props: FlagSettingsProps) {
  const { group, StringComponent, EnumComponent, BooleanComponent, className } =
    props;
  const { flags, set, toggle } = useFlag<any>(group);

  const userFlagsPropertiesAll =
    extractZodProperties<typeof userFlags>(userFlags);

  const userFlagsProperties = userFlagsPropertiesAll[group];
  const uuid = useId();
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {flags &&
        Object.keys(flags).map((name, index) => {
          if (userFlagsProperties[name].type === "ZodEnum") {
            return (
              <EnumComponent
                key={`${uuid}${index}`}
                onChange={(value: string) =>
                  set(name as keyof typeof flags, value as any)
                }
                onToggle={() => toggle(name as keyof typeof flags)}
                initialValue={flags[name as keyof typeof flags]}
                options={userFlagsProperties[name].values}
                name={name}
              />
            );
          }
          if (userFlagsProperties[name].type === "ZodBoolean") {
            return (
              <BooleanComponent
                key={`${uuid}${index}`}
                onChange={(value: boolean) =>
                  set(name as keyof typeof flags, value as any)
                }
                onToggle={() => toggle(name as keyof typeof flags)}
                initialValue={flags[name as keyof typeof flags]}
                name={name}
              />
            );
          }
          if (userFlagsProperties[name].type === "ZodString") {
            return (
              <StringComponent
                key={`${uuid}${index}`}
                onChange={(value: string) =>
                  set(name as keyof typeof flags, value as any)
                }
                initialValue={flags[name as keyof typeof flags]}
                name={name}
              />
            );
          }

          return (
            <div>
              {"[NOT Implemented]"} {name} {userFlagsProperties[name].type}
            </div>
          );
        })}
    </div>
  );
}

export default FlagSettings;
