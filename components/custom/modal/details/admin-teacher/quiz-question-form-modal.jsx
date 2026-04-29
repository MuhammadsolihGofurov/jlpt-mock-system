import { useEffect } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { CheckCircle2, ImageIcon, Plus, Save, Trash2, X } from "lucide-react";
import { toast } from "react-toastify";
import { useIntl } from "react-intl";

import { Input, Select, Textarea } from "@/components/ui";
import { useModal } from "@/context/modal-context";
import { authAxios } from "@/utils/axios";
import { handleApiError } from "@/utils/handle-error";
import { normalizeMediaReference, uploadMedia } from "@/utils/uploadMedia";

const QuizQuestionFormModal = ({ quizId, question = null, nextOrder = 1, onSaved }) => {
  const intl = useIntl();
  const { closeModal } = useModal();
  const isEdit = Boolean(question?.id);

  const {
    register,
    control,
    handleSubmit,
    setValue,
    setError,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      text: "",
      question_type: "QUIZ",
      points: 1,
      order: nextOrder,
      image: null,
      options: [
        { text: "", is_correct: false, image: null },
        { text: "", is_correct: false, image: null },
        { text: "", is_correct: false, image: null },
        { text: "", is_correct: false, image: null },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "options",
  });

  const watchedOptions = watch("options");

  useEffect(() => {
    if (!question) {
      reset({
        text: "",
        question_type: "QUIZ",
        points: 1,
        order: nextOrder,
        image: null,
        options: [
          { text: "", is_correct: false, image: null },
          { text: "", is_correct: false, image: null },
          { text: "", is_correct: false, image: null },
          { text: "", is_correct: false, image: null },
        ],
      });
      return;
    }

    const incomingOptions = Array.isArray(question.options) ? question.options : [];
    reset({
      text: question.text || "",
      question_type: question.question_type || "QUIZ",
      points: question.points || 1,
      order: question.order || nextOrder,
      image: question.image || null,
      options:
        incomingOptions.length > 0
          ? incomingOptions.map((opt) => ({
              text: opt?.text || "",
              is_correct: Boolean(opt?.is_correct),
              image: opt?.image || null,
            }))
          : [
              { text: "", is_correct: false, image: null },
              { text: "", is_correct: false, image: null },
              { text: "", is_correct: false, image: null },
              { text: "", is_correct: false, image: null },
            ],
    });
  }, [question, nextOrder, reset]);

  const onSubmit = async (values) => {
    const toastId = toast.loading(intl.formatMessage({ id: "Saqlanmoqda..." }));

    try {
      const hasCorrect = values.options.some((opt) => opt.is_correct);
      if (!hasCorrect) {
        toast.error(intl.formatMessage({ id: "Kamida bitta to'g'ri javobni belgilang!" }));
        toast.dismiss(toastId);
        return;
      }

      let image_key = undefined;
      const imageFile = values.image instanceof FileList ? values.image[0] : values.image;
      if (imageFile instanceof File) {
        image_key = await uploadMedia(imageFile, "quiz_question");
      }

      const processedOptions = await Promise.all(
        values.options.map(async (opt) => {
          const optionImageFile = opt.image instanceof FileList ? opt.image[0] : opt.image;
          if (optionImageFile instanceof File) {
            const optionImageKey = await uploadMedia(optionImageFile, "quiz_question");
            return {
              text: opt.text || "",
              is_correct: Boolean(opt.is_correct),
              image: optionImageKey,
            };
          }

          return {
            text: opt.text || "",
            is_correct: Boolean(opt.is_correct),
            image: typeof opt.image === "string" ? normalizeMediaReference(opt.image) : null,
          };
        })
      );

      const payload = {
        quiz: quizId,
        text: values.text,
        question_type: values.question_type,
        points: values.points,
        order: values.order,
        options: processedOptions,
      };
      if (image_key !== undefined) payload.image_key = image_key;

      if (isEdit) {
        await authAxios.patch(`quiz-questions/${question.id}/`, payload);
      } else {
        await authAxios.post("quiz-questions/", payload);
      }

      toast.update(toastId, {
        render: intl.formatMessage({ id: "Muvaffaqiyatli saqlandi!" }),
        type: "success",
        isLoading: false,
        autoClose: 2000,
      });

      if (typeof onSaved === "function") {
        await onSaved();
      }
      closeModal("QUIZ_QUESTION_FORM");
    } catch (err) {
      handleApiError(err, setError);
      toast.update(toastId, {
        render: intl.formatMessage({ id: "Xatolik yuz berdi" }),
        type: "error",
        isLoading: false,
        autoClose: 2500,
      });
    } finally {
      toast.dismiss(toastId);
    }
  };

  return (
    <div className="p-8 max-h-[90vh] overflow-y-auto custom-scrollbar">
      <h2 className="mb-6 text-2xl font-black text-heading">
        {isEdit ? intl.formatMessage({ id: "Savolni tahrirlash" }) : intl.formatMessage({ id: "Savol qo'shish" })}
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <Input
            label="Tartib"
            name="order"
            type="number"
            register={register}
            error={errors.order}
          />
          <Input
            label="Ball"
            name="points"
            type="number"
            register={register}
            error={errors.points}
          />
          <Select
            label="Savol turi"
            options={[{ value: "QUIZ", label: "QUIZ" }]}
            value={watch("question_type")}
            onChange={(val) => setValue("question_type", val)}
            error={errors.question_type?.message}
          />
        </div>

        <Textarea
          label="Savol matni"
          name="text"
          register={register}
          rows={3}
          error={errors.text}
          placeholder="Savol matnini kiriting..."
        />

        <div className="space-y-2">
          <label className="text-sm font-bold text-heading">Savol rasmi (ixtiyoriy)</label>
          <input
            type="file"
            accept="image/*"
            {...register("image")}
            className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-bold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100"
          />
          {typeof watch("image") === "string" && (
            <img src={watch("image")} alt="question" className="object-cover h-20 border rounded-lg w-28" />
          )}
        </div>

        <div className="pt-4 space-y-3 border-t border-slate-100">
          <div className="flex items-center justify-between">
            <h3 className="font-black text-heading">Variantlar</h3>
            <button
              type="button"
              onClick={() => append({ text: "", is_correct: false, image: null })}
              className="flex items-center gap-1 text-xs font-bold text-primary"
            >
              <Plus size={14} /> Qo'shish
            </button>
          </div>

          {fields.map((field, index) => {
            const imageValue = watchedOptions?.[index]?.image;
            const hasImage = Boolean(imageValue && (typeof imageValue === "string" || imageValue?.[0]));

            return (
              <div key={field.id} className="p-3 space-y-2 border rounded-xl border-slate-100">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      fields.forEach((_, i) => setValue(`options.${i}.is_correct`, i === index));
                    }}
                    className={`p-2 rounded-lg ${watch(`options.${index}.is_correct`) ? "bg-green-100 text-green-600" : "bg-slate-100 text-slate-400"}`}
                  >
                    <CheckCircle2 size={16} />
                  </button>

                  <div className="flex-1">
                    <Input
                      name={`options.${index}.text`}
                      register={register}
                      error={errors.options?.[index]?.text}
                      placeholder={`Variant ${index + 1}`}
                    />
                  </div>

                  <label className="flex items-center justify-center w-10 h-10 border border-dashed rounded-lg cursor-pointer border-slate-300">
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      {...register(`options.${index}.image`)}
                    />
                    <ImageIcon size={16} className={hasImage ? "text-blue-500" : "text-slate-400"} />
                  </label>

                  {fields.length > 2 && (
                    <button
                      type="button"
                      onClick={() => remove(index)}
                      className="text-slate-400 hover:text-red-500"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>

                {hasImage && (
                  <div className="relative w-20 ml-12 overflow-hidden border rounded-lg h-14 border-slate-200">
                    <img
                      src={
                        imageValue?.[0] instanceof File
                          ? URL.createObjectURL(imageValue[0])
                          : imageValue
                      }
                      alt="option"
                      className="object-cover w-full h-full"
                    />
                    <button
                      type="button"
                      onClick={() => setValue(`options.${index}.image`, null)}
                      className="absolute top-0 right-0 bg-red-500 text-white p-0.5 rounded-bl"
                    >
                      <X size={10} />
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={() => closeModal("QUIZ_QUESTION_FORM")}
            className="px-5 py-2.5 rounded-xl font-bold text-muted"
          >
            Bekor qilish
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-primary text-white px-6 py-2.5 rounded-xl font-black flex items-center gap-2 disabled:opacity-50"
          >
            <Save size={16} /> {intl.formatMessage({ id: isSubmitting ? "Saqlanmoqda..." : "Saqlash" })}
          </button>
        </div>
      </form>
    </div>
  );
};

export default QuizQuestionFormModal;
