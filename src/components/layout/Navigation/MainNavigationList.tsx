import { useUserContext } from "@/context/userContext";
import { cn } from "@/utils/cn";
import { useRouter } from "next/router";
import type { NavigationData } from "./navigationData";
import navigationData from "./navigationData";
import NavButtonListItem from "./NavButtonListItem";
import NavigationGradient from "./NavigationGradient";

interface MainNavigationListProps {
  onClose?: () => void;
  className?: string;
  disableAnimation?: boolean;
  color?: string;
}

function MainNavigationList(props: MainNavigationListProps) {
  const { onClose, className, disableAnimation, color = "#0C8599" } = props;
  const router = useRouter();
  const { debug } = useUserContext();
  return (
    <div className={cn("relative flex w-full flex-col gap-3 p-2", className)}>
      <NavigationGradient
        className="absolute top-0 left-0 z-10 opacity-100 dark:opacity-50"
        color={color}
      />
      {Object.keys(navigationData).map((key) => {
        const val = navigationData[key] as NavigationData;
        if (!val?.debug || debug) {
          return (
            <div
              className="z-20 flex flex-col transition-all"
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
