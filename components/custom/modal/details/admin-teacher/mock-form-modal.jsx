import { useForm, Controller } from "react-hook-form";
import { ClipboardList, Save, Award, PlusCircle } from "lucide-react";
import { Input, Select } from "@/components/ui";
import { useModal } from "@/context/modal-context";
import { useIntl } from "react-intl";
import { toast } from "react-toastify";
import { handleApiError } from "@/utils/handle-error";
import { authAxios } from "@/utils/axios";
import { mutate } from "swr";
import { useRouter } from "next/router";
import { useEffect } from "react";

const MockFormModal = ({ mock = null }) => {
  const { closeModal } = useModal();
  const isEdit = !!mock;
  const intl = useIntl();
  const router = useRouter();

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
      level: "N5",
      description: "",
      status: "DRAFT",
      pass_score: 90,
      total_score: 180,
    },
  });

  useEffect(() => {
    if (mock) {
      reset({
        title: mock.title,
        level: mock.level,
        description: mock.description,
        status: mock.status || "DRAFT",
        pass_score: mock.pass_score,
        total_score: mock.total_score,
      });
    }
  }, [mock, reset]);

  const onSubmit = async (data) => {
    const toastId = toast.loading(
      intl.formatMessage({ id: isEdit ? "Yangilanmoqda..." : "Yaratilmoqda..." })
    );

    try {
      const method = isEdit ? "patch" : "post";
      const url = isEdit ? `/mock-tests/${mock.id}/` : "/mock-tests/";

      await authAxios[method](url, data);

      toast.update(toastId, {
        render: intl.formatMessage({
          id: isEdit ? "Mock muvaffaqiyatli yangilandi!" : "Mock muvaffaqiyatli yaratildi!",
        }),
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });

      closeModal("MOCK_FORM", { refresh: true });
      // Mocks ro'yxatini yangilash
      mutate((key) => Array.isArray(key) && key[0] === "mock-tests/");
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
          <ClipboardList size={32} />
        </div>
        <div>
          <h2 className="text-2xl font-black text-heading">
            {intl.formatMessage({ 
              id: isEdit ? "Mockni tahrirlash" : "Yangi Mock yaratish" 
            })}
          </h2>
          <p className="text-muted text-sm font-medium">
            {intl.formatMessage({
              id: isEdit ? "Mavjud mock ma'lumotlarini o'zgartiring" : "Yangi imtihon bazasini shakllantiring",
            })}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Imtihon nomi"
            name="title"
            register={register}
            error={errors.title}
            placeholder="JLPT N5 Mock Exam 2025"
            rules={{ required: intl.formatMessage({ id: "Nom majburiy" }) }}
          />

          <Controller
            name="level"
            control={control}
            render={({ field }) => (
              <Select
                label="Daraja (Level)"
                options={[
                  { value: "N1", label: "N1" },
                  { value: "N2", label: "N2" },
                  { value: "N3", label: "N3" },
                  { value: "N4", label: "N4" },
                  { value: "N5", label: "N5" },
                ]}
                value={field.value}
                onChange={field.onChange}
                error={errors.level?.message}
              />
            )}
          />
        </div>

        <Input
          label="Tavsif (Description)"
          name="description"
          register={register}
          error={errors.description}
          placeholder="Amaliy test to'plami haqida..."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="relative">
            <Input
              label="Umumiy ball"
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
              label="O'tish bali"
              name="pass_score"
              type="number"
              register={register}
              error={errors.pass_score}
            />
            <div className="absolute right-4 top-[38px] text-emerald-300">
              <PlusCircle size={20} />
            </div>
          </div>
        </div>

        {/* Status indicator (Tahrirlashda ham o'zgarmas qolishi mumkin) */}
        <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 flex items-center justify-between">
          <span className="text-xs font-black text-muted uppercase tracking-widest">
            {intl.formatMessage({ id: "Imtihon holati" })}
          </span>
          <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black tracking-widest uppercase ${
            isEdit && mock.status === 'PUBLISHED' ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-primary'
          }`}>
            {isEdit ? mock.status : "DRAFT"}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-100">
          <button
            type="button"
            onClick={() => closeModal("MOCK_FORM")}
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
            {isSubmitting
              ? intl.formatMessage({ id: "Saqlanmoqda..." })
              : intl.formatMessage({ id: "Saqlash" })}
          </button>
        </div>
      </form>
    </div>
  );
};

export default MockFormModal;