import { useEffect, type PropsWithChildren } from "react";

function LayoutAuth({ children }: PropsWithChildren) {
  useEffect(() => {
    // initialize theme
    const theme = localStorage.getItem("user-theme");
    const htmlElement = document.querySelector("html") as HTMLHtmlElement;
    htmlElement.classList.add(theme === "0" ? "light" : "dark");

    // enable transitions after page load
    const timeout = setTimeout(() => {
      const bodyElement = document.querySelector("body") as HTMLBodyElement;
      bodyElement.classList.remove("preload");
    }, 200);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <div>
      <main className={` min-h-screen transition-all`}>{children}</main>
    </div>
  );
}

export default LayoutAuth;
