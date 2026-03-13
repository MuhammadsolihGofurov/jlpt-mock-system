import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const OffcanvasWrapper = ({
  children,
  onClose,
  position = "right", // "left" yoki "right"
  size = "sm",
  show = false,
  backdrop = true,
}) => {
  // Window Scrollni butunlay qotirish (Scroll Lock)
  useEffect(() => {
    if (show) {
      // Scrollni bloklash va sahifa o'ngga surilib ketmasligi uchun padding-right qo'shish
      const scrollBarWidth =
        window.innerWidth - document.documentElement.clientWidth;
      document.body.style.overflow = "hidden";
      document.body.style.paddingRight = `${scrollBarWidth}px`;
    } else {
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
    }

    const handleEsc = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", handleEsc);

    return () => {
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
      window.removeEventListener("keydown", handleEsc);
    };
  }, [show, onClose]);

  const sizeClass =
    {
      sm: "max-w-[320px]",
      lg: "max-w-[400px]",
      xl: "max-w-[500px]",
      "2xl": "max-w-[600px]",
    }[size] || "max-w-[400px]";

  const isRight = position === "right";

  // Animatsiya variantlari
  const variants = {
    hidden: { x: isRight ? "100%" : "-100%", opacity: 0.8 },
    visible: {
      x: 0,
      opacity: 1,
      transition: { type: "spring", damping: 25, stiffness: 200 },
    },
    exit: {
      x: isRight ? "100%" : "-100%",
      opacity: 0.5,
      transition: { ease: "easeInOut", duration: 0.3 },
    },
  };

  return (
    <AnimatePresence>
      {show && (
        <>
          {/* Backdrop: Framer Motion bilan */}
          {backdrop && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-[3px]"
            />
          )}

          {/* Offcanvas Panel */}
          <motion.div
            variants={variants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className={`fixed inset-y-0 z-[110] w-full bg-white shadow-2xl flex flex-col ${sizeClass} ${isRight ? "right-0 border-l" : "left-0 border-r"}`}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-3 border-b bg-white sticky top-0 z-20">
              <h3 className="font-bold text-gray-900 text-lg uppercase tracking-tight"></h3>
              <button
                onClick={onClose}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-50 hover:bg-gray-100 transition-colors active:scale-90"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2.5"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <div className="flex-1 flex flex-col justify-between overflow-y-auto overflow-x-hidden custom-scrollbar px-5 pb-6 pt-2">
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default OffcanvasWrapper;
