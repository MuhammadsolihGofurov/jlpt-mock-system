import { useForm, useFieldArray, Controller } from "react-hook-form";
import {
  HelpCircle,
  Save,
  Plus,
  Trash2,
  CheckCircle2,
  ImageIcon, // Rasm ikonkasi
  Star,
} from "lucide-react";
import { Input, RichTextarea } from "@/components/ui";
import { useModal } from "@/context/modal-context";
import { useIntl } from "react-intl";
import { toast } from "react-toastify";
import { handleApiError } from "@/utils/handle-error";
import { authAxios } from "@/utils/axios";
import { mutate } from "swr";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const QuestionFormModal = ({ sectionType, sectionId = 0, groupId, question = null, question_count = 0, groupName }) => {
  const { closeModal } = useModal();
  const isEdit = !!question;
  const router = useRouter();
  const intl = useIntl();
  const [preview, setPreview] = useState(null); // Rasm preview uchun

  const {
    register,
    handleSubmit,
    control,
    setValue,
    setError,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      text: "",
      question_number: question_count + 1,
      score: 1,
      image: null, // Rasm maydoni
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

  // Tahrirlash rejimida ma'lumotlarni yuklash
  useEffect(() => {
    if (question) {
      reset(question);
      if (question.image) setPreview(question.image); // Agar rasm bo'lsa previewga qo'yish
    }
  }, [question, reset]);

  const onSubmit = async (values) => {
    const toastId = toast.loading(intl.formatMessage({ id: "Saqlanmoqda..." }));

    try {
      const hasCorrect = values.options.some(opt => opt.is_correct);
      if (!hasCorrect) {
        toast.error(intl.formatMessage({ id: "Kamida bitta to'g'ri javobni belgilang!" }));
        toast.dismiss(toastId);
        return;
      }

      const formData = new FormData();
      formData.append("group", groupId);
      formData.append("text", values.text);
      formData.append("order", values.question_number);
      formData.append("question_number", values.question_number);
      formData.append("score", values.score);
      formData.append("options", JSON.stringify(values.options));

      // --- RASMNI FORMDATA'GA QO'SHISH ---
      if (values.image && values.image[0] instanceof File) {
        formData.append("image", values.image[0]);
      }

      const method = isEdit ? "patch" : "post";
      const url = isEdit ? `/questions/${question.id}/` : `/questions/`;

      await authAxios({
        method,
        url,
        data: formData,
        headers: { "Content-Type": "multipart/form-data" }, // Fayl uchun muhim
      });

      toast.update(toastId, {
        render: intl.formatMessage({ id: "Muvaffaqiyatli saqlandi!" }),
        type: "success",
        isLoading: false,
        autoClose: 2000,
      });

      mutate([`question-groups/`, router.locale, sectionId]);
      mutate([`questions/`, router.locale, groupId]);

      setTimeout(() => {
        closeModal("QUESTION_FORM");
      }, 500);

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
            {intl.formatMessage({ id: "Guruh" })}: {groupName}
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

        {/* --- RASM YUKLASH QISMI --- */}
        <div className="space-y-2">
          <label className="text-sm font-black text-heading ml-1 flex items-center gap-2">
            <ImageIcon size={16} /> Rasm (Optional)
          </label>

          {preview && (
            <div className="mb-2 relative w-40 h-24 overflow-hidden rounded-xl border border-slate-200">
              <img src={preview} alt="Preview" className="w-full h-full object-cover" />
            </div>
          )}

          <input
            type="file"
            accept="image/*"
            {...register("image", {
              onChange: (e) => {
                const file = e.target.files[0];
                if (file) setPreview(URL.createObjectURL(file));
              }
            })}
            className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-bold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100"
          />
        </div>

        {/* Variantlar */}
        <div className="space-y-4 pt-4 border-t">
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
            <Save size={18} /> {intl.formatMessage({ id: isSubmitting ? "Saqlanmoqda..." : "Saqlash" })}
          </button>
        </div>
      </form>
    </div>
  );
};

export default QuestionFormModal;