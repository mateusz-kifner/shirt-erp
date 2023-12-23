import Button from "@/components/ui/Button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { Suspense, lazy } from "react";

import { useUserContext } from "@/context/userContext";

const TestAccordion = lazy(
  () => import("@/page-components/erp/settings/TestAccordion"),
);
const TestAlert = lazy(
  () => import("@/page-components/erp/settings/TestAlert"),
);
const TestAlertDialog = lazy(
  () => import("@/page-components/erp/settings/TestAlertDialog"),
);
const TestAspectRatio = lazy(
  () => import("@/page-components/erp/settings/TestAspectRatio"),
);
const TestBadge = lazy(
  () => import("@/page-components/erp/settings/TestBadge"),
);
const TestButton = lazy(
  () => import("@/page-components/erp/settings/TestButton"),
);
const TestCalendar = lazy(
  () => import("@/page-components/erp/settings/TestCalendar"),
);
const TestCard = lazy(() => import("@/page-components/erp/settings/TestCard"));
const TestCarousel = lazy(
  () => import("@/page-components/erp/settings/TestCarusel"),
);
const TestCheckbox = lazy(
  () => import("@/page-components/erp/settings/TestCheckbox"),
);
const TestCollapsible = lazy(
  () => import("@/page-components/erp/settings/TestCollapsible"),
);
const TestCombobox = lazy(
  () => import("@/page-components/erp/settings/TestCombobox"),
);
const TestCommand = lazy(
  () => import("@/page-components/erp/settings/TestCommand"),
);
const TestContextMenu = lazy(
  () => import("@/page-components/erp/settings/TestContextMenu"),
);
const TestDialog = lazy(
  () => import("@/page-components/erp/settings/TestDialog"),
);
const TestDrawer = lazy(
  () => import("@/page-components/erp/settings/TestDrawer"),
);
const TestDropdownMenu = lazy(
  () => import("@/page-components/erp/settings/TestDropdownMenu"),
);
const TestHoverCard = lazy(
  () => import("@/page-components/erp/settings/TestHoverCard"),
);
const TestInput = lazy(
  () => import("@/page-components/erp/settings/TestInput"),
);
const TestLabel = lazy(
  () => import("@/page-components/erp/settings/TestLabel"),
);
const TestPagination = lazy(
  () => import("@/page-components/erp/settings/TestPagination"),
);
const TestPopover = lazy(
  () => import("@/page-components/erp/settings/TestPopover"),
);
const TestProgress = lazy(
  () => import("@/page-components/erp/settings/TestProgress"),
);
const TestRatioGroup = lazy(
  () => import("@/page-components/erp/settings/TestRatioGroup"),
);
const TestResizable = lazy(
  () => import("@/page-components/erp/settings/TestResizable"),
);
const TestScrollArea = lazy(
  () => import("@/page-components/erp/settings/TestScrollArea"),
);
const TestSelect = lazy(
  () => import("@/page-components/erp/settings/TestSelect"),
);
const TestSeparator = lazy(
  () => import("@/page-components/erp/settings/TestSeparator"),
);
const TestSheet = lazy(
  () => import("@/page-components/erp/settings/TestSheet"),
);
const TestSkeleton = lazy(
  () => import("@/page-components/erp/settings/TestSkeleton"),
);
const TestSlider = lazy(
  () => import("@/page-components/erp/settings/TestSlider"),
);
const TestSonner = lazy(
  () => import("@/page-components/erp/settings/TestSonner"),
);
const TestSwitch = lazy(
  () => import("@/page-components/erp/settings/TestSwitch"),
);
const TestTable = lazy(
  () => import("@/page-components/erp/settings/TestTable"),
);
const TestTabs = lazy(() => import("@/page-components/erp/settings/TestTabs"));
const TestTextarea = lazy(
  () => import("@/page-components/erp/settings/TestTextarea"),
);
const TestToggle = lazy(
  () => import("@/page-components/erp/settings/TestToggle"),
);
const TestTooltip = lazy(
  () => import("@/page-components/erp/settings/TestTooltip"),
);

import { cn } from "@/utils/cn";
import { IconLoader2, IconMoonStars, IconSun } from "@tabler/icons-react";
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
    className: "flex-col",
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
    className: "justify-center",
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
  {
    title: "Dialog",
    Element: TestDialog,
  },
  {
    title: "Drawer",
    Element: TestDrawer,
  },
  {
    title: "DropdownMenu",
    Element: TestDropdownMenu,
    className: "justify-center",
  },
  {
    title: "HoverCard",
    Element: TestHoverCard,
    className: "justify-center",
  },
  {
    title: "Input",
    Element: TestInput,
    className: "flex-col",
  },
  {
    title: "Label",
    Element: TestLabel,
    className: "flex-col",
  },
  {
    title: "Pagination",
    Element: TestPagination,
    className: "flex-col",
  },
  {
    title: "Popover",
    Element: TestPopover,
  },
  {
    title: "Progress",
    Element: TestProgress,
  },
  {
    title: "RatioGroup",
    Element: TestRatioGroup,
  },
  {
    title: "Resizable",
    Element: TestResizable,
  },
  {
    title: "ScrollArea",
    Element: TestScrollArea,
  },
  {
    title: "Select",
    Element: TestSelect,
    className: "flex-col",
  },
  {
    title: "Separator",
    Element: TestSeparator,
  },
  {
    title: "Sheet",
    Element: TestSheet,
  },
  {
    title: "Skeleton",
    Element: TestSkeleton,
    className: "flex-col",
  },
  {
    title: "Slider",
    Element: TestSlider,
    className: "flex-col gap-7 pb-7",
  },
  {
    title: "Sonner",
    Element: TestSonner,
  },
  {
    title: "Switch",
    Element: TestSwitch,
  },
  {
    title: "Table",
    Element: TestTable,
  },
  {
    title: "Tabs",
    Element: TestTabs,
    className: "justify-center",
  },
  {
    title: "TextArea",
    Element: TestTextarea,
    className: "flex-col",
  },
  {
    title: "Toggle",
    Element: TestToggle,
    className: "flex-col",
  },
  {
    title: "Tooltip",
    Element: TestTooltip,
    className: "flex-col",
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
            <Suspense
              fallback={
                <IconLoader2 className="animate-spin direction-reverse" />
              }
            >
              <val.Element />
            </Suspense>
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
