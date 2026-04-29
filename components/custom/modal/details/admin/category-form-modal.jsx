import { Controller, useForm } from "react-hook-form";
import { Save, FolderPlus, AlignLeft, Tag } from "lucide-react";
import { Input, Select } from "@/components/ui"; // Textarea komponentingiz bo'lsa, undan foydalaning
import { useModal } from "@/context/modal-context";
import { useIntl } from "react-intl";
import { toast } from "react-toastify";
import { handleApiError } from "@/utils/handle-error";
import { authAxios } from "@/utils/axios";
import useSWR, { mutate } from "swr";
import { useRouter } from "next/router";
import { useEffect } from "react";
import fetcher from "@/utils/fetcher";

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
        watch,
        control,
        formState: { errors, isSubmitting },
    } = useForm({
        defaultValues: category || {
            name: "",
            description: "",
            is_public: true,
            group_ids: [],
        },
    });

    const isPublic = watch("is_public");

    // Tahrirlash rejimi bo'lsa, ma'lumotlarni to'ldirish
    useEffect(() => {
        if (category) {
            reset({
                name: category.name,
                description: category.description,
                group_ids: category.groups?.map((g) => g.id) || [],
                is_public: category.is_public,
            });
        }
    }, [category]);


    // 1. Guruhlar ro'yxatini olish (materialni biriktirish uchun)
    const { data: groupsData } = useSWR(
        ["groups/", router.locale],
        (url, locale) =>
            fetcher(
                `${url}?page=all`,
                { headers: { "Accept-Language": locale } },
                {},
                true,
            ),
    );


    const groupOptions =
        groupsData?.map((g) => ({
            value: g.id,
            label: g.name,

        })) || [];

    const onSubmit = async (data) => {
        const toastId = toast.loading(intl.formatMessage({ id: "Saqlanmoqda..." }));

        try {
            const method = isEdit ? "patch" : "post";
            const url = isEdit ? `material-categories/${category.id}/` : "material-categories/";
            const formData = new FormData();

            formData.append("name", data.name);
            formData.append("file_type", data.file_type);
            formData.append("category_id", category);

            // Agar yangi fayl tanlangan bo'lsa
            if (data.file && data.file[0]) {
                formData.append("file", data.file[0]);
            }

            // Group IDs massivini jo'natish
            if (data.group_ids && data.group_ids.length > 0) {
                data.group_ids.forEach((id) => formData.append("group_ids", id));
            }

            await authAxios[method](url, formData);

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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Controller
                        name="is_public"
                        control={control}
                        render={({ field }) => (
                            <Select
                                label="Kirish huquqi"
                                options={[
                                    { value: true, label: "Hamma uchun (Public)" },
                                    { value: false, label: "Faqat tanlangan guruhlar" },
                                ]}
                                value={field.value}
                                onChange={field.onChange}
                                error={errors.is_public?.message}
                            />
                        )}
                    />

                    {!isPublic && (
                        <Controller
                            name="group_ids"
                            control={control}
                            render={({ field }) => (
                                <Select
                                    label="Guruhlarni biriktirish"
                                    isMulti={true}
                                    options={groupOptions}
                                    value={field.value}
                                    onChange={field.onChange}
                                    placeholder="Guruhni tanlang"
                                    error={errors.group_ids?.message}
                                    isLabel={false}
                                />
                            )}
                        />
                    )}
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