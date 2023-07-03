import { useRouter } from "next/router";

import en from "@/locales/en.json";
import pl from "@/locales/pl.json";

function useTranslation() {
  const router = useRouter();
  const locale = router.locale ?? "pl";

  return locale === "pl" ? pl : en;
}

export default useTranslation;
