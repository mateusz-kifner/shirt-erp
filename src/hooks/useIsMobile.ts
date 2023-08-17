import { useMediaQuery } from "@mantine/hooks";

export function useIsMobile() {
  const smallScreen = useMediaQuery("(max-width: 768px)", false);
  const hasTouch = useMediaQuery(
    "only screen and (hover: none) and (pointer: coarse)",
    false,
  );
  return { isMobile: smallScreen || hasTouch, hasTouch, smallScreen };
}
