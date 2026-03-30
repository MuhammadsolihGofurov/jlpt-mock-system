import {
  useEffect,
  useCallback
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
import axios from "axios"; // Yoki o'zingizning authAxios'ingiz
import {
  authAxios
} from "@/utils/axios";

export const useExamSecurity = (isActive, submissionId, onViolation) => {
  const router = useRouter();
  const intl = useIntl();

  // API ga xabar yuborish funksiyasi
  const reportViolation = useCallback(async (type) => {
    const payload = {
      submission_id: submissionId,
      incident: {
        events: [{
          type: message,
          at: new Date().toISOString(),
        }, ],
      },
    };

    try {
      // API manzilingizni kiriting
      await authAxios.post("/submissions/report-exam-integrity/", JSON.stringify(payload));
      console.log(`Violation reported: ${type}`);
    } catch (error) {
      console.error("API Error reporting violation:", error);
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

    const handleViolation = (message, violationType) => {
      // 1. API ga xabar berish
      reportViolation(message);

      // 2. Foydalanuvchiga bildirishnoma
      toast.error(intl.formatMessage({
        id: message
      }), {
        position: "top-center",
        autoClose: 3000,
      });

      // 3. Callback funksiyani chaqirish (agar bo'lsa)
      if (onViolation) onViolation(violationType);

      // 4. Imtihondan chiqarish (kechiktirilgan)
      setTimeout(() => {
        router.push("/blocked");
      }, 2500);
    };

    // 1. Klaviaturani bloklash
    const handleKeyDown = (e) => {
      const forbiddenKeys = ["f12", "f5", "f11"];
      const forbiddenCtrlKeys = ["r", "u", "s", "c", "v"];
      const key = e.key.toLowerCase();

      if (forbiddenKeys.includes(key) || (e.ctrlKey && forbiddenCtrlKeys.includes(key))) {
        e.preventDefault();
        const type = key === "f12" ? "devtools_attempt" : `forbidden_key_${key}`;
        handleViolation("Xavfsizlik qoidasi: Taqiqlangan tugma bosildi!", type);
      }
    };

    // 2. Fullscreen'dan chiqish
    const handleFullScreenChange = () => {
      if (!document.fullscreenElement) {
        handleViolation("Fullscreen rejimidan chiqdingiz!", "fullscreen_exit");
      }
    };

    // 3. Tab almashish
    const handleVisibilityChange = () => {
      if (document.hidden) {
        handleViolation("Boshqa oynaga o'tish taqiqlanadi!", "tab_switch");
      }
    };

    // 4. Sichqoncha o'ng tugmasi
    const handleContextMenu = (e) => {
      e.preventDefault();
      // Ixtiyoriy: O'ng tugmani ham report qilish mumkin
      // reportViolation("context_menu_attempt"); 
    };

    // 5. Sahifadan chiqib ketishga urinish (beforeunload)
    const handleBeforeUnload = () => {
      reportViolation("beforeunload");
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("contextmenu", handleContextMenu);
    window.addEventListener("beforeunload", handleBeforeUnload);
    document.addEventListener("fullscreenchange", handleFullScreenChange);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("contextmenu", handleContextMenu);
      window.removeEventListener("beforeunload", handleBeforeUnload);
      document.removeEventListener("fullscreenchange", handleFullScreenChange);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("click", enterFullScreen);
    };
  }, [isActive, submissionId, router, intl, onViolation, reportViolation]);
};