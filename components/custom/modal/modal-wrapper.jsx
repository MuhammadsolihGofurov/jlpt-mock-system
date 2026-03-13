import { X } from "lucide-react";
import React, { useEffect } from "react";
import { motion } from "framer-motion";

const ModalWrapper = ({ children, onClose, size = "big" }) => {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  const sizes = {
    big: "max-w-[1600px]",
    video: "max-w-[1200px]",
    middle: "max-w-[760px]",
    small: "max-w-[480px]",
    default: "max-w-[500px]",
  };

  const modalSizeClass = sizes[size] || sizes.default;

  return (
    <div className="fixed inset-0 z-50 flex justify-center items-start overflow-y-auto custom-scrollbar bg-black/50 backdrop-blur-sm sm:px-0 px-3 py-10">
      {/* Backdrop - orqa fon */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0"
      />

      {/* Modal Oynasi */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: -40 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 40 }} // Yopilganda pastga qarab tushadi
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className={`bg-white rounded-2xl shadow-2xl relative z-10 ${modalSizeClass} w-full my-auto`}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className={`absolute z-[11] flex items-center justify-center bg-white/80 backdrop-blur-md rounded-full text-gray-500 hover:text-black transition-all
            ${size === "small" || size === "middle" ? "top-4 right-4 w-8 h-8" : "top-4 right-4 sm:top-6 sm:right-6 w-10 h-10"}`}
          onClick={onClose}
        >
          <X size={size === "small" ? 18 : 22} />
        </button>

        <div className="w-full">{children}</div>
      </motion.div>
    </div>
  );
};

export default ModalWrapper;
