import { useForm, Controller } from "react-hook-form";
import { BookOpen, Save, Users } from "lucide-react";
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

const GroupFormModal = ({ group = null }) => {
  const { closeModal } = useModal();
  const isEdit = !!group;
  const router = useRouter();
  const intl = useIntl();

  // 1. O'qituvchilar ro'yxatini olish
  const { data: teachersData } = useSWR(
    ["users/", router.locale, "TEACHER"],
    (url, locale) =>
      fetcher(
        `${url}?page=all&role=TEACHER`,
        { headers: { "Accept-Language": locale } },
        {},
        true,
      ),
  );

  const teacherOptions =
    teachersData?.map((t) => ({
      value: t.id,
      label: `${t.first_name} ${t.last_name}`,
    })) || [];

  const {
    register,
    handleSubmit,
    control,
    setError,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: group || {
      is_active: true,
      max_students: 20,
      teacher_ids: [],
    },
  });

  const { data: groupData } = useSWR(
    isEdit ? [`groups/${group.id}/`, router.locale] : null,
    (url, locale) =>
      fetcher(url, { headers: { "Accept-Language": locale } }, {}, true),
  );

  useEffect(() => {
    if (groupData) {
      reset({
        name: groupData.name,
        description: groupData.description,
        max_students: groupData.max_students,
        is_active: groupData.is_active,
        teacher_ids:
          groupData.teachers?.map((t) => t.id) || groupData.teacher_ids || [],
      });
    }
  }, [groupData, reset]);

  const onSubmit = async (formData) => {
    const toastId = toast.loading(intl.formatMessage({ id: "Saqlanmoqda..." }));

    try {
      const method = isEdit ? "patch" : "post";
      const url = isEdit ? `groups/${group.id}/` : "groups/";

      await authAxios[method](url, formData);

      toast.update(toastId, {
        render: intl.formatMessage({
          id: isEdit ? "Guruh yangilandi!" : "Yangi guruh yaratildi!",
        }),
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });

      closeModal("GROUP_FORM", { refresh: true });
      mutate((key) => Array.isArray(key) && key[0] === "groups/");
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
          <BookOpen size={32} />
        </div>
        <div>
          <h2 className="text-2xl font-black text-heading">
            {intl.formatMessage({
              id: isEdit ? "Guruhni tahrirlash" : "Yangi guruh yaratish",
            })}
          </h2>
          <p className="text-muted text-sm font-medium">
            {intl.formatMessage({ id: "Guruh ma'lumotlarini kiriting" })}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Guruh nomi"
            name="name"
            register={register}
            error={errors.name}
            placeholder="N5 Prep 2024"
          />

          <Input
            label="Maksimal talabalar soni"
            name="max_students"
            type="number"
            register={register}
            error={errors.max_students}
            placeholder="30"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Controller
            name="teacher_ids"
            control={control}
            render={({ field }) => (
              <Select
                label="O'qituvchilar"
                isMulti={true}
                options={teacherOptions}
                isLabel={false}
                value={field.value}
                onChange={field.onChange}
                error={errors.teacher_ids?.message}
                placeholder="O'qituvchini tanlang"
              />
            )}
          />

          <Controller
            name="is_active"
            control={control}
            render={({ field }) => (
              <Select
                label="Holat"
                options={[
                  { value: true, label: "Faol" },
                  { value: false, label: "Noaktiv" },
                ]}
                value={field.value}
                onChange={field.onChange}
                error={errors.is_active?.message}
              />
            )}
          />
        </div>

        <Input
          label="Tavsif (Description)"
          name="description"
          register={register}
          error={errors.description}
          placeholder="JLPT N5 preparation class..."
        />

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-100">
          <button
            type="button"
            onClick={() => closeModal("GROUP_FORM")}
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

export default GroupFormModal;
