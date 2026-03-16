import { useForm, Controller } from "react-hook-form";
import {
  GraduationCap,
  Save,
  Users,
  Calendar,
  ClipboardCheck,
} from "lucide-react";
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

const ExamFormModal = ({ exam = null }) => {
  const { closeModal } = useModal();
  const isEdit = !!exam;
  const router = useRouter();
  const intl = useIntl();

  // 1. Mock testlar ro'yxatini olish (Imtihon shabloni uchun)
  const { data: mocksData } = useSWR(
    ["mock-tests/", router.locale],
    (url, locale) =>
      fetcher(
        `${url}?page=all&status=PUBLISHED`,
        { headers: { "Accept-Language": locale } },
        {},
        true,
      ),
  );

  // 2. Guruhlar ro'yxatini olish
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

  const mockOptions =
    mocksData?.map((m) => ({
      value: m.id,
      label: `${m.title} (${m.level})`,
    })) || [];

  const groupOptions =
    groupsData?.map((g) => ({
      value: g.id,
      label: g.name,
    })) || [];

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
      description: "",
      mock_test: "",
      estimated_start_time: "",
      assigned_group_ids: [],
      status: "CLOSED",
      is_published: false,
    },
  });

  useEffect(() => {
    if (exam) {
      reset({
        title: exam.title,
        description: exam.description,
        mock_test: exam.mock_test,
        estimated_start_time: exam.estimated_start_time?.slice(0, 16), // datetime-local formatiga moslash
        assigned_group_ids: exam.assigned_groups?.map((g) => g.id) || [],
        status: exam.status,
        is_published: exam.is_published,
      });
    }
  }, [exam, reset]);

  const onSubmit = async (formData) => {
    const toastId = toast.loading(intl.formatMessage({ id: "Saqlanmoqda..." }));

    try {
      const method = isEdit ? "patch" : "post";
      const url = isEdit ? `exam-assignments/${exam.id}/` : "exam-assignments/";

      // API kutilganidek doim CLOSED va false yuborish (siz so'ragandek)
      const finalData = {
        ...formData,
        estimated_start_time: formData.estimated_start_time
          ? new Date(formData.estimated_start_time).toISOString()
          : null,
        status: isEdit ? formData.status : "CLOSED",
        is_published: isEdit ? formData.is_published : false,
      };

      await authAxios[method](url, finalData);

      toast.update(toastId, {
        render: intl.formatMessage({
          id: isEdit ? "Imtihon yangilandi!" : "Yangi imtihon yaratildi!",
        }),
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });

      closeModal("EXAM_FORM", { refresh: true });
      mutate((key) => Array.isArray(key) && key[0] === "exams/");
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
          <GraduationCap size={32} />
        </div>
        <div>
          <h2 className="text-2xl font-black text-heading">
            {isEdit ? "Imtihonni tahrirlash" : "Yangi imtihon yaratish"}
          </h2>
          <p className="text-muted text-sm font-medium">
            {intl.formatMessage({
              id: "Imtihon vaqti va guruhlarni belgilang",
            })}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Input
          label="Imtihon nomi"
          name="title"
          register={register}
          error={errors.title}
          placeholder="JLPT N5 Final Mock"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Controller
            name="mock_test"
            control={control}
            rules={{ required: "Mock test tanlash majburiy" }}
            render={({ field }) => (
              <Select
                label="Mock Test (Shablon)"
                options={mockOptions}
                value={field.value}
                onChange={field.onChange}
                error={errors.mock_test?.message}
                placeholder="Test shablonini tanlang"
              />
            )}
          />

          <Input
            label="Boshlanish vaqti"
            name="estimated_start_time"
            type="datetime-local"
            register={register}
            error={errors.estimated_start_time}
          />
        </div>

        <Controller
          name="assigned_group_ids"
          control={control}
          render={({ field }) => (
            <Select
              label="Guruhlarni biriktirish"
              isMulti={true}
              options={groupOptions}
              value={field.value}
              onChange={field.onChange}
              error={errors.assigned_group_ids?.message}
              placeholder="Guruhlarni tanlang"
            />
          )}
        />

        <div className="bg-slate-50 p-5 rounded-[2rem] border border-slate-100">
          <div className="flex items-center gap-3 text-slate-500 mb-2">
            <ClipboardCheck size={18} />
            <span className="text-sm font-bold uppercase tracking-wider">
              {intl.formatMessage({ id: "Avtomatik sozlamalar" })}
            </span>
          </div>
          <p className="text-xs text-muted leading-relaxed">
            {intl.formatMessage({
              id: "Yangi yaratilgan imtihonlar sukut bo'yicha CLOSED (yopiq) holatda bo'ladi va natijalari e'lon qilinmaydi. Imtihonni boshlash uchun uni ro'yxatdan 'Ochish' tugmasi orqali faollashtiring.",
            })}
          </p>
        </div>

        <Input
          label="Qo'shimcha izoh"
          name="description"
          register={register}
          error={errors.description}
          placeholder="Imtihon haqida eslatmalar..."
        />

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-100">
          <button
            type="button"
            onClick={() => closeModal("EXAM_FORM")}
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
            {isSubmitting ? "Saqlanmoqda..." : "Saqlash"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ExamFormModal;
