import { useForm, Controller } from "react-hook-form";
import { FileText, Save, Globe, Lock, FileUp } from "lucide-react";
import { Input, Select } from "@/components/ui";
import { useModal } from "@/context/modal-context";
import { useIntl } from "react-intl";
import { toast } from "react-toastify";
import { handleApiError } from "@/utils/handle-error";
import { authAxios } from "@/utils/axios";
import useSWR, { mutate } from "swr";
import fetcher from "@/utils/fetcher";
import { useRouter } from "next/router";
import { useEffect } from "react";

const MaterialFormModal = ({ material = null }) => {
  const { closeModal } = useModal();
  const isEdit = !!material;
  const router = useRouter();
  const intl = useIntl();

  // 1. Guruhlar ro'yxatini olish (materialni biriktirish uchun)
  const { data: groupsData } = useSWR(
    ["groups/", router.locale],
    (url, locale) =>
      fetcher(
        `${url}?page_size=100`,
        { headers: { "Accept-Language": locale } },
        {},
        true,
      ),
  );

  const groupOptions =
    groupsData?.results?.map((g) => ({
      value: g.id,
      label: g.name,
    })) || [];

  const fileTypeOptions = [
    { value: "PDF", label: "PDF Document" },
    { value: "AUDIO", label: "Audio (MP3, WAV, OGG)" },
    { value: "IMAGE", label: "Image (JPG, PNG)" },
    { value: "DOCX", label: "Word (DOC, DOCX)" },
    { value: "OTHER", label: "Other" },
  ];

  const {
    register,
    handleSubmit,
    control,
    setError,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: material || {
      is_public: true,
      group_ids: [],
    },
  });

  useEffect(() => {
    if (material) {
      reset({
        name: material.name,
        file_type: material.file_type,
        is_public: material.is_public,
        group_ids: material.groups?.map((g) => g.id) || [],
      });
    }
  }, [material, reset]);

  const isPublic = watch("is_public");

  const onSubmit = async (data) => {
    const toastId = toast.loading(intl.formatMessage({ id: "Saqlanmoqda..." }));

    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("file_type", data.file_type);
      formData.append("is_public", data.is_public);

      // Agar yangi fayl tanlangan bo'lsa
      if (data.file && data.file[0]) {
        formData.append("file", data.file[0]);
      }

      // Group IDs massivini jo'natish
      if (data.group_ids && data.group_ids.length > 0) {
        data.group_ids.forEach((id) => formData.append("group_ids", id));
      }

      const method = isEdit ? "patch" : "post";
      const url = isEdit ? `materials/${material.id}/` : "materials/";

      await authAxios[method](url, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.update(toastId, {
        render: intl.formatMessage({
          id: isEdit
            ? "Material yangilandi!"
            : "Material muvaffaqiyatli qo'shildi!",
        }),
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });

      closeModal("MATERIAL_FORM", { refresh: true });
      mutate((key) => Array.isArray(key) && key[0] === "materials/");
    } catch (err) {
      toast.dismiss(toastId);
      handleApiError(err, setError);
    }
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <div className="bg-orange-100 p-4 rounded-3xl text-primary">
          <FileUp size={32} />
        </div>
        <div>
          <h2 className="text-2xl font-black text-heading">
            {intl.formatMessage({
              id: isEdit ? "Materialni tahrirlash" : "Yangi material yuklash",
            })}
          </h2>
          <p className="text-muted text-sm font-medium">
            {intl.formatMessage({ id: "Fayl va uning sozlamalarini kiriting" })}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Material nomi"
            name="name"
            register={register}
            error={errors.name}
            placeholder="N5 Vocabulary List"
          />

          <Controller
            name="file_type"
            control={control}
            rules={{ required: "Fayl turini tanlang" }}
            render={({ field }) => (
              <Select
                label="Fayl turi"
                options={fileTypeOptions}
                value={field.value}
                onChange={field.onChange}
                error={errors.file_type?.message}
                isLabel={false}
              />
            )}
          />
        </div>

        {/* File Upload Input */}
        <div className="space-y-2">
          <label className="text-sm font-bold text-heading px-1">
            Faylni tanlang
          </label>
          <input
            type="file"
            {...register("file", {
              required: !isEdit && "Fayl yuklash majburiy",
            })}
            className="w-full px-5 py-3 rounded-2xl border-2 border-dashed border-gray-200 hover:border-primary transition-colors file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-primary"
          />
          {errors.file && (
            <p className="text-xs text-red-500 font-bold">
              {errors.file.message}
            </p>
          )}
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
            onClick={() => closeModal("MATERIAL_FORM")}
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
              ? intl.formatMessage({ id: "Yuklanmoqda..." })
              : intl.formatMessage({ id: "Saqlash" })}
          </button>
        </div>
      </form>
    </div>
  );
};

export default MaterialFormModal;
