import { useForm, useFieldArray, Controller } from "react-hook-form";
import {
  HelpCircle,
  Save,
  Plus,
  Trash2,
  CheckCircle2,
  ImageIcon,
  Star,
  X, // Rasm o'chirish uchun
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
import { uploadMedia } from "@/utils/uploadMedia";

const QuestionFormModal = ({ sectionType, sectionId = 0, groupId, question = null, question_count = 0, groupName, currentMockType }) => {
  const { closeModal } = useModal();
  const isEdit = !!question;
  const router = useRouter();
  const intl = useIntl();
  const [preview, setPreview] = useState(null);

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
    if (question) {
      reset(question);
      if (question.image) setPreview(question.image);
    }
  }, [question, reset]);

  const handlePaste = (e) => {
    const items = e.clipboardData?.items;
    if (!items) return;
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf("image") !== -1) {
        const file = items[i].getAsFile();
        if (file) {
          const dataTransfer = new DataTransfer();
          dataTransfer.items.add(file);
          setValue("image", dataTransfer.files);
          setPreview(URL.createObjectURL(file));
          toast.info(intl.formatMessage({ id: "Rasm yuklandi (Clipboard)" }), { autoClose: 1000 });
        }
      }
    }
  };

  useEffect(() => {
    window.addEventListener("paste", handlePaste);
    return () => window.removeEventListener("paste", handlePaste);
  }, [setValue, preview]);

  const onSubmit = async (values) => {
    const toastId = toast.loading(intl.formatMessage({ id: "Saqlanmoqda..." }));
    try {
      const hasCorrect = values.options.some((opt) => opt.is_correct);
      if (!hasCorrect) {
        toast.error(intl.formatMessage({ id: "Kamida bitta to'g'ri javobni belgilang!" }));
        toast.dismiss(toastId);
        return;
      }

      // 1. Savol rasmi upload
      let image_key = undefined;
      const imageFile = values.image instanceof FileList ? values.image[0] : values.image;
      if (imageFile instanceof File) {
        image_key = await uploadMedia(imageFile, "jlpt_question");
      }

      // 2. Options rasmlari upload
      const processedOptions = await Promise.all(
        values.options.map(async (opt) => {
          const optImageFile = opt.image instanceof FileList ? opt.image[0] : opt.image;
          if (optImageFile instanceof File) {
            const optKey = await uploadMedia(optImageFile, "jlpt_question");
            return { text: opt.text || "", is_correct: opt.is_correct, image: optKey };
          }
          return {
            text: opt.text || "",
            is_correct: opt.is_correct,
            image: typeof opt.image === "string" ? opt.image : null,
          };
        })
      );

      // 3. JSON payload yuborish
      const payload = {
        section: sectionId,
        [currentMockType?.question_group_type]: groupId,
        text: values.text,
        order: values.question_number,
        question_number: values.question_number,
        score: values.score,
        options: processedOptions,
      };
      if (image_key !== undefined) payload.image_key = image_key;

      const method = isEdit ? "patch" : "post";
      const url = isEdit
        ? `${currentMockType?.question}${question.id}/`
        : `${currentMockType?.question}`;

      await authAxios[method](url, payload);

      toast.update(toastId, {
        render: intl.formatMessage({ id: "Muvaffaqiyatli saqlandi!" }),
        type: "success",
        isLoading: false,
        autoClose: 2000,
      });

      mutate([currentMockType?.question_group, router.locale, sectionId]);
      mutate([currentMockType?.question, router.locale, groupId]);
      setTimeout(() => closeModal("QUESTION_FORM"), 500);
    } catch (err) {
      handleApiError(err, setError);
      toast.update(toastId, {
        render: err,
        type: "error",
        isLoading: false,
        autoClose: 2000,
      });
    } finally {
      toast.dismiss(toastId);
    }
  };

  return (
    <div className="p-8">
      {/* Header section... (Oldingidek qoladi) */}
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
          <Input label="Savol raqami" name="question_number" type="number" register={register} error={errors.question_number} />
          <div className="md:col-span-2">
            <Input label="Ball" name="score" type="number" register={register} error={errors.score} />
          </div>
        </div>

        <Controller
          name="text"
          control={control}
          render={({ field: { value, onChange }, fieldState: { error } }) => (
            <RichTextarea label="Savol matni (Rich Text)" value={value} onChange={onChange} error={error} placeholder="Savol matnini bu yerga yozing..." />
          )}
        />

        {/* Savol rasmi qismi */}
        <div className="space-y-2">
          <label className="text-sm font-black text-heading ml-1 flex items-center gap-2">
            <ImageIcon size={16} /> {intl.formatMessage({ id: "Rasm (Optional)" })}
          </label>
          {preview && (
            <div className="mb-2 relative w-40 h-24 overflow-hidden rounded-xl border border-slate-200">
              <img src={preview} alt="Preview" className="w-full h-full object-cover" />
              <button type="button" onClick={() => { setPreview(null); setValue("image", null); }} className="absolute top-1 right-1 bg-white/80 p-1 rounded-full shadow-sm text-red-500 hover:bg-white">
                <X size={14} />
              </button>
            </div>
          )}
          <input type="file" accept="image/*" {...register("image", { onChange: (e) => { const file = e.target.files[0]; if (file) setPreview(URL.createObjectURL(file)); } })} className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-bold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100" />
        </div>

        {/* Variantlar qismi */}
        <div className="space-y-4 pt-4 border-t">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-black text-heading flex items-center gap-2">
              <Star size={20} className="text-orange-400" /> {intl.formatMessage({ id: "Variantlar" })}
            </h3>
            <button type="button" onClick={() => append({ text: "", is_correct: false, image: null })} className="text-xs font-bold text-primary flex items-center gap-1">
              <Plus size={16} /> {intl.formatMessage({ id: "Qo'shish" })}
            </button>
          </div>

          <div className="space-y-3">
            {fields.map((field, index) => (
              <div key={field.id} className="flex flex-col gap-2 p-3 rounded-2xl border border-slate-50 bg-slate-50/30 group">
                <div className="flex items-center gap-3">
                  <div className="pt-2">
                    <Controller
                      name={`options.${index}.is_correct`}
                      control={control}
                      render={({ field: { value } }) => (
                        <button
                          type="button"
                          onClick={() => {
                            fields.forEach((_, i) => setValue(`options.${i}.is_correct`, i === index));
                          }}
                          className={`p-2 rounded-xl transition-all ${value ? "bg-green-100 text-green-600" : "bg-slate-200 text-slate-400"}`}
                        >
                          <CheckCircle2 size={18} strokeWidth={3} />
                        </button>
                      )}
                    />
                  </div>

                  <div className="flex-1">
                    <Input name={`options.${index}.text`} register={register} error={errors.options?.[index]?.text} placeholder={`Variant ${index + 1}`} />
                  </div>

                  {/* VARIANT RASM UPLOAD QISMI */}
                  <div className="relative">
                    <label className={`flex items-center justify-center w-11 h-11 rounded-xl cursor-pointer transition-all border-2 border-dashed ${watchedOptions[index]?.image ? 'bg-blue-50 border-blue-200 text-blue-500' : 'bg-white border-slate-200 text-slate-400 hover:border-primary/50'}`}>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        {...register(`options.${index}.image`)}
                      />
                      <ImageIcon size={20} />
                      {watchedOptions[index]?.image?.length > 0 && (
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full border-2 border-white" />
                      )}
                    </label>
                  </div>

                  {fields.length > 1 && (
                    <button type="button" onClick={() => remove(index)} className="text-slate-300 hover:text-red-500">
                      <Trash2 size={20} />
                    </button>
                  )}
                </div>

                {/* Variant rasm preview */}
                {watchedOptions[index]?.image && (watchedOptions[index].image[0] || typeof watchedOptions[index].image === 'string') && (
                  <div className="ml-12 relative w-20 h-14 rounded-lg overflow-hidden border border-slate-200">
                    <img
                      src={watchedOptions[index].image[0] instanceof File ? URL.createObjectURL(watchedOptions[index].image[0]) : watchedOptions[index].image}
                      className="w-full h-full object-cover"
                      alt=""
                    />
                    <button
                      type="button"
                      onClick={() => setValue(`options.${index}.image`, null)}
                      className="absolute top-0 right-0 bg-red-500 text-white p-0.5 rounded-bl-lg"
                    >
                      <X size={10} />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Buttons section... (Oldingidek qoladi) */}
        <div className="flex justify-end gap-3 pt-6 border-t">
          <button type="button" onClick={() => closeModal("QUESTION_FORM")} className="px-6 py-3 rounded-2xl font-bold text-muted">
            {intl.formatMessage({ id: "Bekor qilish" })}
          </button>
          <button type="submit" disabled={isSubmitting} className="bg-primary text-white font-black px-10 py-3 rounded-2xl shadow-lg active:scale-95 disabled:opacity-50 flex items-center gap-2">
            <Save size={18} /> {intl.formatMessage({ id: isSubmitting ? "Saqlanmoqda..." : "Saqlash" })}
          </button>
        </div>
      </form>
    </div>
  );
};

export default QuestionFormModal;