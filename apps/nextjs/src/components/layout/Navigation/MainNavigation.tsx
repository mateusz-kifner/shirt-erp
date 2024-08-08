import { useUserContext } from "@/context/userContext";
import NavButton from "./NavButton";
import { useRouter } from "next/router";
import { cn } from "@/utils/cn";
import navigationData, { type NavigationData } from "./navigationData";

interface MainNavigationProps {
  onClose?: () => void;
}

function MainNavigation(props: MainNavigationProps) {
  const { onClose } = props;
  const router = useRouter();
  const { debug } = useUserContext();
  return (
    <div className={cn("grid w-full grid-cols-3 p-2")}>
      {Object.keys(navigationData).map((key) => {
        const val = navigationData[key] as NavigationData;
        if (!val?.debug || debug) {
          return (
            <div
              className="flex flex-col transition-all"
              key={`navbar_${val.label}outer`}
            >
              <NavButton
                {...val}
                key={`navbar_${val.label}`}
                active={val.entryName === router.pathname.split("/")[2]}
                onClick={() => onClose?.()}
              />
            </div>
          );
        }
      })}
    </div>
  );
}

export default MainNavigation;
