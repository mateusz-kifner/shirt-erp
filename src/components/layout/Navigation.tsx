import { IconChevronLeft, IconChevronRight, IconX } from "@tabler/icons-react";
import { useRouter } from "next/router";

import NavButton from "@/components/layout/NavButton";
import { useUserContext } from "@/context/userContext";
import { useIsMobile } from "@/hooks/useIsMobile";
import { cn } from "@/utils/cn";
import Button from "../ui/Button";
import { ScrollArea } from "../ui/ScrollArea";
import navigationData from "./navigationData";

function Navigation() {
  const router = useRouter();
  const {
    navigationCollapsed,
    toggleNavigationCollapsed,
    debug,
    mobileOpen,
    setMobileOpen,
  } = useUserContext();
  const { isMobile } = useIsMobile();

  return (
    <div
      className={cn(
        "fixed left-0  flex flex-col  border-r-[1px]  border-stone-400 bg-white  transition-all dark:border-stone-600 dark:bg-stone-900",
        isMobile ? "w-full" : navigationCollapsed ? "w-[5.0625rem]" : "w-64", // 5.0625rem centers circle around button,
        isMobile && (mobileOpen ? "translate-x-0" : " -translate-x-full"),
        isMobile
          ? "top-2 z-[99999] h-[calc(100vh-1rem)]"
          : "top-14  h-[calc(100vh-3.5rem)] max-h-[calc(100vh-3.5rem)] justify-between",
      )}
    >
      <ScrollArea>
        <div className="flex  flex-col gap-3">
          <div
            className={cn(
              " px-3 py-1",
              isMobile ? "grid grid-cols-3" : "flex flex-col gap-2 py-3",
              isMobile
                ? "w-full"
                : navigationCollapsed
                ? "w-[5.0625rem]"
                : "w-64",
              isMobile && "pt-10 ",
            )}
          >
            {navigationData.map(
              (val) =>
                (!val?.debug || debug) && (
                  <NavButton
                    {...val}
                    key={"navbar_" + val.label}
                    // onClick={(e: any) => {
                    //   !biggerThanSM && toggleNavigationCollapsed()
                    // }}
                    active={val.entryName === router.pathname.split("/")[2]}
                    small={isMobile}
                    onClick={() => {
                      setMobileOpen(false);
                    }}
                  />
                ),
            )}
          </div>
          {isMobile && (
            <div className="w-full border-t-[1px] border-stone-400 dark:border-stone-600"></div>
          )}
          <div className="flex flex-col gap-2 px-3 py-1" id="MobileMenu"></div>
          {isMobile && (
            <div className="w-full border-t-[1px] border-stone-400 dark:border-stone-600"></div>
          )}
          <div className="flex flex-col gap-2" id="MobileMenuPinned"></div>
        </div>
      </ScrollArea>

      {isMobile ? (
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-2 top-2"
          onClick={() => setMobileOpen(false)}
        >
          <IconX className="h-8 w-8 md:h-6 md:w-6" />
          <span className="sr-only">Close</span>
        </Button>
      ) : (
        <div className=" relative flex  w-full flex-col items-center justify-center  gap-2 p-2">
          <div className="w-full border-t-[1px] border-stone-400 dark:border-stone-600"></div>
          <Button
            size="icon"
            variant="ghost"
            className="h-12 w-12 rounded-full"
            onClick={() => {
              toggleNavigationCollapsed();
            }}
          >
            {navigationCollapsed ? (
              <IconChevronRight className="stroke-stone-600 dark:stroke-gray-200" />
            ) : (
              <IconChevronLeft className="stroke-stone-600 dark:stroke-gray-200" />
            )}
          </Button>
        </div>
      )}
    </div>
  );
}

export default Navigation;
