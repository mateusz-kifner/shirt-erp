import Button from "@/components/ui/Button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { useUserContext } from "@/context/userContext";
import TestAccordion from "@/page-components/erp/settings/TestAccordion";
import TestAlert from "@/page-components/erp/settings/TestAlert";
import TestAlertDialog from "@/page-components/erp/settings/TestAlertDialog";
import TestAspectRatio from "@/page-components/erp/settings/TestAspectRatio";
import TestBadge from "@/page-components/erp/settings/TestBadge";
import TestButton from "@/page-components/erp/settings/TestButton";
import TestCalendar from "@/page-components/erp/settings/TestCalendar";
import TestCard from "@/page-components/erp/settings/TestCard";
import TestCarousel from "@/page-components/erp/settings/TestCarusel";
import TestCheckbox from "@/page-components/erp/settings/TestCheckbox";
import TestCollapsible from "@/page-components/erp/settings/TestCollapsible";
import TestCombobox from "@/page-components/erp/settings/TestCombobox";
import TestCommand from "@/page-components/erp/settings/TestCommand";
import TestContextMenu from "@/page-components/erp/settings/TestContextMenu";
import { cn } from "@/utils/cn";
import { IconMoonStars, IconSun } from "@tabler/icons-react";
import { ComponentType, useId } from "react";

const UIElements: {
  title: string;
  description?: string;
  Element: ComponentType;
  className?: string;
}[] = [
  {
    title: "Accordion",
    Element: TestAccordion,
  },
  {
    title: "Alert",
    Element: TestAlert,
    className: "flex-col",
  },
  {
    title: "AlertDialog",
    Element: TestAlertDialog,
  },
  {
    title: "AspectRatio",
    description: "16 / 9",
    Element: TestAspectRatio,
  },
  {
    title: "Badge",
    Element: TestBadge,
  },
  {
    title: "Button",
    Element: TestButton,
  },

  {
    title: "Calendar",
    Element: TestCalendar,
  },
  {
    title: "Card",
    Element: TestCard,
  },
  {
    title: "Carousel",
    Element: TestCarousel,
  },
  {
    title: "Checkbox",
    Element: TestCheckbox,
    className: "flex-col",
  },
  {
    title: "Collapsible",
    Element: TestCollapsible,
    className: "flex-col",
  },
  {
    title: "Combobox",
    Element: TestCombobox,
  },
  {
    title: "Command",
    Element: TestCommand,
  },
  {
    title: "ContextMenu",
    Element: TestContextMenu,
  },
];

interface ShadcnProps {}

function Shadcn(props: ShadcnProps) {
  const {} = props;
  const { toggleTheme, theme } = useUserContext();
  const uuid = useId();
  return (
    <div className="mx-auto flex max-w-screen-xl flex-col gap-4 p-2 pb-96">
      {UIElements.map((val, index) => (
        <Card key={`${uuid}${index}:`}>
          <CardHeader>
            <CardTitle>{val.title}</CardTitle>
            {val.description !== undefined && (
              <CardDescription>{val.description}</CardDescription>
            )}
          </CardHeader>
          <CardContent className={cn("flex gap-2 p-2", val.className)}>
            <val.Element />
          </CardContent>
        </Card>
      ))}

      <Button
        onClick={toggleTheme}
        size="icon"
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full"
      >
        {theme === 1 ? <IconSun /> : <IconMoonStars />}
      </Button>
    </div>
  );
}

export default Shadcn;
