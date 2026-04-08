import React, { useState } from "react";
import { AlertTriangle, Loader2 } from "lucide-react";
import { useModal } from "@/context/modal-context";
import { useIntl } from "react-intl";
import { mutate } from "swr";
import { toast } from "react-toastify";
import { handleApiError } from "@/utils/handle-error";
import { useRouter } from "next/router";

const ConfirmModal = ({
  title,
  body,
  onConfirm,
  confirmText,
  onClose = () => { },
  cancelText = "Bekor qilish",
  variant = "danger",
  local = "unclear",
  mutateKey,
}) => {
  const intl = useIntl();
  const router = useRouter();
  const { closeModal } = useModal();
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    setLoading(true);
    const toastId = toast.loading(
      intl.formatMessage({ id: "Bajarilmoqda..." }),
    );

    try {
      const response = await onConfirm();

      toast.update(toastId, {
        render:
          response?.data?.message ||
          response?.data?.status ||
          response?.data?.detail ||
          intl.formatMessage({ id: "Muvaffaqiyatli..." }),
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });

      if (mutateKey) {
        mutate(mutateKey);
      } else {
        mutate();
      }

      if (local === "clear") {
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");

        router.push("/login");
      }

      closeModal("CONFIRM_MODAL", { refresh: true });
    } catch (error) {
      const msg = handleApiError(error);
      toast.error(msg);
      toast.dismiss(toastId)
    } finally {
      setLoading(false);
    }
  };

  const isDanger = variant === "danger";

  return (
    <div className="p-8 text-center">
      <div
        className={`mx-auto w-20 h-20 rounded-[2rem] flex items-center justify-center mb-6 
        ${isDanger ? "bg-red-50 text-danger shadow-lg shadow-red-100" : "bg-orange-50 text-primary shadow-lg shadow-orange-100"}`}
      >
        <AlertTriangle size={40} strokeWidth={2.5} />
      </div>

      <h2 className="text-2xl font-black text-heading mb-3 leading-tight">
        {intl.formatMessage({ id: title }) || "Ishonchingiz komilmi?"}
      </h2>
      <p className="text-muted font-medium mb-8 px-4 leading-relaxed">
        {intl.formatMessage({ id: body }) ||
          "Ushbu amalni ortga qaytarib bo'lmasligi mumkin."}
      </p>

      <div className="flex flex-col-reverse sm:flex-row items-center gap-3">
        <button
          type="button"
          onClick={() => { closeModal("CONFIRM_MODAL"); onClose() }}
          className="w-full py-4 rounded-2xl font-bold text-muted hover:bg-gray-100 transition-all active:scale-95"
        >
          {intl.formatMessage({ id: cancelText })}
        </button>

        <button
          type="button"
          onClick={handleConfirm}
          disabled={loading}
          className={`w-full py-4 rounded-2xl font-black text-white shadow-xl transition-all active:scale-95 flex items-center justify-center gap-2
            ${isDanger ? "bg-danger hover:bg-red-600 shadow-red-200" : "bg-primary hover:bg-primary-dark shadow-orange-200"}`}
        >
          {loading ? (
            <Loader2 className="animate-spin" size={20} />
          ) : (
            intl.formatMessage({ id: confirmText }) || "Tasdiqlash"
          )}
        </button>
      </div>
    </div>
  );
};

export default ConfirmModal;
