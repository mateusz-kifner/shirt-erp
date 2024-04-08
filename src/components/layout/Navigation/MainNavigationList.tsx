import { useUserContext } from "@/context/userContext";
import { cn } from "@/utils/cn";
import { useRouter } from "next/router";
import type { NavigationData } from "./navigationData";
import navigationData from "./navigationData";
import NavButtonListItem from "./NavButtonListItem";

interface MainNavigationListProps {
  onClose?: () => void;
  className?: string;
  disableAnimation?: boolean;
}

function MainNavigationList(props: MainNavigationListProps) {
  const { onClose, className, disableAnimation } = props;
  const router = useRouter();
  const { debug } = useUserContext();
  return (
    <div className={cn("flex w-full flex-col gap-3 p-2", className)}>
      {Object.keys(navigationData).map((key) => {
        const val = navigationData[key] as NavigationData;
        if (!val?.debug || debug) {
          return (
            <div
              className="flex flex-col transition-all"
              key={`navbar_${val.label}outer`}
            >
              <NavButtonListItem
                {...val}
                key={`navbar_${val.label}`}
                active={val.entryName === router.pathname.split("/")[2]}
                onClick={() => onClose?.()}
                disableAnimation={disableAnimation}
              />
            </div>
          );
        }
      })}
    </div>
  );
}

export default MainNavigationList;
