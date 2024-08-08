import { useMediaQuery } from "@mantine/hooks";

export function useIsMobile() {
  const media = useMediaQuery(
    "(max-width: 768px) or (only screen and (hover: none) and (pointer: coarse))",
    false,
  );
  let storage = "";
  try {
    storage = localStorage.getItem("flag-mobile-override") || "";
  } catch (error) {}

  if (storage === "mobile") {
    return true;
  }
  if (storage === "desktop") {
    return false;
  }

  return media;
}
