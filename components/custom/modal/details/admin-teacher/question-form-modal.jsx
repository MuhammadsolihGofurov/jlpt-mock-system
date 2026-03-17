import { useForm, useFieldArray, Controller } from "react-hook-form";
import {
  HelpCircle,
  Save,
  Plus,
  Trash2,
  CheckCircle2,
  Music,
  ImageIcon,
  Star,
} from "lucide-react";
import { Input, RichTextarea, Textarea } from "@/components/ui";
import { useModal } from "@/context/modal-context";
import { useIntl } from "react-intl";
import { toast } from "react-toastify";
import { handleApiError } from "@/utils/handle-error";
import { authAxios } from "@/utils/axios";
import { mutate } from "swr";
import { useRouter } from "next/router";
import { useEffect } from "react";

const QuestionFormModal = ({ sectionType, sectionId = 0, groupId, question = null, question_count = 0 }) => {
  const { closeModal } = useModal();
  const isEdit = !!question;
  const router = useRouter();
  const intl = useIntl();

  const {
    register,
    handleSubmit,
    control,
    setValue, // Xatolikni tuzatish uchun kerak
    setError,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      text: "",
      question_number: question_count + 1,
      score: 1,
      options: [
        { text: "", is_correct: false },
        { text: "", is_correct: false },
        { text: "", is_correct: false },
        { text: "", is_correct: false },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "options",
  });

  useEffect(() => {
    if (question) {
      reset(question);
    }
  }, [question, reset]);

  const onSubmit = async (values) => {
    const toastId = toast.loading(intl.formatMessage({ id: "Saqlanmoqda..." }));

    try {
      const formData = new FormData();
      formData.append("group", groupId);
      formData.append("text", values.text);
      formData.append("question_number", values.question_number);
      formData.append("order", values.question_number);
      formData.append("score", values.score);
      formData.append("options", JSON.stringify(values.options));

      // if (values.image?.[0]) formData.append("image", values.image[0]);
      // if (sectionType === "LISTENING" && values.audio_file?.[0]) {
      //   formData.append("audio_file", values.audio_file[0]);
      // }

      const method = isEdit ? "patch" : "post";
      const url = isEdit ? `/questions/${question.id}/` : `/questions/`;

      await authAxios[method](url, formData);

      toast.update(toastId, {
        render: intl.formatMessage({ id: "Muvaffaqiyatli saqlandi!" }),
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });

      mutate([`question-groups/`, router.locale, sectionId]);
      mutate([`questions/`, router.locale, groupId]);
      closeModal("QUESTION_FORM", { refresh: true });
    } catch (err) {
      toast.dismiss(toastId);
      handleApiError(err, setError);
    }
  };

  return (
    <div className="p-8">
      <div className="flex items-center gap-4 mb-8">
        <div className="bg-blue-100 p-4 rounded-3xl text-blue-600">
          <HelpCircle size={32} />
        </div>
        <div>
          <h2 className="text-2xl font-black text-heading">
            {isEdit ? "Savolni tahrirlash" : "Yangi savol"}
          </h2>
          <p className="text-muted text-sm font-medium italic">
            Guruh: {groupId}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <Input
            label="Savol raqami"
            name="question_number"
            type="number"
            register={register}
            error={errors.question_number}
          />
          <div className="md:col-span-2">
            <Input
              label="Ball"
              name="score"
              type="number"
              register={register}
              error={errors.score}
            />
          </div>
        </div>

        <Controller
          name="text"
          control={control}
          rules={{ required: "Savol matni majburiy" }}
          render={({ field: { value, onChange }, fieldState: { error } }) => (
            <RichTextarea
              label="Savol matni (Rich Text)"
              value={value}
              onChange={onChange}
              error={error}
              placeholder="Savol matnini bu yerga yozing..."
            />
          )}
        />

        {/* Variantlar */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-black text-heading flex items-center gap-2">
              <Star size={20} className="text-orange-400" />{" "}
              {intl.formatMessage({ id: "Variantlar" })}
            </h3>
            <button
              type="button"
              onClick={() => append({ text: "", is_correct: false })}
              className="text-xs font-bold text-primary flex items-center gap-1"
            >
              <Plus size={16} /> {intl.formatMessage({ id: "Qo'shish" })}
            </button>
          </div>

          <div className="space-y-3">
            {fields.map((field, index) => (
              <div key={field.id} className="flex items-start gap-3 group">
                <div className="pt-3">
                  <Controller
                    name={`options.${index}.is_correct`}
                    control={control}
                    render={({ field: { value } }) => (
                      <button
                        type="button"
                        onClick={() => {
                          fields.forEach((_, i) =>
                            setValue(`options.${i}.is_correct`, i === index),
                          );
                        }}
                        className={`p-2 rounded-xl transition-all ${value
                          ? "bg-green-100 text-green-600"
                          : "bg-slate-100 text-slate-400"
                          }`}
                      >
                        <CheckCircle2 size={20} strokeWidth={3} />
                      </button>
                    )}
                  />
                </div>

                <div className="flex-1">
                  <Input
                    name={`options.${index}.text`}
                    register={register}
                    error={errors.options?.[index]?.text}
                    placeholder={`Variant ${index + 1}`}
                  />
                </div>

                {fields.length > 1 && (
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="pt-4 text-slate-300 hover:text-red-500"
                  >
                    <Trash2 size={20} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-6 border-t">
          <button
            type="button"
            onClick={() => closeModal("QUESTION_FORM")}
            className="px-6 py-3 rounded-2xl font-bold text-muted"
          >
            {intl.formatMessage({ id: "Bekor qilish" })}
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-primary text-white font-black px-10 py-3 rounded-2xl shadow-lg active:scale-95 disabled:opacity-50 flex items-center gap-2"
          >
            <Save size={18} /> {isSubmitting ? "Saqlanmoqda..." : "Saqlash"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default QuestionFormModal;
