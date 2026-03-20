import {
  useEffect
} from "react";
import {
  useRouter
} from "next/router";
import {
  toast
} from "react-toastify";
import {
  useIntl
} from "react-intl";

export const useExamSecurity = (isActive, onViolation) => {
  const router = useRouter();
  const intl = useIntl();

  useEffect(() => {
    if (!isActive) return;

    // Fullscreen'ni yoqish funksiyasi
    const enterFullScreen = () => {
      const element = document.documentElement;
      if (!document.fullscreenElement) {
        element.requestFullscreen().catch((err) => {
          console.warn(`Fullscreen error: ${err.message}`);
        });
      }
    };

    // Sahifaga kirganda birinchi marta bosganda fullscreenga o'tkazish
    // Odatda ModeSelector click qilinganda ishga tushadi
    window.addEventListener("click", enterFullScreen, {
      once: true
    });

    const handleViolation = (message) => {
      toast.error(intl.formatMessage({
        id: message
      }), {
        position: "top-center",
        autoClose: 3000,
      });

      if (onViolation) onViolation();

      // Imtihondan chiqarish
      setTimeout(() => {
        router.push("/blocked");
      }, 2000);
    };

    // 1. Klaviaturani bloklash
    const handleKeyDown = (e) => {
      // F12, F5, Ctrl+R, Ctrl+U, Ctrl+S, Ctrl+C, Ctrl+V
      if (
        e.key === "F12" ||
        e.key === "F5" ||
        (e.ctrlKey && ["r", "u", "s", "c", "v"].includes(e.key.toLowerCase()))
      ) {
        e.preventDefault();
        handleViolation("Xavfsizlik qoidasi: Taqiqlangan tugma bosildi!");
      }

      // F11 ni bloklash (Ekranni kichraytirishga yo'l qo'ymaslik)
      if (e.key === "F11") {
        e.preventDefault();
        handleViolation("Fullscreen rejimidan chiqish taqiqlanadi!");
      }
    };

    // 2. Fullscreen'dan chiqishni nazorat qilish
    const handleFullScreenChange = () => {
      if (!document.fullscreenElement) {
        // Agar foydalanuvchi Esc yoki boshqa yo'l bilan chiqsa
        handleViolation("Fullscreen rejimidan chiqdingiz! Imtihon bekor qilindi.");
      }
    };

    // 3. Tab almashishni nazorat qilish
    const handleVisibilityChange = () => {
      if (document.hidden) {
        handleViolation("Boshqa oynaga o'tish taqiqlanadi!");
      }
    };

    // 4. Context Menu (O'ng tugma)
    const handleContextMenu = (e) => e.preventDefault();

    // Eventlarni bog'lash
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("contextmenu", handleContextMenu);
    document.addEventListener("fullscreenchange", handleFullScreenChange);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("fullscreenchange", handleFullScreenChange);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("click", enterFullScreen);
    };
  }, [isActive, router, onViolation]);
};