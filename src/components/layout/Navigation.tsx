import { useState } from "react";

import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";
import { useRouter } from "next/router";

import NavButton from "@/components/layout/NavButton";
import { useUserContext } from "@/context/userContext";
import Button from "../ui/Button";
import navigationData from "./navigationData";

function Navigation() {
  const router = useRouter();
  const { navigationCollapsed, toggleNavigationCollapsed, debug } =
    useUserContext();

  const [mobileOpen, setMobileOpen] = useState<boolean>(false);

  return (
    <div
      className={`fixed left-0 top-14 flex h-[calc(100vh-3.5rem)] max-h-[calc(100vh-3.5rem)]  flex-col justify-between  border-r-[1px] border-stone-400 bg-white  px-3 py-1 transition-all dark:border-stone-600 dark:bg-stone-900 ${
        navigationCollapsed ? "w-[5.0625rem]" : "w-64" // 5.0625rem centers circle around button
      }`}
    >
      <div className="scrollbar scrollbar-track-transparent scrollbar-thumb-blue-500 scrollbar-corner-transparent  scrollbar-thumb-rounded-full scrollbar-w-2 overflow-y-auto overflow-x-hidden transition-all ">
        <div className="flex flex-col gap-2 py-3">
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
                />
              ),
          )}
        </div>
      </div>
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
    </div>
  );
}

export default Navigation;
