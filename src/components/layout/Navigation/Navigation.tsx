import { IconArrowLeft, IconArrowRight, IconX } from "@tabler/icons-react";
import { useIsMobile } from "@/hooks/useIsMobile";
import { cn } from "@/utils/cn";
import { useHasChildNodes } from "@/hooks/useHasChildNodes";
import MainNavigation from "./MainNavigation";
import NavigationGradient from "./NavigationGradient";
import { useRouter } from "next/router";
import navigationData, { type NavigationData } from "./navigationData";
import { useUserContext } from "@/context/userContext";
import useTranslation from "@/hooks/useTranslation";
import _ from "lodash";
import { buttonVariants } from "@/components/ui/Button";
import styles from "./navigation.module.css";
import type TablerIconType from "@/types/TablerIconType";
import { forwardRef, useEffect, useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/Popover";
import { useHover } from "@mantine/hooks";
import MainNavigationList from "./MainNavigationList";
import { useFlag } from "@/hooks/useFlag";
import { IsInsideNavigationContextProvider } from "./isInsideNavigationContext";

const IconLogo: TablerIconType = forwardRef((props, ref) => (
  <img src="/assets/logo_micro.png" alt="Shirt Dip ERP" className="h-10" />
));

const getNameFromTranslation = (
  t: any,
  entryName?: string,
): string | undefined => {
  if (
    entryName === undefined ||
    typeof t[entryName as keyof typeof t] === "undefined"
  )
    return undefined;
  if (typeof t[entryName as keyof typeof t] === "string") {
    return t[entryName as keyof typeof t];
  }
  if (
    typeof t[entryName as keyof typeof t] === "object" &&
    t[entryName as keyof typeof t]?.plural !== undefined
  ) {
    return t[entryName as keyof typeof t].plural;
  }
};

function Navigation() {
  const router = useRouter();
  const isMobile = useIsMobile();
  const { ref, hasChildren } = useHasChildNodes<HTMLDivElement>();
  const { mobileOpen, setMobileOpen } = useUserContext();
  const [mainNavigationOpen, setMainNavigationOpen] = useState(false);
  const t = useTranslation();
  const { ref: mainNavigationTriggerRef, hovered: mainNavigationHovered } =
    useHover<HTMLButtonElement>();
  const { flags } = useFlag("navigation");

  useEffect(() => {
    if (
      flags?.main_navigation_hover &&
      mainNavigationHovered &&
      hasChildren &&
      !isMobile
    ) {
      setMainNavigationOpen(true);
    }
  }, [
    flags?.main_navigation_hover,
    mainNavigationHovered,
    hasChildren,
    isMobile,
  ]);

  const entryName = router.pathname.split("/")[2];

  const entryNameT = getNameFromTranslation(t, entryName);

  const label = entryNameT ? _.capitalize(entryNameT) : "";

  const noNavigation = !hasChildren;

  const entry: NavigationData =
    entryName && Object.hasOwn(navigationData, entryName)
      ? (navigationData[entryName] as NavigationData)
      : {
          label: "",
          Icon: IconLogo,
          href: "/",
          entryName: "",
          debug: true,
        };
  const gradient = entry?.gradient;
  const color = gradient?.from ?? "#0C8599";
  // const color2 = gradient?.to ?? "#3B5BDB";
  const Icon = entry?.Icon ?? IconLogo;
  const gradientCSS = `linear-gradient(${gradient?.deg ?? 0}deg, ${
    gradient ? `${gradient.from}99` : color
  },${gradient ? `${gradient.to}99` : color} )`;

  return (
    <IsInsideNavigationContextProvider>
      <div
        className={cn(
          isMobile ? "overflow-hidden" : styles["navigation-container"],
          "fixed top-0 left-0 z-50 h-screen max-h-screen max-w-full flex-col justify-between overflow-hidden bg-white transition-all dark:bg-stone-900",
          mobileOpen
            ? isMobile
              ? "w-screen"
              : "w-[83.3vw]"
            : isMobile
              ? "w-0"
              : "w-[5.5rem] focus-within:w-[32rem] hover:w-[32rem]",
          // TODO: find out why this pushes list to left "before:-right-6  before:absolute before:top-0 before:z-[-1] before:h-full before:w-6",
          mainNavigationOpen && !mobileOpen && !isMobile && "w-[32rem]",
          "after:absolute after:top-0 after:right-0 after:z-50 after:h-14 after:w-px after:bg-stone-800",
        )}
        tabIndex={-99999}
      >
        <div className="absolute top-0 right-0 z-50 h-full w-px bg-border" />
        <div
          className={cn(
            "flex h-full flex-col bg-card",
            mobileOpen ? "w-full" : "w-[32rem]",
          )}
        >
          <div
            className="relative z-50 flex h-14 min-h-14 items-center justify-between gap-4 border-r border-r-stone-800 border-b bg-stone-900 px-2"
            style={{ borderBottomColor: `${color}99` }}
          >
            <div
              className="absolute inset-0 z-[-1]"
              style={{
                backgroundImage: gradientCSS,
              }}
            />
            <Popover
              open={mainNavigationOpen}
              onOpenChange={(open) => {
                if (hasChildren) {
                  if (flags?.main_navigation_hover) {
                    setMainNavigationOpen(false);
                  } else {
                    setMainNavigationOpen(open);
                  }
                } else {
                  setMainNavigationOpen(false);
                }
              }}
            >
              <PopoverTrigger
                ref={mainNavigationTriggerRef}
                className={cn(
                  "flex min-w-40 items-center gap-3 rounded-full px-4 py-1",
                  hasChildren ? "hover:bg-white/15" : "cursor-default",
                )}
              >
                <Icon size={38} className="stroke-stone-50" />
                <div
                  className={cn(
                    !mobileOpen ? styles.label : undefined,
                    isMobile || mainNavigationOpen || mobileOpen
                      ? "opacity-100"
                      : "fade-out animate-out fill-mode-both",
                    "grow text-left font-bold text-3xl text-stone-50",
                    mobileOpen ? "" : "",
                  )}
                >
                  {label}
                </div>
              </PopoverTrigger>
              <PopoverContent
                sideOffset={5}
                className={cn(
                  "h-[calc(100vh-3.5rem)] rounded-none border-transparent border-y-0 border-r-px border-l-0 border-solid bg-card p-0 duration-75",
                  mobileOpen ? "w-[83.3vw]" : "w-[calc(32rem-1px)]",
                  isMobile && "w-screen",
                )}
              >
                {flags?.main_navigation_type === "icons" ? (
                  <MainNavigation
                    onClose={() => setMainNavigationOpen(false)}
                  />
                ) : (
                  <MainNavigationList
                    disableAnimation
                    onClose={() => setMainNavigationOpen(false)}
                    color={color}
                  />
                )}
              </PopoverContent>
            </Popover>

            {hasChildren && (
              <button
                type="button"
                className={cn(
                  buttonVariants({ size: "icon", variant: "outline" }),
                  "rounded-full border-none bg-black/40 hover:bg-black/60 hover:text-stone-50",
                )}
                onClick={() => {
                  setMobileOpen((v) => !v);
                  if (isMobile) {
                    document.querySelector("body")?.focus();
                  }
                }}
              >
                {mobileOpen ? (
                  isMobile ? (
                    <IconX className="stroke-gray-200" />
                  ) : (
                    <IconArrowLeft className="stroke-gray-200" />
                  )
                ) : (
                  <IconArrowRight className="stroke-gray-200" />
                )}
              </button>
            )}
          </div>

          <div
            id="NavigationPortalTarget"
            ref={ref}
            className={cn(
              "border-r",
              hasChildren && "relative z-30 flex grow flex-col",
              mobileOpen ? "w-full" : "w-[32rem]",
            )}
          />

          {noNavigation && (
            <div className="relative z-30 flex grow flex-col">
              {flags?.main_navigation_type === "icons" ? (
                <MainNavigation />
              ) : (
                <MainNavigationList color={color} />
              )}
            </div>
          )}

          <NavigationGradient
            color={color}
            className="absolute top-0 left-0 z-10 opacity-100 dark:opacity-50"
          />

          {/* {isMobile && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2"
          onClick={() => setMobileOpen(false)}
        >
          <IconX className="h-8 w-8 md:h-6 md:w-6" />
          <span className="sr-only">Close</span>
        </Button>
      )} */}
        </div>
        <div
          className={
            mobileOpen && hasChildren
              ? "fade-in-0 fixed inset-0 z-[-1] animate-in bg-background/80 backdrop-blur-sm"
              : "fade-out-0 animate-out"
          }
        />
      </div>
    </IsInsideNavigationContextProvider>
  );
}

export default Navigation;
