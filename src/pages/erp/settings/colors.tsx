import Button from "@/components/ui/Button";
import { useUserContext } from "@/context/userContext";
import useTranslation from "@/hooks/useTranslation";
import { IconMoonStars, IconSun } from "@tabler/icons-react";
interface ColorsProps {}

function Colors(props: ColorsProps) {
  const {} = props;
  const { toggleTheme, theme } = useUserContext();
  const t = useTranslation();

  return (
    <div className="flex flex-col gap-3">
      <Button
        onClick={toggleTheme}
        leftSection={theme === 1 ? <IconSun /> : <IconMoonStars />}
      >
        {theme === 1 ? t.light_theme : t.dark_theme}
      </Button>
      <div className="flex flex-col flex-wrap gap-2 p-2">
        <div className="flex gap-2">
          <div
            style={{ backgroundColor: "hsl(var(--border))" }}
            className="h-24 w-48 p-1"
          >
            <span
              className={
                theme === 1
                  ? "bg-black bg-opacity-50 p-1"
                  : "bg-white bg-opacity-50 p-1"
              }
            >
              border
            </span>
          </div>
          <div
            style={{ backgroundColor: "hsl(var(--input))" }}
            className="h-24 w-48 p-1"
          >
            <span
              className={
                theme === 1
                  ? "bg-black bg-opacity-50 p-1"
                  : "bg-white bg-opacity-50 p-1"
              }
            >
              input
            </span>
          </div>
          <div
            style={{ backgroundColor: "hsl(var(--ring))" }}
            className="h-24 w-48 p-1"
          >
            <span
              className={
                theme === 1
                  ? "bg-black bg-opacity-50 p-1"
                  : "bg-white bg-opacity-50 p-1"
              }
            >
              ring
            </span>
          </div>
        </div>
        <div className="flex gap-2">
          <div
            style={{ backgroundColor: "hsl(var(--background))" }}
            className="h-24 w-48 p-1"
          >
            <span
              className={
                theme === 1
                  ? "bg-black bg-opacity-50 p-1"
                  : "bg-white bg-opacity-50 p-1"
              }
            >
              background
            </span>
          </div>
          <div
            style={{ backgroundColor: "hsl(var(--foreground))" }}
            className="h-24 w-48 p-1"
          >
            <span
              className={
                theme === 1
                  ? "bg-black bg-opacity-50 p-1"
                  : "bg-white bg-opacity-50 p-1"
              }
            >
              foreground
            </span>
          </div>
        </div>
        <div className="flex gap-2">
          <div
            style={{ backgroundColor: "hsl(var(--primary))" }}
            className="h-24 w-48 p-1"
          >
            <span
              className={
                theme === 1
                  ? "bg-black bg-opacity-50 p-1"
                  : "bg-white bg-opacity-50 p-1"
              }
            >
              primary
            </span>
          </div>
          <div
            style={{ backgroundColor: "hsl(var(--primary-foreground))" }}
            className="h-24 w-48 p-1"
          >
            <span
              className={
                theme === 1
                  ? "bg-black bg-opacity-50 p-1"
                  : "bg-white bg-opacity-50 p-1"
              }
            >
              primary-foreground
            </span>
          </div>
          <div
            style={{
              backgroundColor: "hsl(var(--primary))",
              color: "hsl(var(--primary-foreground))",
            }}
            className="h-24 w-48 rounded-xl p-1"
          >
            <span className="text-xs">primary</span>
            <br />
            <span className="text-md">primary</span>
            <br />
            <span className="text-lg">primary</span>
          </div>
        </div>
        <div className="flex gap-2">
          <div
            style={{ backgroundColor: "hsl(var(--secondary))" }}
            className="h-24 w-48 p-1"
          >
            <span
              className={
                theme === 1
                  ? "bg-black bg-opacity-50 p-1"
                  : "bg-white bg-opacity-50 p-1"
              }
            >
              secondary
            </span>
          </div>
          <div
            style={{ backgroundColor: "hsl(var(--secondary-foreground))" }}
            className="h-24 w-48 p-1"
          >
            <span
              className={
                theme === 1
                  ? "bg-black bg-opacity-50 p-1"
                  : "bg-white bg-opacity-50 p-1"
              }
            >
              secondary-foreground
            </span>
          </div>
          <div
            style={{
              backgroundColor: "hsl(var(--secondary))",
              color: "hsl(var(--secondary-foreground))",
            }}
            className="h-24 w-48 rounded-xl p-1"
          >
            <span className="text-xs">secondary</span>
            <br />
            <span className="text-md">secondary</span>
            <br />
            <span className="text-lg">secondary</span>
          </div>
        </div>
        <div className="flex gap-2">
          <div
            style={{ backgroundColor: "hsl(var(--destructive))" }}
            className="h-24 w-48 p-1"
          >
            <span
              className={
                theme === 1
                  ? "bg-black bg-opacity-50 p-1"
                  : "bg-white bg-opacity-50 p-1"
              }
            >
              destructive
            </span>
          </div>
          <div
            style={{ backgroundColor: "hsl(var(--destructive-foreground))" }}
            className="h-24 w-48 p-1"
          >
            <span
              className={
                theme === 1
                  ? "bg-black bg-opacity-50 p-1"
                  : "bg-white bg-opacity-50 p-1"
              }
            >
              destructive-foreground
            </span>
          </div>
          <div
            style={{
              backgroundColor: "hsl(var(--destructive))",
              color: "hsl(var(--destructive-foreground))",
            }}
            className="h-24 w-48 rounded-xl p-1"
          >
            <span className="text-xs">destructive</span>
            <br />
            <span className="text-md">destructive</span>
            <br />
            <span className="text-lg">destructive</span>
          </div>
        </div>
        <div className="flex gap-2">
          <div
            style={{ backgroundColor: "hsl(var(--muted))" }}
            className="h-24 w-48 p-1"
          >
            <span
              className={
                theme === 1
                  ? "bg-black bg-opacity-50 p-1"
                  : "bg-white bg-opacity-50 p-1"
              }
            >
              muted
            </span>
          </div>
          <div
            style={{ backgroundColor: "hsl(var(--muted-foreground))" }}
            className="h-24 w-48 p-1"
          >
            <span
              className={
                theme === 1
                  ? "bg-black bg-opacity-50 p-1"
                  : "bg-white bg-opacity-50 p-1"
              }
            >
              muted-foreground
            </span>
          </div>
          <div
            style={{
              backgroundColor: "hsl(var(--muted))",
              color: "hsl(var(--muted-foreground))",
            }}
            className="h-24 w-48 rounded-xl p-1"
          >
            <span className="text-xs">muted</span>
            <br />
            <span className="text-md">muted</span>
            <br />
            <span className="text-lg">muted</span>
          </div>
        </div>
        <div className="flex gap-2">
          <div
            style={{ backgroundColor: "hsl(var(--accent))" }}
            className="h-24 w-48 p-1"
          >
            <span
              className={
                theme === 1
                  ? "bg-black bg-opacity-50 p-1"
                  : "bg-white bg-opacity-50 p-1"
              }
            >
              accent
            </span>
          </div>
          <div
            style={{ backgroundColor: "hsl(var(--accent-foreground))" }}
            className="h-24 w-48 p-1"
          >
            <span
              className={
                theme === 1
                  ? "bg-black bg-opacity-50 p-1"
                  : "bg-white bg-opacity-50 p-1"
              }
            >
              accent-foreground
            </span>
          </div>
          <div
            style={{
              backgroundColor: "hsl(var(--accent))",
              color: "hsl(var(--accent-foreground))",
            }}
            className="h-24 w-48 rounded-xl p-1"
          >
            <span className="text-xs">accent</span>
            <br />
            <span className="text-md">accent</span>
            <br />
            <span className="text-lg">accent</span>
          </div>
        </div>
        <div className="flex gap-2">
          <div
            style={{ backgroundColor: "hsl(var(--popover))" }}
            className="h-24 w-48 p-1"
          >
            <span
              className={
                theme === 1
                  ? "bg-black bg-opacity-50 p-1"
                  : "bg-white bg-opacity-50 p-1"
              }
            >
              popover
            </span>
          </div>
          <div
            style={{ backgroundColor: "hsl(var(--popover-foreground))" }}
            className="h-24 w-48 p-1"
          >
            <span
              className={
                theme === 1
                  ? "bg-black bg-opacity-50 p-1"
                  : "bg-white bg-opacity-50 p-1"
              }
            >
              popover-foreground
            </span>
          </div>
          <div
            style={{
              backgroundColor: "hsl(var(--popover))",
              color: "hsl(var(--popover-foreground))",
            }}
            className="h-24 w-48 rounded-xl p-1"
          >
            <span className="text-xs">popover</span>
            <br />
            <span className="text-md">popover</span>
            <br />
            <span className="text-lg">popover</span>
          </div>
        </div>
        <div className="flex gap-2">
          <div
            style={{ backgroundColor: "hsl(var(--card))" }}
            className="h-24 w-48 p-1"
          >
            <span
              className={
                theme === 1
                  ? "bg-black bg-opacity-50 p-1"
                  : "bg-white bg-opacity-50 p-1"
              }
            >
              card
            </span>
          </div>
          <div
            style={{ backgroundColor: "hsl(var(--card-foreground))" }}
            className="h-24 w-48 p-1"
          >
            <span
              className={
                theme === 1
                  ? "bg-black bg-opacity-50 p-1"
                  : "bg-white bg-opacity-50 p-1"
              }
            >
              card-foreground
            </span>
          </div>
          <div
            style={{
              backgroundColor: "hsl(var(--card))",
              color: "hsl(var(--card-foreground))",
            }}
            className="h-24 w-48 rounded-xl p-1"
          >
            <span className="text-xs">card</span>
            <br />
            <span className="text-md">card</span>
            <br />
            <span className="text-lg">card</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Colors;
