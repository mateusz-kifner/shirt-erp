import { IconChevronLeft, IconChevronRight, IconX } from "@tabler/icons-react";
import { useRouter } from "next/router";

import NavButton from "@/components/layout/NavButton";
import { useUserContext } from "@/context/userContext";
import { useIsMobile } from "@/hooks/useIsMobile";
import { cn } from "@/utils/cn";
import Button from "../ui/Button";
import { ScrollArea } from "../ui/ScrollArea";
import { Separator } from "../ui/Separator";
import navigationData from "./navigationData";

function Navigation() {
  const router = useRouter();
  const { debug, mobileOpen, setMobileOpen } = useUserContext();
  const isMobile = useIsMobile();

  return (
    <div
      className={cn(
        "fixed left-0 flex flex-col border-r bg-white transition-all  dark:bg-stone-900",
        isMobile
          ? "top-2 z-[99999] h-[calc(100vh-1rem)] w-full"
          : "top-14  h-[calc(100vh-3.5rem)] max-h-[calc(100vh-3.5rem)] w-[5.5rem] justify-between",
        isMobile && (mobileOpen ? "translate-x-0" : " -translate-x-full"),
      )}
    >
      <ScrollArea>
        <div className="flex flex-col gap-3">
          <div
            className={cn(
              " py-1",
              isMobile ? "grid grid-cols-3" : "flex flex-col gap-2 py-2",
              isMobile ? "w-full" : "w-[5.5rem]",
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
                    onClick={() => {
                      setMobileOpen(false);
                    }}
                  />
                ),
            )}
          </div>
        </div>
      </ScrollArea>

      {isMobile && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-2 top-2"
          onClick={() => setMobileOpen(false)}
        >
          <IconX className="h-8 w-8 md:h-6 md:w-6" />
          <span className="sr-only">Close</span>
        </Button>
      )}
    </div>
  );
}

export default Navigation;
