import { useEffect, useCallback, useRef, useState } from "react";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import { useIntl } from "react-intl";
import { authAxios } from "@/utils/axios";

export const useExamSecurity = (currentExamType) => {
  const router = useRouter();
  const intl = useIntl();

  const [isActive, setIsActive] = useState(false);
  const [detectedExtensions, setDetectedExtensions] = useState([]);
  const [submissionId, setSubmissionId] = useState(0);

  const violationCount = useRef(0);
  const lastViolationTime = useRef(0);

  // Interval va timeout'larni saqlash uchun ref'lar
  const devtoolsIntervalRef = useRef(null);
  const fullscreenIntervalRef = useRef(null);

  const MAX_ATTEMPTS = 5;
  const DEBOUNCE_MS = 800;

  const attachSubmissionId = useCallback((id) => {
    setSubmissionId(id);
  }, []);

  // Violation report (faqat oxirida yuboriladi)
  const reportViolation = useCallback(async (type) => {
    if (!submissionId) return;

    const payload = {
      submission_id: submissionId,
      incident: {
        type: intl.formatMessage({ id: type }),
        timestamp: new Date().toISOString(),
      },
    };

    try {
      await authAxios.post(currentExamType.report_exam, payload);
    } catch (error) {
      console.error("Security Report Error:", error);
    }
  }, [submissionId, currentExamType?.report_exam, intl]);

  // DevTools aniqlash (eng ishonchli usullar)
  const detectDevTools = useCallback(() => {
    if (!isActive) return false;

    // 1. O'lcham farqi (DevTools ochiq bo'lsa ko'pincha farq bo'ladi)
    if (
      window.outerWidth - window.innerWidth > 150 ||
      window.outerHeight - window.innerHeight > 120
    ) {
      return true;
    }

    // 2. Performance timing trick
    const start = performance.now();
    // debugger; // Test uchun ochsa bo'ladi, productionda tavsiya etilmaydi
    const end = performance.now();

    if (end - start > 40) return true;

    return false;
  }, [isActive]);

  // Violation handler
  const handleViolation = useCallback((messageId, type) => {
    if (!isActive) return;

    const now = Date.now();
    if (now - lastViolationTime.current < DEBOUNCE_MS) return;
    lastViolationTime.current = now;

    violationCount.current += 1;
    const remaining = MAX_ATTEMPTS - violationCount.current;

    if (violationCount.current >= MAX_ATTEMPTS) {
      reportViolation(messageId);
      toast.error(intl.formatMessage({ id: "no_attempts_left" }));
      setTimeout(() => router.push("/blocked"), 1000);
      return;
    }

    toast.error(
      `${intl.formatMessage({ id: messageId })}.`,
      { position: "top-center" }
    );
  }, [isActive, intl, reportViolation, router]);

  // Fullscreen funksiyalari
  const enterFullscreen = useCallback(() => {
    const elem = document.documentElement;
    if (!document.fullscreenElement) {
      elem.requestFullscreen?.() ||
      elem.webkitRequestFullscreen?.() ||
      elem.msRequestFullscreen?.() ||
      elem.mozRequestFullScreen?.();
    }
  }, []);

  const exitFullscreen = useCallback(() => {
    document.exitFullscreen?.() ||
    document.webkitExitFullscreen?.() ||
    document.msExitFullscreen?.() ||
    document.mozCancelFullScreen?.();
  }, []);

  // Extensionlarni tekshirish
  const checkExtensions = useCallback(async () => {
    const extensions = [
      { name: "Google Translate", id: "aapbdbdomjkkjkaonfhkkikfgjllcleb", resource: "popup.html" },
      { name: "Grammarly", id: "kbfnbcaeplbcioakkpcpgfkobkghhpne", resource: "src/js/extension_hook.js" },
    ];

    const detected = [];
    for (const ext of extensions) {
      try {
        const res = await fetch(`chrome-extension://${ext.id}/${ext.resource}`, { method: "HEAD" });
        if (res.ok) detected.push(ext.name);
      } catch (e) {}
    }

    if (detected.length > 0) {
      setDetectedExtensions(detected);
      handleViolation("extension_detected", "extension_detected");
    }
  }, [handleViolation]);

  // Securityni boshlash
  const startSecurity = useCallback(() => {
    setIsActive(true);
    violationCount.current = 0;
    lastViolationTime.current = 0;

    enterFullscreen();
    document.documentElement.style.userSelect = "none";
    document.documentElement.style.webkitUserSelect = "none";

    setTimeout(checkExtensions, 1500);
  }, [enterFullscreen, checkExtensions]);

  // Securityni to'xtatish (ENG MUHIM QISM)
  const stopSecurity = useCallback(() => {
    setIsActive(false);

    // Intervallarni tozalash
    if (devtoolsIntervalRef.current) {
      clearInterval(devtoolsIntervalRef.current);
      devtoolsIntervalRef.current = null;
    }
    if (fullscreenIntervalRef.current) {
      clearInterval(fullscreenIntervalRef.current);
      fullscreenIntervalRef.current = null;
    }

    exitFullscreen();

    // Stilni tiklash
    document.documentElement.style.userSelect = "";
    document.documentElement.style.webkitUserSelect = "";

    // Qo'shimcha tozalash
    violationCount.current = 0;
    lastViolationTime.current = 0;
  }, [exitFullscreen]);

  // Asosiy event listeners
  useEffect(() => {
    if (!isActive) return;

    // DevTools tekshirish
    devtoolsIntervalRef.current = setInterval(() => {
      if (detectDevTools()) {
        handleViolation("devtools_detected", "devtools_open");
      }
    }, 600);

    // Fullscreen tekshirish
    fullscreenIntervalRef.current = setInterval(() => {
      if (isActive && !document.fullscreenElement) {
        handleViolation("fs_exit_msg", "fullscreen_exit");
        enterFullscreen();
      }
    }, 2000);

    // Klaviatura bloklash
    const blockAllKeyboard = (e) => {
      const forbidden = ["f12", "f11", "f5"];
      const key = e.key.toLowerCase();
      const ctrlShift = e.ctrlKey && e.shiftKey;

      if (
        forbidden.includes(key) ||
        (ctrlShift && ["i", "j", "c"].includes(key)) ||
        (e.ctrlKey && e.key.toLowerCase() === "u")
      ) {
        e.preventDefault();
        e.stopImmediatePropagation();
        handleViolation("forbidden_key", `key_${key}`);
        return false;
      }
    };

    const handleContextMenu = (e) => {
      e.preventDefault();
      e.stopImmediatePropagation();
      handleViolation("context_menu", "right_click");
    };

    const disableClipboard = (e) => {
      e.preventDefault();
      e.stopImmediatePropagation();
      handleViolation("clipboard_disabled", "clipboard_attempt");
    };

    const handleVisibility = () => {
      if (document.hidden) handleViolation("tab_switch_msg", "tab_switch");
    };

    const handleBlur = () => handleViolation("window_blur_msg", "window_blur");

    const handleFSChange = () => {
      if (!document.fullscreenElement && isActive) {
        handleViolation("fs_exit_msg", "fullscreen_exit");
        setTimeout(enterFullscreen, 800);
      }
    };

    // Event listeners qo'shish
    window.addEventListener("keydown", blockAllKeyboard, true);
    window.addEventListener("keypress", blockAllKeyboard, true);
    window.addEventListener("keyup", blockAllKeyboard, true);

    window.addEventListener("contextmenu", handleContextMenu, true);
    window.addEventListener("copy", disableClipboard, true);
    window.addEventListener("paste", disableClipboard, true);
    window.addEventListener("cut", disableClipboard, true);

    window.addEventListener("blur", handleBlur);
    document.addEventListener("visibilitychange", handleVisibility);
    document.addEventListener("fullscreenchange", handleFSChange);

    // Sahifani yopishni oldini olish
    const handleBeforeUnload = (e) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", handleBeforeUnload);

    // Cleanup
    return () => {
      if (devtoolsIntervalRef.current) clearInterval(devtoolsIntervalRef.current);
      if (fullscreenIntervalRef.current) clearInterval(fullscreenIntervalRef.current);

      window.removeEventListener("keydown", blockAllKeyboard, true);
      window.removeEventListener("keypress", blockAllKeyboard, true);
      window.removeEventListener("keyup", blockAllKeyboard, true);

      window.removeEventListener("contextmenu", handleContextMenu, true);
      window.removeEventListener("copy", disableClipboard, true);
      window.removeEventListener("paste", disableClipboard, true);
      window.removeEventListener("cut", disableClipboard, true);

      window.removeEventListener("blur", handleBlur);
      document.removeEventListener("visibilitychange", handleVisibility);
      document.removeEventListener("fullscreenchange", handleFSChange);
      window.removeEventListener("beforeunload", handleBeforeUnload);

      document.onselectstart = null;
    };
  }, [isActive, detectDevTools, handleViolation, enterFullscreen]);

  return {
    startSecurity,
    stopSecurity,
    attachSubmissionId,
    checkExtensions,
    detectedExtensions,
    violationCount: violationCount.current,
    isActive, // agar kerak bo'lsa monitoring uchun
  };
};