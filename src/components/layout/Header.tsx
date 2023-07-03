import { useUserContext } from "@/context/userContext";
import { useElementSize } from "@mantine/hooks";
import {
  IconBell,
  IconMessage,
  IconSearch,
  IconSettings,
} from "@tabler/icons-react";
import Link from "next/link";

const Header = () => {
  const { ref, width: actionButtonsWidth } = useElementSize();

  const { navigationCollapsed } = useUserContext();

  return (
    <div className="fixed left-0 top-0 flex h-14 w-full items-center justify-between border-b-[1px] border-stone-700 bg-stone-900 px-4">
      <div className="flex h-full flex-nowrap items-center justify-between">
        {navigationCollapsed ? (
          // eslint-disable-next-line
          <img
            src="/assets/logo_micro.png"
            alt="Shirt Dip ERP"
            className="h-10"
          />
        ) : (
          // eslint-disable-next-line
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
        <button
          className="border-1 animate-pop inline-flex h-9
            w-9 items-center justify-center 
            rounded-full bg-stone-800 p-0 font-semibold uppercase no-underline transition-all
            hover:bg-stone-950
            active:hover:scale-95 active:hover:animate-none 
            active:focus:scale-95 active:focus:animate-none
            disabled:pointer-events-none disabled:bg-stone-700"
        >
          <IconSearch className="stroke-gray-200" />
        </button>
        <button
          className="border-1 animate-pop inline-flex h-9
            w-9 items-center justify-center 
            rounded-full bg-stone-800 p-0 font-semibold uppercase no-underline transition-all
            hover:bg-stone-950
            active:hover:scale-95 active:hover:animate-none 
            active:focus:scale-95 active:focus:animate-none
            disabled:pointer-events-none disabled:bg-stone-700"
          disabled
        >
          <IconMessage className="stroke-gray-200" />
        </button>
        <button
          className="border-1 animate-pop inline-flex h-9
            w-9 items-center justify-center 
            rounded-full bg-stone-800 p-0 font-semibold uppercase no-underline transition-all
            hover:bg-stone-950
            active:hover:scale-95 active:hover:animate-none 
            active:focus:scale-95 active:focus:animate-none
            disabled:pointer-events-none disabled:bg-stone-700"
          disabled
        >
          <IconBell className="stroke-gray-200" />
        </button>

        <Link
          href={"/erp/settings"}
          className="border-1 animate-pop inline-flex h-9
            w-9 items-center justify-center 
            rounded-full bg-stone-800 p-0 font-semibold uppercase no-underline transition-all
            hover:bg-stone-950
            active:hover:scale-95 active:hover:animate-none 
            active:focus:scale-95 active:focus:animate-none
            disabled:pointer-events-none disabled:bg-stone-700"
        >
          <IconSettings className="stroke-gray-200" />
        </Link>
      </div>
    </div>
  );
};

export default Header;
