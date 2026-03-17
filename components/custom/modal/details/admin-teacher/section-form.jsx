import { useForm, Controller } from "react-hook-form";
import { LayoutGrid, Save, Clock, Hash, Award, Activity } from "lucide-react";
import { Input, Select } from "@/components/ui";
import { useModal } from "@/context/modal-context";
import { useIntl } from "react-intl";
import { toast } from "react-toastify";
import { handleApiError } from "@/utils/handle-error";
import { authAxios } from "@/utils/axios";
import { mutate } from "swr";
import { useEffect } from "react";
import { useRouter } from "next/router";

const SectionFormModal = ({ mockId, section = null, section_count = 0, }) => {
  const { closeModal } = useModal();
  const isEdit = !!section;
  const router = useRouter();
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
      name: "",
      section_type: "VOCAB",
      duration: 20,
      order: section_count + 1,
      total_score: 60,
    },
  });

  useEffect(() => {
    if (section) {
      reset({
        name: section.name,
        section_type: section.section_type,
        duration: section.duration,
        order: section.order,
        total_score: section.total_score,
      });
    }
  }, [section, reset]);

  const onSubmit = async (data) => {
    const toastId = toast.loading(
      intl.formatMessage({
        id: isEdit ? "Yangilanmoqda..." : "Yaratilmoqda...",
      }),
    );

    try {
      const method = isEdit ? "patch" : "post";
      const url = isEdit ? `/test-sections/${section.id}/` : `/test-sections/`;

      const payload = isEdit ? data : { ...data, mock_test: mockId };

      await authAxios[method](url, payload);

      toast.update(toastId, {
        render: intl.formatMessage({
          id: isEdit
            ? "Bo'lim yangilandi!"
            : "Bo'lim muvaffaqiyatli qo'shildi!",
        }),
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });

      closeModal("SECTION_FORM", { refresh: true });
      mutate([`/mock-tests/${mockId}/`, router.locale]);
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
          <LayoutGrid size={32} />
        </div>
        <div>
          <h2 className="text-2xl font-black text-heading">
            {intl.formatMessage({
              id: isEdit ? "Bo'limni tahrirlash" : "Yangi bo'lim qo'shish",
            })}
          </h2>
          <p className="text-muted text-sm font-medium">
            {intl.formatMessage({ id: "JLPT bo'limi parametrlarini kiriting" })}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Input
            label="Bo'lim nomi"
            name="name"
            register={register}
            error={errors.name}
            placeholder="Masalan: Vocabulary (Moji-Goi)"
            rules={{ required: intl.formatMessage({ id: "Nom majburiy" }) }}
          />

          <Controller
            name="section_type"
            control={control}
            render={({ field }) => (
              <Select
                label="Bo'lim turi"
                options={[
                  { value: "VOCAB", label: "Vocabulary" },
                  //   { value: "GRAMMAR", label: "Grammar" },
                  { value: "GRAMMAR_READING", label: "Reading" },
                  { value: "LISTENING", label: "Listening" },
                ]}
                value={field.value}
                onChange={field.onChange}
                error={errors.section_type?.message}
              />
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="relative">
            <Input
              label="Vaqt (daqiqa)"
              name="duration"
              type="number"
              register={register}
              error={errors.duration}
              placeholder="20"
            />
            <div className="absolute right-4 top-[38px] text-slate-300">
              <Clock size={18} />
            </div>
          </div>

          <div className="relative">
            <Input
              label="Maksimal Ball"
              name="total_score"
              type="number"
              register={register}
              error={errors.total_score}
              placeholder="60"
            />
            <div className="absolute right-4 top-[38px] text-emerald-400">
              <Award size={18} />
            </div>
          </div>

          <div className="relative">
            <Input
              label="Tartib raqami"
              name="order"
              type="number"
              register={register}
              error={errors.order}
              placeholder="1"
            />
            <div className="absolute right-4 top-[38px] text-slate-300">
              <Hash size={18} />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-100 mt-4">
          <button
            type="button"
            onClick={() => closeModal("SECTION_FORM")}
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
            {isSubmitting ? "Saqlanmoqda..." : "Saqlash"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SectionFormModal;
