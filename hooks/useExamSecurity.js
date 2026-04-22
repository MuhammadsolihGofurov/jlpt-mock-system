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
  const hasFinalizedViolation = useRef(false);
  const securityStartedAt = useRef(0);
  const devtoolsDetectionHits = useRef(0);

  const devtoolsIntervalRef = useRef(null);
  const fullscreenIntervalRef = useRef(null);

  const MAX_ATTEMPTS = 4;
  const DEBOUNCE_MS = 1500; // Biroz ko'paytirildi

  const attachSubmissionId = useCallback((id) => {
    setSubmissionId(id);
  }, []);

  const reportViolation = useCallback(async (type, messageId) => {
    if (!submissionId || hasFinalizedViolation.current) return;
    hasFinalizedViolation.current = true;

    const payload = {
      submission_id: submissionId,
      incident: {
        source: "frontend_exam_security",
        events: [
          {
            type,
            message_id: messageId,
            message: intl.formatMessage({ id: messageId }),
            at: new Date().toISOString(),
          },
        ],
      },
    };

    try {
      await authAxios.post(currentExamType.report_exam, payload);
    } catch (error) {
      console.error("Security Report Error:", error);
    }
  }, [submissionId, currentExamType?.report_exam, intl]);

  // DevTools aniqlash - barcha OS'lar uchun moslashtirilgan
  const detectDevTools = useCallback(() => {
  if (!isActive) return false;

  const widthDiff = Math.abs(window.outerWidth - window.innerWidth);
  const heightDiff = Math.abs(window.outerHeight - window.innerHeight);

  const isLinux = navigator.platform.toLowerCase().includes('linux');

  const sizeSignal =
    widthDiff > (isLinux ? 500 : 250) ||
    heightDiff > (isLinux ? 500 : 250);

  if (sizeSignal) {
    devtoolsDetectionHits.current += 1;
  } else {
    devtoolsDetectionHits.current = Math.max(0, devtoolsDetectionHits.current - 1);
  }

  return devtoolsDetectionHits.current >= 10;
}, [isActive]);

  const handleViolation = useCallback((messageId, type) => {
    if (!isActive || hasFinalizedViolation.current) return;

    const now = Date.now();
    if (now - lastViolationTime.current < DEBOUNCE_MS) return;
    lastViolationTime.current = now;

    violationCount.current += 1;
    
    if (violationCount.current >= MAX_ATTEMPTS) {
      setIsActive(false);
      reportViolation(type, messageId);
      toast.error(intl.formatMessage({ id: "no_attempts_left" }), { autoClose: 2000 });
      setTimeout(() => router.push("/blocked"), 1500);
      return;
    }

    toast.error(intl.formatMessage({ id: messageId }), {
      position: "top-center",
      autoClose: 3000
    });
  }, [isActive, intl, reportViolation, router]);

  const enterFullscreen = useCallback(() => {
    const elem = document.documentElement;
    if (!document.fullscreenElement) {
      const request = elem.requestFullscreen?.() || 
                      elem.webkitRequestFullscreen?.() || 
                      elem.msRequestFullscreen?.() || 
                      elem.mozRequestFullScreen?.();
      
      if (request instanceof Promise) {
        request.catch(() => {
          console.warn("Fullscreen manually blocked by user or OS.");
        });
      }
    }
  }, []);

  const exitFullscreen = useCallback(() => {
    if (document.fullscreenElement) {
        (document.exitFullscreen || document.webkitExitFullscreen || 
         document.msExitFullscreen || document.mozCancelFullScreen).call(document);
    }
  }, []);

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
      } catch (e) { /* Extension yo'q bo'lsa fetch xato beradi - bu normal */ }
    }

    if (detected.length > 0) {
      setDetectedExtensions(detected);
      handleViolation("extension_detected", "extension_detected");
    }
  }, [handleViolation]);

  const startSecurity = useCallback(() => {
    setIsActive(true);
    violationCount.current = 0;
    hasFinalizedViolation.current = false;
    securityStartedAt.current = Date.now();
    devtoolsDetectionHits.current = 0;

    enterFullscreen();
    document.documentElement.style.userSelect = "none";
    document.documentElement.style.webkitUserSelect = "none";

    setTimeout(checkExtensions, 2000);
  }, [enterFullscreen, checkExtensions]);

  const stopSecurity = useCallback(() => {
    setIsActive(false);
    if (devtoolsIntervalRef.current) clearInterval(devtoolsIntervalRef.current);
    if (fullscreenIntervalRef.current) clearInterval(fullscreenIntervalRef.current);
    exitFullscreen();
    document.documentElement.style.userSelect = "";
    document.documentElement.style.webkitUserSelect = "";
  }, [exitFullscreen]);

  useEffect(() => {
    if (!isActive) return;

    // DevTools checking loop
    devtoolsIntervalRef.current = setInterval(() => {
      if (detectDevTools()) {
        handleViolation("devtools_detected", "devtools_open");
      }
    }, 700);

    // Fullscreen auto-recovery
    fullscreenIntervalRef.current = setInterval(() => {
      const gracePeriod = Date.now() - securityStartedAt.current < 5000;
      if (gracePeriod) return;

      if (!document.fullscreenElement && document.hasFocus()) {
        handleViolation("fs_exit_msg", "fullscreen_exit");
        enterFullscreen();
      }
    }, 3000);

    const blockEvents = (e) => {
      const forbiddenKeys = ["f12", "f11", "f5"];
      const key = e.key.toLowerCase();
      const isDevToolsKey = (e.ctrlKey && e.shiftKey && ["i", "j", "c"].includes(key)) || 
                           (e.ctrlKey && key === "u") || 
                           (e.metaKey && e.altKey && key === "i"); // Mac uchun

      if (forbiddenKeys.includes(key) || isDevToolsKey) {
        e.preventDefault();
        e.stopPropagation();
        handleViolation("forbidden_key", `key_${key}`);
      }
    };

    const disableAction = (e) => {
      e.preventDefault();
      e.stopPropagation();
      handleViolation(
          e.type === 'contextmenu' ? "context_menu" : "clipboard_disabled", 
          e.type
      );
    };

    const handleVisibility = () => {
      if (document.hidden) handleViolation("tab_switch_msg", "tab_switch");
    };

    const handleBlur = () => {
        // Ba'zi OS'larda qisqa blurlar bo'lishi mumkin (masalan system toast)
        // Shuning uchun 200ms dan keyin hali ham blur bo'lsagina hisoblaymiz
        setTimeout(() => {
            if (!document.hasFocus() && isActive) {
                handleViolation("window_blur_msg", "window_blur");
            }
        }, 300);
    };

    // Listeners
    window.addEventListener("keydown", blockEvents, true);
    window.addEventListener("contextmenu", disableAction, true);
    window.addEventListener("copy", disableAction, true);
    window.addEventListener("cut", disableAction, true);
    window.addEventListener("paste", disableAction, true);
    window.addEventListener("blur", handleBlur);
    document.addEventListener("visibilitychange", handleVisibility);

    const handleBeforeUnload = (e) => {
      e.preventDefault();
      return (e.returnValue = "Imtihon davom etmoqda!");
    };
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      clearInterval(devtoolsIntervalRef.current);
      clearInterval(fullscreenIntervalRef.current);
      window.removeEventListener("keydown", blockEvents, true);
      window.removeEventListener("contextmenu", disableAction, true);
      window.removeEventListener("copy", disableAction, true);
      window.removeEventListener("cut", disableAction, true);
      window.removeEventListener("paste", disableAction, true);
      window.removeEventListener("blur", handleBlur);
      window.removeEventListener("beforeunload", handleBeforeUnload);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [isActive, detectDevTools, handleViolation, enterFullscreen]);

  return {
    startSecurity,
    stopSecurity,
    attachSubmissionId,
    checkExtensions,
    detectedExtensions,
    violationCount: violationCount.current,
    isActive,
  };
};