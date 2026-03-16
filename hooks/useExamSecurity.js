import { useEffect } from "react";

export const useExamSecurity = (isActive) => {
  useEffect(() => {
    if (!isActive) return;

    // Tab yopilishini oldini olish
    const handleBeforeUnload = (e) => {
      e.preventDefault();
      e.returnValue =
        "Imtihon jarayonida sahifadan chiqish natijalarni yo'qotishi mumkin!";
    };

    // Fullscreen rejimini majburlash (ixtiyoriy, lekin tavsiya etiladi)
    const requestFullScreen = () => {
      const el = document.documentElement;
      if (!document.fullscreenElement) el.requestFullscreen().catch(() => {});
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    window.addEventListener("click", requestFullScreen, { once: true });

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [isActive]);
};
