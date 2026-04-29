import { useForm, Controller } from "react-hook-form";
import { ClipboardList, Save, Award, PlusCircle, Clock } from "lucide-react";
import { Input, Select } from "@/components/ui";
import { useModal } from "@/context/modal-context";
import { useIntl } from "react-intl";
import { toast } from "react-toastify";
import { handleApiError } from "@/utils/handle-error";
import { authAxios } from "@/utils/axios";
import { mutate } from "swr";
import { useEffect } from "react";

const JFTMockFormModal = ({ mock = null }) => {
    const { closeModal } = useModal();
    const isEdit = !!mock;
    const intl = useIntl();

    const {
        register,
        handleSubmit,
        control,
        setError,
        reset,
        formState: { errors, isSubmitting },
    } = useForm({
        defaultValues: {
            title: "",
            level: "A2",
            description: "",
            status: "DRAFT", // Doim DRAFT bo'ladi
            pass_score: 200,
            total_score: 250,
            duration_minutes: 60,
        },
    });

    useEffect(() => {
        if (mock) {
            reset({
                title: mock.title,
                level: mock.level,
                description: mock.description,
                status: "DRAFT",
                pass_score: mock.pass_score,
                total_score: mock.total_score,
                duration_minutes: mock.duration_minutes || 60,
            });
        }
    }, [mock]);

    const onSubmit = async (data) => {
        const toastId = toast.loading(
            intl.formatMessage({ id: isEdit ? "Yangilanmoqda..." : "Yaratilmoqda..." })
        );

        try {
            const method = isEdit ? "patch" : "post";
            const url = isEdit ? `/jft-mock-tests/${mock.id}/` : "/jft-mock-tests/";

            // Ma'lumotlarni yuborishda status har doim DRAFT bo'lishini ta'minlaymiz
            const payload = { ...data, status: "DRAFT" };

            await authAxios[method](url, payload);

            toast.update(toastId, {
                render: intl.formatMessage({
                    id: isEdit ? "JFT Mock muvaffaqiyatli yangilandi!" : "JFT Mock muvaffaqiyatli yaratildi!",
                }),
                type: "success",
                isLoading: false,
                autoClose: 3000,
            });

            closeModal("JFT_MOCK_FORM", { refresh: true });
            mutate((key) => Array.isArray(key) && key[0] === "/jft-mock-tests/");
        } catch (err) {
            toast.dismiss(toastId);
            handleApiError(err, setError);
        }
    };

    return (
        <div className="p-8">
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
                <div className="bg-blue-100 p-4 rounded-3xl text-blue-600">
                    <ClipboardList size={32} />
                </div>
                <div>
                    <h2 className="text-2xl font-black text-heading">
                        {intl.formatMessage({
                            id: isEdit ? "JFT Mockni tahrirlash" : "Yangi JFT Mock yaratish"
                        })}
                    </h2>
                    <p className="text-muted text-sm font-medium">
                        {intl.formatMessage({ id: "JFT-Basic imtihon tizimi uchun test bazasini boshqarish" })}
                    </p>
                </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input
                        label={intl.formatMessage({ id: "Test nomi" })}
                        name="title"
                        register={register}
                        error={errors.title}
                        placeholder={intl.formatMessage({ id: "Masalan, JFT A2 Mock - April Batch" })}
                        rules={{ required: intl.formatMessage({ id: "Nom majburiy" }) }}
                    />

                    <Controller
                        name="level"
                        control={control}
                        render={({ field }) => (
                            <Select
                                label={intl.formatMessage({ id: "Daraja (Level)" })}
                                options={[
                                    { value: "A1", label: "A1" },
                                    { value: "A2", label: "A2" },
                                    { value: "A1_A2", label: "A1_A2" },
                                ]}
                                value={field.value}
                                onChange={field.onChange}
                                error={errors.level?.message}
                            />
                        )}
                    />
                </div>

                <Input
                    label={intl.formatMessage({ id: "Tavsif" })}
                    name="description"
                    register={register}
                    error={errors.description}
                    placeholder={intl.formatMessage({ id: "Beginner communication-focused mock." })}
                />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="relative">
                        <Input
                            label={intl.formatMessage({ id: "Umumiy ball" })}
                            name="total_score"
                            type="number"
                            register={register}
                            error={errors.total_score}
                        />
                        <div className="absolute right-4 top-[38px] text-slate-300">
                            <Award size={20} />
                        </div>
                    </div>

                    <div className="relative">
                        <Input
                            label={intl.formatMessage({ id: "O'tish bali" })}
                            name="pass_score"
                            type="number"
                            register={register}
                            error={errors.pass_score}
                        />
                        <div className="absolute right-4 top-[38px] text-emerald-300">
                            <PlusCircle size={20} />
                        </div>
                    </div>

                    <div className="relative">
                        <Input
                            label={intl.formatMessage({ id: "Davomiyligi (minut)" })}
                            name="duration_minutes"
                            type="number"
                            register={register}
                            error={errors.duration_minutes}
                        />
                        <div className="absolute right-4 top-[38px] text-orange-300">
                            <Clock size={20} />
                        </div>
                    </div>
                </div>

                <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 flex items-center justify-between">
                    <span className="text-xs font-black text-muted uppercase tracking-widest">
                        {intl.formatMessage({ id: "Imtihon holati" })}
                    </span>
                    <span className="px-4 py-1.5 rounded-xl text-[10px] bg-orange-100 text-orange-600 font-black tracking-widest uppercase">
                        {intl.formatMessage({ id: "DRAFT" })}
                    </span>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-100">
                    <button
                        type="button"
                        onClick={() => closeModal("JFT_MOCK_FORM")}
                        className="px-6 py-3.5 rounded-2xl font-bold text-muted hover:bg-gray-100 transition-all"
                    >
                        {intl.formatMessage({ id: "Bekor qilish" })}
                    </button>
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="bg-primary hover:bg-primary-dark text-white font-black px-8 py-3.5 rounded-2xl shadow-xl shadow-orange-200 transition-all active:scale-95 flex items-center gap-2 disabled:opacity-50"
                    >
                        <Save size={18} />
                        {intl.formatMessage({ id: isSubmitting ? "Saqlanmoqda..." : "Saqlash" })}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default JFTMockFormModal;