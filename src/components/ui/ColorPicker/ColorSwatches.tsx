import Button from "@/components/ui/Button";
import { ScrollArea } from "@/components/ui/ScrollArea";
import SimpleTooltip from "@/components/ui/SimpleTooltip";
import { IconNote, IconNoteOff } from "@tabler/icons-react";
import { useId, useState } from "react";

// Scroll in color palette will not work in modal due to radix bug (25.05.2023)
// Fix: Scroll maybe??? broken

interface ColorSwatchesProps {
  colors: { [key: string]: { [key: string]: string } };
  onClick?: (hex: string) => void;
  className: string;
}

function ColorSwatches(props: ColorSwatchesProps) {
  const { colors, onClick, className } = props;
  const uuid = useId();
  const [disableColorTooltip, _setDisableColorTooltip] = useState<boolean>(
    localStorage.getItem("disableColorTooltip") === "1",
  );

  const setDisableColorTooltip = (value: boolean) => {
    _setDisableColorTooltip(value);
    localStorage.setItem("disableColorTooltip", value ? "1" : "0");
  };

  return (
    <ScrollArea className={`relative${className ?? ""}`}>
      <div className="relative flex w-fit flex-col gap-4">
        <Button
          size="icon"
          variant="ghost"
          className="absolute top-0 right-4 h-6 w-6 border-none p-0 dark:hover:bg-transparent hover:bg-transparent"
          onClick={() => setDisableColorTooltip(!disableColorTooltip)}
        >
          {disableColorTooltip ? <IconNoteOff /> : <IconNote />}
        </Button>
        {Object.keys(colors).map((key, index) => (
          <div key={`${key}_${index}_${uuid}`} className="flex flex-col gap-2">
            {!key.startsWith("_") && <span className="pl-2">{key}</span>}
            <div className="flex flex-wrap gap-2">
              {/* biome-ignore lint/style/noNonNullAssertion: This should NEVER be null */}
              {Object.keys(colors[key]!).map((colorName, colorIndex) => (
                <SimpleTooltip
                  key={`${key}_${index}_${colorIndex}_${uuid}`}
                  tooltip={colorName}
                  position="top"
                  align={
                    colorIndex % 11 < 2
                      ? "start"
                      : colorIndex % 11 > 8
                        ? "end"
                        : "center"
                  }
                  disabled={disableColorTooltip}
                >
                  {/* biome-ignore lint/a11y/useKeyWithClickEvents: TODO: make this work with keyboard */}
                  <div
                    className="h-6 w-6 rounded"
                    style={{ background: colors[key]?.[colorName] }}
                    // biome-ignore lint/style/noNonNullAssertion: This should NEVER be null
                    onClick={() => onClick?.(colors[key]?.[colorName]!)}
                  />
                </SimpleTooltip>
              ))}
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}

export default ColorSwatches;
