import { useForm, Controller } from "react-hook-form";
import {
    ClipboardCheck,
    Save,
    X,
    RotateCw,
    AlertCircle
} from "lucide-react";
import { Select } from "@/components/ui";
import { useModal } from "@/context/modal-context";
import { useIntl } from "react-intl";
import { toast } from "react-toastify";
import { handleApiError } from "@/utils/handle-error";
import { authAxios } from "@/utils/axios";
import { mutate } from "swr";
import { useRouter } from "next/router";

const ContactRequestStatusModal = ({ request = null }) => {
    const { closeModal } = useModal();
    const intl = useIntl();
    const router = useRouter();

    const statusOptions = [
        { value: "PENDING", label: intl.formatMessage({ id: "Kutilmoqda (Pending)" }) },
        { value: "CONTACTED", label: intl.formatMessage({ id: "Bog'lanildi (Contacted)" }) },
        { value: "RESOLVED", label: intl.formatMessage({ id: "Hal qilindi (Resolved)" }) },
        { value: "REJECTED", label: intl.formatMessage({ id: "Rad etildi (Rejected)" }) },
    ];

    const {
        handleSubmit,
        control,
        setError,
        formState: { isSubmitting, errors },
    } = useForm({
        defaultValues: {
            status: request?.status || "PENDING",
        },
    });

    const onSubmit = async (formData) => {
        const toastId = toast.loading(intl.formatMessage({ id: "Yangilanmoqda..." }));

        try {
            // API PATCH so'rovi
            await authAxios.patch(`owner-contact-requests/${request.id}/`, {
                status: formData.status,
            });

            toast.update(toastId, {
                render: intl.formatMessage({ id: "Status muvaffaqiyatli yangilandi!" }),
                type: "success",
                isLoading: false,
                autoClose: 3000,
            });

            mutate(["owner-contact-requests/", router.locale]);
            closeModal("CONTACT_FORM");
        } catch (err) {
            toast.dismiss(toastId);
            handleApiError(err, setError);
        }
    };

    return (
        <div className="p-8">
            {/* Header */}
            <div className="flex items-center gap-4 pb-5 sm:pb-10">
                <div className="bg-orange-100 p-4 rounded-3xl text-orange-600">
                    <RotateCw size={32} />
                </div>
                <div>
                    <h2 className="text-2xl font-black text-heading leading-tight">
                        {intl.formatMessage({ id: "Statusni o'zgartirish" })}
                    </h2>
                    <p className="text-muted text-sm font-medium">
                        ID: #{request?.id?.slice(0, 8)} — {request?.full_name}
                    </p>
                </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Info Card */}
                <div className="bg-blue-50/50 border border-blue-100 p-5 rounded-[2rem] flex gap-4 items-start">
                    <AlertCircle className="text-blue-500 shrink-0 mt-1" size={20} />
                    <p className="text-xs text-blue-700 leading-relaxed font-medium">
                        {intl.formatMessage({ id: "Siz ushbu murojaatning joriy holatini o'zgartirmoqchisiz. Status o'zgargandan so'ng, tizimda tegishli belgilar yangilanadi." })}
                    </p>
                </div>

                {/* Status Select */}
                <Controller
                    name="status"
                    control={control}
                    rules={{ required: "Statusni tanlash majburiy" }}
                    render={({ field }) => (
                        <Select
                            label={intl.formatMessage({ id: "Yangi statusni tanlang" })}
                            options={statusOptions}
                            value={field.value}
                            onChange={field.onChange}
                            error={errors.status?.message}
                            placeholder={intl.formatMessage({ id: "Statusni tanlang..." })}
                        />
                    )}
                />

                {/* Action Buttons */}
                <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-100">
                    <button
                        type="button"
                        onClick={() => closeModal("CONTACT_FORM")}
                        className="px-6 py-4 rounded-2xl font-bold text-muted hover:bg-gray-100 transition-all text-sm"
                    >
                        {intl.formatMessage({ id: "Bekor qilish" })}
                    </button>
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="bg-slate-900 text-white font-black px-10 py-4 rounded-2xl shadow-xl shadow-slate-200 transition-all active:scale-95 flex items-center gap-2 disabled:opacity-50 text-sm uppercase tracking-widest"
                    >
                        {isSubmitting ? (
                            <RotateCw className="animate-spin" size={18} />
                        ) : (
                            <Save size={18} />
                        )}
                        {isSubmitting ? intl.formatMessage({ id: "Saqlanmoqda..." }) : intl.formatMessage({ id: "Yangilash" })}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ContactRequestStatusModal;