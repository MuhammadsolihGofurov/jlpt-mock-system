import { useForm, Controller } from "react-hook-form";
import {
  Layers,
  Save,
  Type,
  AlignLeft,
  Hash,
  Music,
  ImageIcon,
  FileText,
} from "lucide-react";
import { Input, RichTextarea, Textarea } from "@/components/ui";
import { useModal } from "@/context/modal-context";
import { useIntl } from "react-intl";
import { toast } from "react-toastify";
import { handleApiError } from "@/utils/handle-error";
import { authAxios } from "@/utils/axios";
import { mutate } from "swr";
import { useEffect } from "react";
import { useRouter } from "next/router";

const QuestionGroupFormModal = ({ section, group = null, group_count = 0, currentMockType }) => {
  const { closeModal } = useModal();
  const isEdit = !!group;
  const router = useRouter();
  const intl = useIntl();

  const sectionId = section?.id;
  const sectionType = section?.section_type;

  const {
    register,
    handleSubmit,
    control,
    setError,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      mondai_number: group_count + 1,
      title: "",
      instruction: "",
      reading_text: "",
      order: group_count + 1,
      audio_file: null,
      image: null,
    },
  });

  useEffect(() => {
    if (group) {
      reset({
        mondai_number: group.mondai_number,
        title: group.title,
        instruction: group.instruction,
        reading_text: group.reading_text || "",
        order: group.order,
      });
    }
  }, [group]);

  const onSubmit = async (values) => {
    const toastId = toast.loading(
      intl.formatMessage({
        id: isEdit ? "Yangilanmoqda..." : "Yaratilmoqda...",
      }),
    );

    try {
      const formData = new FormData();
      Object.keys(values).forEach((key) => {
        if (values[key] !== null && values[key] !== undefined) {
          if (
            (key === "audio_file" || key === "image") &&
            values[key] instanceof FileList
          ) {
            if (values[key][0]) formData.append(key, values[key][0]);
          } else {
            formData.append(key, values[key]);
          }
        }
      });

      if (!isEdit) formData.append("section", sectionId);
      formData.append("order", values?.mondai_number);

      const method = isEdit ? "patch" : "post";
      const url = isEdit
        ? `${currentMockType?.question_group}${group.id}/`
        : `${currentMockType?.question_group}`;

      await authAxios[method](url, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.update(toastId, {
        render: intl.formatMessage({
          id: isEdit ? "Savollar guruhi yangilandi!" : "Savollar guruhi muvaffaqiyatli qo'shildi!",
        }),
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });

      closeModal("QUESTION_GROUP", { refresh: true });
      mutate([`${currentMockType?.question_group}`, router.locale, section?.id]);
    } catch (err) {
      toast.dismiss(toastId);
      handleApiError(err, setError);
    }
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <div className="bg-emerald-100 p-4 rounded-3xl text-emerald-600">
          <Layers size={32} />
        </div>
        <div>
          <h2 className="text-2xl font-black text-heading">
            {isEdit ? "Savollar guruhini tahrirlash" : "Yangi savollar guruhi qo'shish"}
          </h2>
          <p className="text-muted text-sm font-medium">
            {section?.name} {intl.formatMessage({ id: "bo'limi uchun savollar guruhini shakllantiring" })}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <Input
            label="Mondai raqami"
            name="mondai_number"
            type="number"
            register={register}
            error={errors.mondai_number}
            placeholder="1"
          />
          <div className="md:col-span-2">
            <Input
              label="Guruh sarlavhasi"
              name="title"
              register={register}
              error={errors.title}
              placeholder="Masalan: Kanji Reading"
              rules={{ required: "Sarlavha majburiy" }}
            />
          </div>
        </div>

        {/* <Textarea
          label="Yo'riqnoma (Instruction)"
          name="instruction"
          register={register}
          error={errors.instruction}
          rows={2}
          placeholder="Savollar uchun ko'rsatma yozing..."
          rules={{ required: "Yo'riqnoma majburiy" }}
        /> */}

        <Controller
          name="instruction"
          control={control}
          rules={{ required: "Yo'riqnoma majburiy" }}
          render={({ field: { value, onChange }, fieldState: { error } }) => (
            <RichTextarea
              label="Yo'riqnoma (Instruction)"
              value={value}
              onChange={onChange}
              error={error}
              placeholder="Savollar uchun ko'rsatma yozing..."
            />
          )}
        />

        {
          (section?.section_type === "GRAMMAR_READING" || section?.section_type === "READING") &&
          // <Textarea
          //   label="Reading Text / Context"
          //   name="reading_text"
          //   register={register}
          //   error={errors.reading_text}
          //   rows={6}
          //   placeholder="Asosiy matnni kiriting..."
          // />
          <Controller
            name="reading_text"
            control={control}
            render={({ field: { value, onChange }, fieldState: { error } }) => (
              <RichTextarea
                label="Reading Text / Context"
                value={value}
                onChange={onChange}
                error={error}
                placeholder="Asosiy matnni kiriting..."
              />
            )}
          />
        }
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {
            currentMockType?.image && <div className="space-y-2">
              <label className="text-sm font-black text-heading ml-1 flex items-center gap-2">
                <ImageIcon size={16} /> {intl.formatMessage({ id: "Rasm (Optional)" })}
              </label>
              <input
                type="file"
                accept="image/*"
                {...register("image")}
                className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-bold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100"
              />
            </div>
          }

          {/* Faqat LISTENING bo'lsa AUDIO chiqadi */}
          {sectionType === "LISTENING" && (
            <div className="space-y-2">
              <label className="text-sm font-black text-heading ml-1 flex items-center gap-2">
                <Music size={16} /> Audio Fayl
              </label>
              <input
                type="file"
                accept="audio/*"
                {...register("audio_file")}
                className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-bold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
            </div>
          )}
        </div>

        <div className="flex items-center justify-end flex-col-reverse sm:flex-row  pt-6 border-t border-gray-100">
          {/* <div className="w-32">
            <Input
              label="Tartib"
              name="order"
              type="number"
              register={register}
            />
          </div> */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => closeModal("QUESTION_GROUP")}
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
              {intl.formatMessage({ id: isSubmitting ? "Saqlanmoqda..." : "Saqlash" })}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default QuestionGroupFormModal;
