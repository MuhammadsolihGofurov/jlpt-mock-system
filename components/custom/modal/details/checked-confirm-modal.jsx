import React, { useState } from "react";
import { AlertTriangle, Loader2 } from "lucide-react";
import { useModal } from "@/context/modal-context";
import { useIntl } from "react-intl";
import { mutate } from "swr";
import { toast } from "react-toastify";
import { handleApiError } from "@/utils/handle-error";

const CheckedConfirmModal = ({
    title,
    body,
    onConfirm,
    confirmText,
    onClose = () => { },
    cancelText = "Bekor qilish",
    variant = "danger",
    mutateKey,
}) => {
    const intl = useIntl();
    const { closeModal } = useModal();
    const [loading, setLoading] = useState(false);
    const [isChecked, setIsChecked] = useState(false);   // ← Yangi state

    const handleConfirm = async () => {
        if (!isChecked) return; // qo'shimcha himoya

        setLoading(true);
        const toastId = toast.loading(intl.formatMessage({ id: "Bajarilmoqda..." }));

        try {
            const response = await onConfirm();

            toast.update(toastId, {
                render: response?.data?.message || response?.data?.status || intl.formatMessage({ id: "Muvaffaqiyatli..." }),
                type: "success",
                isLoading: false,
                autoClose: 3000,
            });

            if (mutateKey) mutate(mutateKey);
            else mutate();

            closeModal("CHECKED_CONFIRM_MODAL", { refresh: true });
        } catch (error) {
            const msg = handleApiError(error);
            toast.error(msg);
            toast.dismiss(toastId);
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

            <div className="text-muted font-medium mb-8 px-4 leading-relaxed">
                <div dangerouslySetInnerHTML={{ __html: intl.formatMessage({ id: body }) }} />
            </div>

            {/* ==================== CHECKBOX ==================== */}
            <div className="mb-8 px-4">
                <label className="flex items-start gap-3 cursor-pointer group">
                    <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={(e) => setIsChecked(e.target.checked)}
                        className="mt-1 w-5 h-5 accent-danger rounded border-gray-300 focus:ring-danger cursor-pointer"
                    />
                    <span className="text-sm text-left text-slate-600 leading-relaxed">
                        {intl.formatMessage({ id: "checked_confirm_checkbox_text" })}
                    </span>
                </label>
            </div>

            <div className="flex flex-col-reverse sm:flex-row items-center gap-3">
                <button
                    type="button"
                    onClick={() => {
                        closeModal("CHECKED_CONFIRM_MODAL");
                        onClose();
                    }}
                    className="w-full py-4 rounded-2xl font-bold text-muted hover:bg-gray-100 transition-all active:scale-95"
                >
                    {intl.formatMessage({ id: cancelText })}
                </button>

                <button
                    type="button"
                    onClick={handleConfirm}
                    disabled={loading || !isChecked}   // ← Eng muhim qism
                    className={`w-full py-4 rounded-2xl font-black text-white shadow-xl transition-all active:scale-95 flex items-center justify-center gap-2
                        ${isDanger
                            ? "bg-danger hover:bg-red-600 shadow-red-200"
                            : "bg-primary hover:bg-primary-dark shadow-orange-200"}
                        ${!isChecked && "opacity-50 cursor-not-allowed"}
                    `}
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

export default CheckedConfirmModal;