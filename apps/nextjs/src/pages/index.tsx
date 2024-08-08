import { useRouter } from "next/router";
import { env } from "@/env";
import { buttonVariants } from "@shirterp/ui-web/Button";
import Link from "next/link";
import { cn } from "@/utils/cn";

const Main = () => {
  const router = useRouter();

  const { locale } = router;

  return (
    <div className="mx-auto flex max-w-lg flex-col justify-center gap-8 pt-20 font-bold">
      <img
        src="https://shirterp.eu/logo.png"
        alt={env.NEXT_PUBLIC_ORGANIZATION_NAME}
      />

      <Link href="/erp" className={cn(buttonVariants({ size: "xl" }))}>
        {locale === "pl" ? (
          <div>Wejdź do systemu ERP</div>
        ) : (
          <div>Enter ERP system</div>
        )}
      </Link>
    </div>
  );
};

export default Main;
