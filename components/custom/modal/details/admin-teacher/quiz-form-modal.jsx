import React, { useEffect } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import {
  HelpCircle,
  Save,
  Plus,
  Trash2,
  CheckCircle2,
  Star,
  LayoutList,
  Clock,
  AlertCircle,
} from "lucide-react";
import { Input, Textarea, Select } from "@/components/ui";
import { useModal } from "@/context/modal-context";
import { useIntl } from "react-intl";
import { toast } from "react-toastify";
import { handleApiError } from "@/utils/handle-error";
import { authAxios } from "@/utils/axios";
import { mutate } from "swr";
import { useRouter } from "next/router";

// --- Alohida Komponent: Har bir savolning variantlarini boshqarish ---
const OptionsList = ({ qIndex, control, register, setValue, errors }) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: `questions.${qIndex}.options`,
  });

  const intl = useIntl();

  return (
    <div className="space-y-4 pt-6 border-t border-dashed border-slate-200 mt-4">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
          <Star size={14} className="text-orange-400" />{" "}
          {intl.formatMessage({ id: "Variantlar" })}
        </h4>
        <button
          type="button"
          onClick={() => append({ text: "", is_correct: false })}
          className="text-[10px] font-black text-primary flex items-center gap-1 bg-blue-50 px-3 py-1.5 rounded-lg hover:bg-blue-100 transition-all"
        >
          <Plus size={14} /> {intl.formatMessage({ id: "Variant qo'shish" })}
        </button>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {fields.map((field, optIndex) => (
          <div
            key={field.id}
            className="flex items-start gap-3 group animate-in fade-in slide-in-from-left-2"
          >
            <div className="pt-2">
              <Controller
                name={`questions.${qIndex}.options.${optIndex}.is_correct`}
                control={control}
                render={({ field: { value } }) => (
                  <button
                    type="button"
                    onClick={() => {
                      // Faqat bitta to'g'ri javobni tanlash mantiqi
                      fields.forEach((_, i) =>
                        setValue(
                          `questions.${qIndex}.options.${i}.is_correct`,
                          i === optIndex,
                        ),
                      );
                    }}
                    className={`p-2 rounded-xl transition-all ${value
                      ? "bg-green-100 text-green-600 shadow-sm"
                      : "bg-slate-100 text-slate-300 hover:bg-slate-200"
                      }`}
                  >
                    <CheckCircle2 size={20} strokeWidth={3} />
                  </button>
                )}
              />
            </div>

            <div className="flex-1">
              <Input
                name={`questions.${qIndex}.options.${optIndex}.text`}
                register={register}
                error={errors?.questions?.[qIndex]?.options?.[optIndex]?.text}
                placeholder={`Variant ${optIndex + 1}`}
              />
            </div>

            {fields.length > 2 && (
              <button
                type="button"
                onClick={() => remove(optIndex)}
                className="pt-3 text-slate-300 hover:text-red-500 transition-colors"
              >
                <Trash2 size={18} />
              </button>
            )}
          </div>
        ))}
      </div>
      {errors?.questions?.[qIndex]?.options?.root && (
        <p className="text-red-500 text-[10px] font-bold flex items-center gap-1">
          <AlertCircle size={12} /> {intl.formatMessage({ id: "Kamida bitta to'g'ri javobni belgilang" })}
        </p>
      )}
    </div>
  );
};

// --- Asosiy Komponent: Quiz Form ---
const QuizFormModal = ({ quiz = null }) => {
  const { closeModal } = useModal();
  const isEdit = !!quiz;
  const router = useRouter();
  const intl = useIntl();

  const {
    register,
    handleSubmit,
    control,
    setValue,
    setError,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      title: "",
      description: "",
      is_active: true,
      default_question_duration: 20,
      questions: [
        {
          text: "",
          question_type: "QUIZ",
          duration: 10,
          points: 1,
          options: [
            { text: "", is_correct: false },
            { text: "", is_correct: false },
            { text: "", is_correct: false },
            { text: "", is_correct: false },
          ],
        },
      ],
    },
  });

  const {
    fields: qFields,
    append: appendQ,
    remove: removeQ,
  } = useFieldArray({
    control,
    name: "questions",
  });

  useEffect(() => {
    if (quiz) {
      const formattedQuiz = {
        ...quiz,
        questions: quiz.questions?.map((q) => ({
          ...q,
          options:
            typeof q.options === "string" ? JSON.parse(q.options) : q.options,
        })),
      };
      reset(formattedQuiz);
    }
  }, [quiz, reset]);

  const onSubmit = async (values) => {
    const toastId = toast.loading(intl.formatMessage({ id: "Saqlanmoqda..." }));

    try {
      let quizId = quiz?.id;
      const method = isEdit ? "patch" : "post";
      const quizUrl = isEdit ? `/quizzes/${quizId}/` : `/quizzes/`;

      // 1. Avval Quizni o'zini yaratamiz yoki yangilaymiz
      const quizPayload = {
        title: values.title,
        description: values.description,
        is_active: values.is_active,
        default_question_duration: values.default_question_duration,
      };

      const quizResponse = await authAxios[method](quizUrl, quizPayload);

      // Agar yangi yaratilgan bo'lsa, ID ni olamiz
      if (!isEdit) {
        quizId = quizResponse.data.id;
      }

      // 2. Savollarni tayyorlaymiz
      const questionsRequests = values.questions.map((q, index) => {
        const questionPayload = {
          quiz: quizId,
          text: q.text,
          question_type: q.question_type,
          duration: q.duration,
          points: q.points,
          order: index + 1,
          options: q.options,
        };

        if (q.id) {
          return authAxios.patch(`/quiz-questions/${q.id}/`, questionPayload);
        } else {
          return authAxios.post(`/quiz-questions/`, questionPayload);
        }
      });

      await Promise.all(questionsRequests);

      toast.update(toastId, {
        render: intl.formatMessage({ id: "Muvaffaqiyatli saqlandi!" }),
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });

      closeModal("QUIZ_FORM", { refresh: true });
      mutate([`quizzes/`, router.locale]);
    } catch (err) {
      toast.dismiss(toastId);
      handleApiError(err, setError);
      console.error("Quiz saqlashda xatolik:", err);
    }
  };

  return (
    <div className="p-8 max-h-[92vh] overflow-y-auto custom-scrollbar">
      {/* Header */}
      <div className="flex items-center gap-5 mb-10">
        <div className="bg-orange-100 p-5 rounded-[2rem] text-primary shadow-sm">
          <HelpCircle size={36} strokeWidth={2.5} />
        </div>
        <div>
          <h2 className="text-3xl font-black text-heading tracking-tight">
            {intl.formatMessage({ id: isEdit ? "Quizni tahrirlash" : "Yangi Quiz" })}
          </h2>
          <p className="text-muted text-sm font-semibold italic opacity-70">
            {intl.formatMessage({
              id: "Savollar va variantlarni bir joyda boshqaring",
            })}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
        {/* Quiz Global Settings */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-8 bg-slate-50/50 rounded-[3rem] border border-slate-100 shadow-inner">
          <div className="md:col-span-2">
            <Input
              label="Quiz nomi"
              name="title"
              register={register}
              error={errors.title}
              placeholder="N5 Kanji Practice"
            />
          </div>
          <Input
            label="Standart vaqt (minut)"
            name="default_question_duration"
            type="number"
            register={register}
            icon={<Clock size={16} />}
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
              />
            )}
          />
        </div>

        {/* Questions Section */}
        <div className="space-y-8">
          <div className="flex items-center justify-between border-b border-slate-100 pb-5 px-2">
            <h3 className="text-xl font-black text-heading flex items-center gap-3">
              <LayoutList size={26} className="text-primary" />{" "}
              {intl.formatMessage({ id: "Savollar ro'yxati" })}
            </h3>
            <button
              type="button"
              onClick={() =>
                appendQ({
                  text: "",
                  question_type: "QUIZ",
                  duration: 10,
                  points: 1,
                  options: [
                    { text: "", is_correct: false },
                    { text: "", is_correct: false },
                    { text: "", is_correct: false },
                    { text: "", is_correct: false },
                  ],
                })
              }
              className="bg-primary text-white px-6 py-3 rounded-2xl text-xs font-black flex items-center gap-2 shadow-xl shadow-orange-200 active:scale-95 transition-all"
            >
              <Plus size={20} strokeWidth={3} />{" "}
              {intl.formatMessage({ id: "Savol qo'shish" })}
            </button>
          </div>

          {qFields.map((qField, qIndex) => (
            <div
              key={qField.id}
              className="relative p-8 border-2 border-slate-100 rounded-[3rem] bg-white hover:border-orange-200 transition-all duration-300 group shadow-sm hover:shadow-xl hover:shadow-slate-100"
            >
              {/* Delete Question Button */}
              <button
                type="button"
                onClick={() => removeQ(qIndex)}
                className="absolute -top-4 -right-4 bg-white shadow-lg text-red-500 p-3 rounded-full hover:bg-red-50 border border-slate-50 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 size={20} />
              </button>

              <div className="space-y-6">
                <div className="flex items-center gap-2 mb-2">
                  <span className="bg-slate-900 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">
                    {intl.formatMessage({ id: "Savol" })} #{qIndex + 1}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  <Controller
                    name={`questions.${qIndex}.question_type`}
                    control={control}
                    render={({ field }) => (
                      <Select
                        label="Savol turi"
                        options={[{ value: "QUIZ", label: "QUIZ" }]}
                        {...field}
                      />
                    )}
                  />
                  <Input
                    label="Vaqt (soniya)"
                    name={`questions.${qIndex}.duration`}
                    type="number"
                    register={register}
                  />
                  <Input
                    label="Ball"
                    name={`questions.${qIndex}.points`}
                    type="number"
                    register={register}
                  />
                </div>

                <Textarea
                  label="Savol matni"
                  name={`questions.${qIndex}.text`}
                  register={register}
                  placeholder={intl.formatMessage({ id: "Savol matnini bu yerga yozing..." })}
                  rows={3}
                />

                {/* Dinamik Variantlar Ro'yxati */}
                <OptionsList
                  qIndex={qIndex}
                  control={control}
                  register={register}
                  setValue={setValue}
                  errors={errors}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Form Actions */}
        <div className="flex justify-end gap-4 pt-10 border-t border-slate-100">
          <button
            type="button"
            onClick={() => closeModal("QUIZ_FORM")}
            className="px-10 py-4 rounded-2xl font-bold text-muted hover:bg-slate-50 transition-all"
          >
            {intl.formatMessage({ id: "Bekor qilish" })}
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-primary text-white font-black px-14 py-4 rounded-2xl shadow-[0_20px_40px_-10px_rgba(255,107,0,0.3)] active:scale-95 disabled:opacity-50 flex items-center gap-3 transition-all"
          >
            <Save size={22} /> {intl.formatMessage({ id: isSubmitting ? "Saqlanmoqda..." : "Saqlash" })}
          </button>
        </div>
      </form>
    </div>
  );
};

export default QuizFormModal;
