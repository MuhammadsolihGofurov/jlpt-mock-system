import { useForm } from "react-hook-form";
import { Save, FolderPlus, AlignLeft, Tag } from "lucide-react";
import { Input } from "@/components/ui"; // Textarea komponentingiz bo'lsa, undan foydalaning
import { useModal } from "@/context/modal-context";
import { useIntl } from "react-intl";
import { toast } from "react-toastify";
import { handleApiError } from "@/utils/handle-error";
import { authAxios } from "@/utils/axios";
import { mutate } from "swr";
import { useRouter } from "next/router";
import { useEffect } from "react";

const CategoryFormModal = ({ category = null }) => {
    const { closeModal } = useModal();
    const isEdit = !!category;
    const router = useRouter();
    const intl = useIntl();

    const {
        register,
        handleSubmit,
        setError,
        reset,
        formState: { errors, isSubmitting },
    } = useForm({
        defaultValues: category || {
            name: "",
            description: "",
        },
    });

    // Tahrirlash rejimi bo'lsa, ma'lumotlarni to'ldirish
    useEffect(() => {
        if (category) {
            reset({
                name: category.name,
                description: category.description,
            });
        }
    }, [category, reset]);

    const onSubmit = async (data) => {
        const toastId = toast.loading(intl.formatMessage({ id: "Saqlanmoqda..." }));

        try {
            const method = isEdit ? "patch" : "post";
            const url = isEdit ? `material-categories/${category.id}/` : "material-categories/";

            await authAxios[method](url, data);

            toast.update(toastId, {
                render: intl.formatMessage({
                    id: isEdit
                        ? "Kategoriya yangilandi!"
                        : "Yangi kategoriya muvaffaqiyatli qo'shildi!",
                }),
                type: "success",
                isLoading: false,
                autoClose: 3000,
            });

            // Modalni yopish va ma'lumotlarni yangilash
            closeModal("CATEGORY_MODAL", { refresh: true });
            mutate([`material-categories/`, router.locale])
        } catch (err) {
            toast.dismiss(toastId);
            handleApiError(err, setError);
        }
    };

    return (
        <div className="p-8 w-full">
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
                <div className="bg-orange-100 p-4 rounded-3xl text-primary">
                    <FolderPlus size={32} />
                </div>
                <div>
                    <h2 className="text-2xl font-black text-heading">
                        {intl.formatMessage({
                            id: isEdit ? "Kategoriyani tahrirlash" : "Yangi kategoriya",
                        })}
                    </h2>
                    <p className="text-muted text-sm font-medium">
                        {intl.formatMessage({ id: "Kategoriya nomi va tavsifini kiriting" })}
                    </p>
                </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="space-y-5">
                    {/* Name Input */}
                    <Input
                        label={"Kategoriya nomi"}
                        name="name"
                        register={register}
                        rules={{ required: intl.formatMessage({ id: "Nomini kiritish majburiy" }) }}
                        error={errors.name}
                        placeholder={intl.formatMessage({ id: "Masalan: Dasturlash asoslari" })}
                        icon={<Tag size={18} className="text-muted" />}
                    />

                    {/* Description Input */}
                    <Input
                        label="Tavsif (Description)"
                        name="description"
                        register={register}
                        error={errors.description}
                        placeholder={intl.formatMessage({ id: "JLPT N5 tayyorlov guruhi uchun mo'ljallangan tavsif..." })}
                    />
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-100">
                    <button
                        type="button"
                        onClick={() => closeModal("CATEGORY_MODAL")}
                        className="px-6 py-3.5 rounded-2xl font-bold text-muted hover:bg-gray-100 transition-all"
                    >
                        {intl.formatMessage({ id: "Bekor qilish" })}
                    </button>
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="bg-primary text-white font-black px-8 py-3.5 rounded-2xl shadow-xl shadow-orange-200 transition-all active:scale-95 flex items-center gap-2 disabled:opacity-50"
                    >
                        <Save size={20} />
                        {isSubmitting
                            ? intl.formatMessage({ id: "Saqlanmoqda..." })
                            : intl.formatMessage({ id: "Saqlash" })}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CategoryFormModal;