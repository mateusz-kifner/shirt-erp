import { useMediaQuery } from "@mantine/hooks";

export function useIsMobile() {
  return useMediaQuery(
    "(max-width: 768px) or (only screen and (hover: none) and (pointer: coarse))",
    false,
  );
}
