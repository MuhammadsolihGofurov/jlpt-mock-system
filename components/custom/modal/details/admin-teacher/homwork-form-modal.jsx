import { useForm, Controller } from "react-hook-form";
import {
  BookOpen,
  Save,
  Users,
  Calendar,
  CheckSquare,
  ClipboardList,
  HelpCircle,
} from "lucide-react";
import { Input, Select } from "@/components/ui";
import { useModal } from "@/context/modal-context";
import { authAxios } from "@/utils/axios";
import { toast } from "react-toastify";
import useSWR, { mutate } from "swr";
import fetcher from "@/utils/fetcher";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useIntl } from "react-intl";

const HomeworkFormModal = ({ homework = null }) => {
  const { closeModal } = useModal();
  const isEdit = !!homework;
  const intl = useIntl();
  const router = useRouter();
  const { page = 1, search } = router.query;

  // 1. Ma'lumotlarni yuklab olish (Mocklar, Quizlar, Guruhlar)
  const { data: mocksData } = useSWR(
    ["mock-tests/", router.locale],
    (url, loc) =>
      fetcher(
        `${url}?page=all`,
        { headers: { "Accept-Language": loc } },
        {},
        true,
      ),
  );
  const { data: quizzesData } = useSWR(
    ["quizzes/", router.locale],
    (url, loc) =>
      fetcher(
        `${url}?page=all&is_active=true`,
        { headers: { "Accept-Language": loc } },
        {},
        true,
      ),
  );
  const { data: groupsData } = useSWR(["groups/", router.locale], (url, loc) =>
    fetcher(
      `${url}?page=all`,
      { headers: { "Accept-Language": loc } },
      {},
      true,
    ),
  );

  const mockOptions =
    mocksData?.map((m) => ({
      value: m.id,
      label: `${m.title} (${m.level})`,
    })) || [];
  const quizOptions =
    quizzesData?.map((q) => ({ value: q.id, label: q.title })) || [];
  const groupOptions =
    groupsData?.map((g) => ({ value: g.id, label: g.name })) || [];

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      title: "",
      description: "",
      deadline: "",
      mock_test_ids: [],
      quiz_ids: [],
      assigned_group_ids: [],
      assigned_user_ids: [],
      show_results_immediately: true,
    },
  });

  useEffect(() => {
    if (homework) {
      reset({
        title: homework.title,
        description: homework.description,
        deadline: homework.deadline?.slice(0, 16),
        mock_test_ids: homework.mock_tests?.map((m) => m.id) || [],
        quiz_ids: homework.quizzes?.map((q) => q.id) || [],
        assigned_group_ids: homework.assigned_groups?.map((g) => g.id) || [],
        show_results_immediately: homework.show_results_immediately,
      });
    }
  }, [homework, reset]);

  const onSubmit = async (formData) => {
    const toastId = toast.loading("Saqlanmoqda...");
    try {
      const method = isEdit ? "patch" : "post";
      const url = isEdit
        ? `homework-assignments/${homework.id}/`
        : "homework-assignments/";

      await authAxios[method](url, formData);

      toast.update(toastId, {
        render: intl.formatMessage({ id: "Vazifa muvaffaqiyatli saqlandi!" }),
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });
      closeModal("HOMEWORK_FORM", { refresh: true });
      mutate([`homework-assignments/`, router.locale, page, search]);
    } catch (err) {
      toast.dismiss(toastId);
      // handleApiError(err, setError);
    }
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <div className="bg-blue-100 p-4 rounded-3xl text-blue-600">
          <BookOpen size={32} />
        </div>
        <div>
          <h2 className="text-2xl font-black text-heading">
            {isEdit ? "Vazifani tahrirlash" : "Yangi vazifa"}
          </h2>
          <p className="text-muted text-sm font-medium">
            {intl.formatMessage({
              id: "O'quvchilar uchun topshiriqlarni shakllantiring",
            })}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Input
          label="Vazifa sarlavhasi"
          name="title"
          register={register}
          error={errors.title}
          placeholder="Week 3 Homework"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Deadline"
            name="deadline"
            type="datetime-local"
            register={register}
            error={errors.deadline}
          />

          <Controller
            name="assigned_group_ids"
            control={control}
            render={({ field }) => (
              <Select
                label="Guruhlar"
                isMulti
                options={groupOptions}
                {...field}
                placeholder="Guruhni tanlang"
              />
            )}
          />
        </div>

        {/* Resources Selection */}
        <div className="grid grid-cols-1 gap-6 p-6 bg-slate-50 rounded-[2rem] border border-slate-100">
          <Controller
            name="mock_test_ids"
            control={control}
            render={({ field }) => (
              <Select
                label={"Mock Testlar"}
                isMulti
                options={mockOptions}
                {...field}
                placeholder="Mock tanlang"
              />
            )}
          />

          <Controller
            name="quiz_ids"
            control={control}
            render={({ field }) => (
              <Select
                label={"Quizlar"}
                isMulti
                options={quizOptions}
                {...field}
                placeholder="Quiz tanlang"
              />
            )}
          />
        </div>

        <div className="flex items-center gap-3 px-2">
          <input
            type="checkbox"
            {...register("show_results_immediately")}
            id="show_res"
            className="w-5 h-5 accent-blue-600 rounded-md"
          />
          <label
            htmlFor="show_res"
            className="text-sm font-bold text-slate-700 cursor-pointer"
          >
            {intl.formatMessage({
              id: "Natijalarni o'quvchiga darhol ko'rsatish",
            })}
          </label>
        </div>

        <Input
          label="Tavsif (Optional)"
          name="description"
          register={register}
          placeholder="Topshiriq yuzasidan qo'shimcha ko'rsatmalar..."
        />

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-100">
          <button
            type="button"
            onClick={() => closeModal("HOMEWORK_FORM")}
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

export default HomeworkFormModal;
