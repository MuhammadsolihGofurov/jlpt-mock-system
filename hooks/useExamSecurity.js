import {
  useEffect,
  useCallback,
  useRef
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
import {
  authAxios
} from "@/utils/axios";

export const useExamSecurity = (isActive, submissionId, onViolation) => {
  const router = useRouter();
  const intl = useIntl();

  // Urinishlar sonini saqlash uchun (renderlar orasida saqlanib qoladi)
  const violationCount = useRef(0);
  const MAX_ATTEMPTS = 3;

  const reportViolation = useCallback(async (type) => {
    const payload = {
      submission_id: submissionId,
      incident: {
        events: [{
          type,
          at: new Date().toISOString(),
          attempt_number: violationCount.current
        }],
      },
    };

    if (violationCount.current >= MAX_ATTEMPTS) {
      try {
        await authAxios.post("/submissions/report-exam-integrity/", payload);
        console.log(`Violation reported: ${type} (Attempt: ${violationCount.current})`);
      } catch (error) {
        console.error("API Error reporting violation:", error);
      }
    }


  }, [submissionId]);

  useEffect(() => {
    if (!isActive || !submissionId) return;

    const enterFullScreen = () => {
      const element = document.documentElement;
      if (!document.fullscreenElement) {
        element.requestFullscreen().catch((err) => {
          console.warn(`Fullscreen error: ${err.message}`);
        });
      }
    };

    window.addEventListener("click", enterFullScreen, {
      once: true
    });

    const handleViolation = (messageId, violationType) => {
      violationCount.current += 1; // Xatolar sonini oshirish

      // 1. API ga xabar berish
      reportViolation(violationType);

      // 2. Foydalanuvchiga ogohlantirish (nechanchi imkoniyat qolganini ko'rsatish)
      const remaining = MAX_ATTEMPTS - violationCount.current;
      const warningMessage = remaining > 0 ?
        `${intl.formatMessage({ id: messageId })}. ${intl.formatMessage({id:"Qolgan urinishlar"})}: ${remaining}` :
        intl.formatMessage({
          id: "Sizda imkoniyat qolmadi!"
        });

      toast.error(warningMessage, {
        position: "top-center",
        autoClose: 3000,
      });

      // 3. Callback
      if (onViolation) onViolation(violationType);

      // 4. 3 marta bo'lganda blocklash
      if (violationCount.current >= MAX_ATTEMPTS) {
        setTimeout(() => {
          router.push("/blocked");
        }, 1500);
      }
    };

    // 1. Klaviaturani bloklash (Alt+Tab, PrintScreen va boshqalar)
    const handleKeyDown = (e) => {
      const key = e.key.toLowerCase();

      // PrintScreen (Screenshot) ni aniqlash (ba'zi brauzerlarda ishlaydi)
      if (key === "printscreen") {
        e.preventDefault();
        handleViolation("Screenshot olish taqiqlanadi!", "screenshot_attempt");
        // Clipboardni tozalashga urinish
        navigator.clipboard.writeText("");
      }

      const forbiddenKeys = ["f12", "f5", "f11"];
      const forbiddenCtrlKeys = ["r", "u", "s", "c", "v", "p"]; // P - Print uchun

      // Alt + Tab ni to'liq bloklab bo'lmaydi (OS darajasida), 
      // lekin Alt bosilganda biz buni "Tab switch" sifatida ushlaymiz (visibilitychange orqali).
      if (
        forbiddenKeys.includes(key) ||
        (e.ctrlKey && forbiddenCtrlKeys.includes(key)) ||
        (e.altKey && key === "tab") || // Alt + Tab urinishi
        (e.metaKey) // Windows yoki Mac Command tugmasi
      ) {
        e.preventDefault();
        handleViolation("Taqiqlangan tugma kombinatsiyasi!", `key_${key}`);
      }
    };

    // 2. Fullscreen'dan chiqish
    const handleFullScreenChange = () => {
      if (!document.fullscreenElement) {
        handleViolation("Fullscreen rejimidan chiqdingiz!", "fullscreen_exit");
      }
    };

    // 3. Tab almashish (Alt+Tab va boshqa oynaga o'tishni ushlaydi)
    const handleVisibilityChange = () => {
      if (document.hidden) {
        handleViolation("Boshqa oynaga o'tish taqiqlanadi!", "tab_switch");
      }
    };

    // 4. Nusxa ko'chirishni taqiqlash (Ekran rasmini olishni qiyinlashtiradi)
    const handleCopy = (e) => {
      e.preventDefault();
      handleViolation("Ma'lumot nusxalash taqiqlanadi!", "copy_attempt");
    };

    const handleContextMenu = (e) => e.preventDefault();

    const handleBeforeUnload = () => {
      reportViolation("page_refresh_attempt");
    };

    // Eventlarni bog'lash
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("contextmenu", handleContextMenu);
    window.addEventListener("copy", handleCopy);
    window.addEventListener("beforeunload", handleBeforeUnload);
    document.addEventListener("fullscreenchange", handleFullScreenChange);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("contextmenu", handleContextMenu);
      window.removeEventListener("copy", handleCopy);
      window.removeEventListener("beforeunload", handleBeforeUnload);
      document.removeEventListener("fullscreenchange", handleFullScreenChange);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("click", enterFullScreen);
    };
  }, [isActive, submissionId, router, intl, onViolation, reportViolation]);
};