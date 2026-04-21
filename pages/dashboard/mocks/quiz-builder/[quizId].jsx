import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import useSWR from "swr";
import { Edit2, Plus, Save, Trash2 } from "lucide-react";
import { useRouter } from "next/router";
import { useIntl } from "react-intl";
import { toast } from "react-toastify";

import Seo from "@/components/seo/seo";
import { withAuthGuard } from "@/components/guard";
import { Input, Select, Textarea } from "@/components/ui";
import { useModal } from "@/context/modal-context";
import fetcher from "@/utils/fetcher";
import { authAxios } from "@/utils/axios";
import { handleApiError } from "@/utils/handle-error";

function QuizBuilderPage() {
  const router = useRouter();
  const intl = useIntl();
  const { openModal } = useModal();

  const quizIdParam = router.query.quizId;
  const isNewQuiz = quizIdParam === "new";
  const activeQuizId = !isNewQuiz && typeof quizIdParam === "string" ? quizIdParam : null;

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    setError,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      title: "",
      description: "",
      default_question_duration: 20,
      is_active: true,
    },
  });

  const { data: quizDetail, mutate: mutateQuiz } = useSWR(
    activeQuizId ? [`quizzes/${activeQuizId}/`, router.locale] : null,
    (url, locale) => fetcher(url, { headers: { "Accept-Language": locale } }, {}, true)
  );

  const { data: questionsData, mutate: mutateQuestions, isLoading: questionsLoading } = useSWR(
    activeQuizId ? [`quiz-questions/?quiz=${activeQuizId}&page_size=200`, router.locale] : null,
    (url, locale) => fetcher(url, { headers: { "Accept-Language": locale } }, {}, true)
  );

  useEffect(() => {
    if (!quizDetail) return;
    reset({
      title: quizDetail.title || "",
      description: quizDetail.description || "",
      default_question_duration: quizDetail.default_question_duration || 20,
      is_active: Boolean(quizDetail.is_active),
    });
  }, [quizDetail, reset]);

  const questions = useMemo(() => {
    if (!questionsData) return [];
    if (Array.isArray(questionsData)) return questionsData;
    if (Array.isArray(questionsData.results)) return questionsData.results;
    return [];
  }, [questionsData]);

  const onSubmitQuiz = async (values) => {
    const toastId = toast.loading(intl.formatMessage({ id: "Saqlanmoqda..." }));

    try {
      const payload = {
        title: values.title,
        description: values.description,
        default_question_duration: Number(values.default_question_duration) || 20,
        is_active: Boolean(values.is_active),
      };

      if (activeQuizId) {
        await authAxios.patch(`quizzes/${activeQuizId}/`, payload);
        await mutateQuiz();
      } else {
        const res = await authAxios.post("quizzes/", payload);
        const newQuizId = res?.data?.id;
        if (newQuizId) {
          await router.replace(`/dashboard/mocks/quiz-builder/${newQuizId}`);
        }
      }

      toast.update(toastId, {
        render: intl.formatMessage({ id: "Muvaffaqiyatli saqlandi!" }),
        type: "success",
        isLoading: false,
        autoClose: 1800,
      });
    } catch (err) {
      handleApiError(err, setError);
      toast.update(toastId, {
        render: intl.formatMessage({ id: "Xatolik yuz berdi" }),
        type: "error",
        isLoading: false,
        autoClose: 2200,
      });
    } finally {
      toast.dismiss(toastId);
    }
  };

  const handleOpenAddQuestion = () => {
    if (!activeQuizId) {
      toast.info("Avval quiz ma'lumotlarini saqlang");
      return;
    }

    openModal(
      "QUIZ_QUESTION_FORM",
      {
        quizId: activeQuizId,
        nextOrder: (questions?.length || 0) + 1,
        onSaved: async () => {
          await mutateQuestions();
          await mutateQuiz();
        },
      },
      "video"
    );
  };

  const handleEditQuestion = (question) => {
    openModal(
      "QUIZ_QUESTION_FORM",
      {
        quizId: activeQuizId,
        question,
        nextOrder: question?.order || 1,
        onSaved: async () => {
          await mutateQuestions();
          await mutateQuiz();
        },
      },
      "video"
    );
  };

  const handleDeleteQuestion = async (questionId) => {
    const ok = window.confirm("Savolni o'chirmoqchimisiz?");
    if (!ok) return;

    try {
      await authAxios.delete(`quiz-questions/${questionId}/`);
      await mutateQuestions();
      toast.success("Savol o'chirildi");
    } catch (err) {
      handleApiError(err);
      toast.error("Savolni o'chirishda xatolik");
    }
  };

  return (
    <>
      <Seo
        title={intl.formatMessage({ id: "Quizlar" })}
        description={intl.formatMessage({ id: "quiz_desc" })}
        keywords={intl.formatMessage({ id: "mock_key" })}
      />

      <div className="space-y-6 pb-10">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div>
            <h1 className="text-2xl font-black text-heading">
              {isNewQuiz ? "Yangi Quiz Yaratish" : "Quiz Builder"}
            </h1>
            <p className="text-sm text-muted font-medium">
              Har bir savolni alohida modalda qo'shing. Bu ko'p rasm/audio bilan ishlashda ancha yengil.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => router.push("/dashboard/mocks/quiz")}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold"
            >
              Orqaga
            </button>
            <button
              type="button"
              onClick={handleOpenAddQuestion}
              className="px-4 py-2.5 rounded-xl bg-primary text-white font-black flex items-center gap-2"
            >
              <Plus size={16} /> Savol qo'shish
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmitQuiz)} className="p-6 rounded-3xl border border-slate-100 bg-white space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Quiz nomi"
              name="title"
              register={register}
              error={errors.title}
              placeholder="Quiz nomini kiriting"
            />
            <Input
              label="Standart vaqt (sekund)"
              name="default_question_duration"
              type="number"
              register={register}
              error={errors.default_question_duration}
              placeholder="20"
            />
          </div>

          <Textarea
            label="Tavsif"
            name="description"
            register={register}
            rows={3}
            error={errors.description}
            placeholder="Quiz haqida qisqa tavsif"
          />

          <div className="max-w-sm">
            <Select
              label="Holat"
              options={[
                { value: true, label: "Faol" },
                { value: false, label: "Noaktiv" },
              ]}
              value={watch("is_active")}
              onChange={(val) => setValue("is_active", val)}
              error={errors.is_active?.message}
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-heading hover:bg-primary text-white px-6 py-3 rounded-xl font-black flex items-center gap-2 disabled:opacity-50"
            >
              <Save size={16} />
              {isSubmitting ? "Saqlanmoqda..." : "Quizni saqlash"}
            </button>
          </div>
        </form>

        <div className="p-6 rounded-3xl border border-slate-100 bg-white">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-black text-heading">Savollar ({questions.length})</h2>
          </div>

          {!activeQuizId && (
            <p className="text-sm text-muted">Savol qo'shish uchun avval quizni saqlang.</p>
          )}

          {activeQuizId && questions.length === 0 && !questionsLoading && (
            <p className="text-sm text-muted">Hozircha savollar yo'q.</p>
          )}

          {activeQuizId && questions.length > 0 && (
            <div className="space-y-3">
              {questions.map((q) => (
                <div key={q.id} className="border border-slate-100 rounded-2xl p-4 flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="font-black text-heading truncate">#{q.order} {q.text}</h3>
                    <p className="text-xs text-slate-500 font-medium mt-1">
                      Ball: {q.points} | Variantlar: {Array.isArray(q.options) ? q.options.length : 0}
                    </p>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleEditQuestion(q)}
                      className="p-2 rounded-lg bg-slate-50 text-slate-600 hover:bg-blue-500 hover:text-white"
                    >
                      <Edit2 size={14} />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteQuestion(q.id)}
                      className="p-2 rounded-lg bg-slate-50 text-red-500 hover:bg-red-500 hover:text-white"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default withAuthGuard(QuizBuilderPage, ["CENTER_ADMIN", "TEACHER"]);
