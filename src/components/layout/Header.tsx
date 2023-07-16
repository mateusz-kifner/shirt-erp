import { useUserContext } from "@/context/userContext";
import { cn } from "@/utils/cn";
import { useElementSize } from "@mantine/hooks";
import { IconMessage2, IconSearch, IconSettings } from "@tabler/icons-react";
import Link from "next/link";
import Button, { buttonVariants } from "../ui/Button";
import Notifications from "./Notifications";

const Header = () => {
  const { ref, width: actionButtonsWidth } = useElementSize();

  const { navigationCollapsed } = useUserContext();

  return (
    <div className="fixed left-0 top-0 z-50 flex h-14 w-full items-center justify-between border-b-[1px] border-stone-700 bg-stone-900 px-4">
      <div className="flex h-full flex-nowrap items-center justify-between">
        {navigationCollapsed ? (
          <img
            src="/assets/logo_micro.png"
            alt="Shirt Dip ERP"
            className="h-10"
          />
        ) : (
          <img
            src="/assets/logo_small.png"
            alt="Shirt Dip ERP"
            className="h-10"
          />
        )}
      </div>
      <div
        id="HeaderTabs"
        className={`absolute left-0 top-0 h-14  transition-all ${
          navigationCollapsed ? "ml-20" : "ml-64"
        }`}
        style={{
          width: `calc(100% - ${actionButtonsWidth}px - 1rem - ${
            navigationCollapsed ? "5rem" : "16rem"
          })`,
        }}
      ></div>
      <div className="flex justify-end gap-3" ref={ref}>
        <Button variant="outline" size="icon" className="rounded-full">
          <IconSearch className="stroke-gray-200" />
        </Button>
        <Button variant="outline" size="icon" className="rounded-full">
          <IconMessage2 className="stroke-gray-200" />
        </Button>
        <Notifications />

        <Link
          href={"/erp/settings"}
          className={cn(
            buttonVariants({ size: "icon", variant: "outline" }),
            "rounded-full"
          )}
        >
          <IconSettings className="stroke-gray-200" />
        </Link>
      </div>
    </div>
  );
};

export default Header;
