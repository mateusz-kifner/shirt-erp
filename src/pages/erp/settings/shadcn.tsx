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
import { cn } from "@/utils/cn";
import { IconLoader2, IconMoonStars, IconSun } from "@tabler/icons-react";
import { type ComponentType, useId } from "react";
import { type GetStaticProps } from "next";

const TestAccordion = lazy(
  () => import("@/page-components/erp/settings/shadcn/TestAccordion"),
);
const TestAlert = lazy(
  () => import("@/page-components/erp/settings/shadcn/TestAlert"),
);
const TestAlertDialog = lazy(
  () => import("@/page-components/erp/settings/shadcn/TestAlertDialog"),
);
const TestAspectRatio = lazy(
  () => import("@/page-components/erp/settings/shadcn/TestAspectRatio"),
);
const TestBadge = lazy(
  () => import("@/page-components/erp/settings/shadcn/TestBadge"),
);
const TestButton = lazy(
  () => import("@/page-components/erp/settings/shadcn/TestButton"),
);

const TestCard = lazy(
  () => import("@/page-components/erp/settings/shadcn/TestCard"),
);
const TestCarousel = lazy(
  () => import("@/page-components/erp/settings/shadcn/TestCarusel"),
);
const TestCheckbox = lazy(
  () => import("@/page-components/erp/settings/shadcn/TestCheckbox"),
);
const TestCollapsible = lazy(
  () => import("@/page-components/erp/settings/shadcn/TestCollapsible"),
);
const TestCombobox = lazy(
  () => import("@/page-components/erp/settings/shadcn/TestCombobox"),
);
const TestCommand = lazy(
  () => import("@/page-components/erp/settings/shadcn/TestCommand"),
);
const TestContextMenu = lazy(
  () => import("@/page-components/erp/settings/shadcn/TestContextMenu"),
);
const TestDialog = lazy(
  () => import("@/page-components/erp/settings/shadcn/TestDialog"),
);
const TestDrawer = lazy(
  () => import("@/page-components/erp/settings/shadcn/TestDrawer"),
);
const TestDropdownMenu = lazy(
  () => import("@/page-components/erp/settings/shadcn/TestDropdownMenu"),
);
const TestHoverCard = lazy(
  () => import("@/page-components/erp/settings/shadcn/TestHoverCard"),
);
const TestInput = lazy(
  () => import("@/page-components/erp/settings/shadcn/TestInput"),
);
const TestLabel = lazy(
  () => import("@/page-components/erp/settings/shadcn/TestLabel"),
);
const TestPagination = lazy(
  () => import("@/page-components/erp/settings/shadcn/TestPagination"),
);
const TestPopover = lazy(
  () => import("@/page-components/erp/settings/shadcn/TestPopover"),
);
const TestProgress = lazy(
  () => import("@/page-components/erp/settings/shadcn/TestProgress"),
);
const TestRatioGroup = lazy(
  () => import("@/page-components/erp/settings/shadcn/TestRatioGroup"),
);
const TestResizable = lazy(
  () => import("@/page-components/erp/settings/shadcn/TestResizable"),
);
const TestScrollArea = lazy(
  () => import("@/page-components/erp/settings/shadcn/TestScrollArea"),
);
const TestSelect = lazy(
  () => import("@/page-components/erp/settings/shadcn/TestSelect"),
);
const TestSeparator = lazy(
  () => import("@/page-components/erp/settings/shadcn/TestSeparator"),
);
const TestSheet = lazy(
  () => import("@/page-components/erp/settings/shadcn/TestSheet"),
);
const TestSkeleton = lazy(
  () => import("@/page-components/erp/settings/shadcn/TestSkeleton"),
);
const TestSlider = lazy(
  () => import("@/page-components/erp/settings/shadcn/TestSlider"),
);
const TestSonner = lazy(
  () => import("@/page-components/erp/settings/shadcn/TestSonner"),
);
const TestSwitch = lazy(
  () => import("@/page-components/erp/settings/shadcn/TestSwitch"),
);
const TestTable = lazy(
  () => import("@/page-components/erp/settings/shadcn/TestTable"),
);
const TestTabs = lazy(
  () => import("@/page-components/erp/settings/shadcn/TestTabs"),
);
const TestTextarea = lazy(
  () => import("@/page-components/erp/settings/shadcn/TestTextarea"),
);
const TestToggle = lazy(
  () => import("@/page-components/erp/settings/shadcn/TestToggle"),
);
const TestTooltip = lazy(
  () => import("@/page-components/erp/settings/shadcn/TestTooltip"),
);

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

export const getStaticProps: GetStaticProps = () => {
  if (process.env.NODE_ENV === "production") {
    return { notFound: true };
  }
  return { props: {} };
};
