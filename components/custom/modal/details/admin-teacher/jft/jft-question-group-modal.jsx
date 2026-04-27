import { useForm, Controller } from "react-hook-form";
import {
    Layers,
    Save,
    Music,
    ImageIcon,
    X,
    Trash2,
} from "lucide-react";
import { Input, RichTextarea } from "@/components/ui";
import { useModal } from "@/context/modal-context";
import { useIntl } from "react-intl";
import { toast } from "react-toastify";
import { handleApiError } from "@/utils/handle-error";
import { authAxios } from "@/utils/axios";
import { mutate } from "swr";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { uploadMedia } from "@/utils/uploadMedia";

const JFTQuestionGroupFormModal = ({ section, group_count = 0, group = null }) => {
    const { closeModal } = useModal();
    const isEdit = !!group;
    const router = useRouter();
    const intl = useIntl();

    const sectionId = section?.id;

    const [existingAudioUrl, setExistingAudioUrl] = useState(null);
    const [existingImageUrl, setExistingImageUrl] = useState(null);
    const [audioRemoved, setAudioRemoved] = useState(false);
    const [imageRemoved, setImageRemoved] = useState(false);

    const {
        register,
        handleSubmit,
        control,
        setError,
        reset,
        watch,
        setValue,
        formState: { errors, isSubmitting },
    } = useForm({
        defaultValues: {
            mondai_number: group_count + 1,
            title: "",
            instruction: "",
            content_text: "",
            order: group_count + 1,
            audio_file: null,
            image: null,
        },
    });

    const watchedAudio = watch("audio_file");
    const watchedImage = watch("image");
    const newAudioFile = watchedAudio instanceof FileList ? watchedAudio[0] : watchedAudio;
    const newImageFile = watchedImage instanceof FileList ? watchedImage[0] : watchedImage;

    useEffect(() => {
        if (group) {
            reset({
                mondai_number: group.mondai_number,
                title: group.title,
                instruction: group.instruction,
                content_text: group.content_text || "",
                order: group.order,
                audio_file: null,
                image: null,
            });
            setExistingAudioUrl(group.audio_file || null);
            setExistingImageUrl(group.image || null);
            setAudioRemoved(false);
            setImageRemoved(false);
        }
    }, [group, reset]);

    const handleRemoveExistingAudio = () => {
        setExistingAudioUrl(null);
        setAudioRemoved(true);
        setValue("audio_file", null);
    };

    const handleClearNewAudio = () => {
        setValue("audio_file", null);
    };

    const handleRemoveExistingImage = () => {
        setExistingImageUrl(null);
        setImageRemoved(true);
        setValue("image", null);
    };

    const handleClearNewImage = () => {
        setValue("image", null);
    };

    const onSubmit = async (values) => {
        const toastId = toast.loading(
            intl.formatMessage({
                id: isEdit ? "Yangilanmoqda..." : "Yaratilmoqda...",
            }),
        );

        try {
            let image_key;
            const imageFile = values.image instanceof FileList ? values.image[0] : values.image;
            if (imageFile instanceof File) {
                image_key = await uploadMedia(imageFile, "jft_shared_content");
            } else if (imageRemoved) {
                image_key = null;
            }

            let audio_key;
            const audioFile = values.audio_file instanceof FileList ? values.audio_file[0] : values.audio_file;
            if (audioFile instanceof File) {
                audio_key = await uploadMedia(audioFile, "jft_shared_content_audio");
            } else if (audioRemoved) {
                audio_key = null;
            }

            const payload = {
                title: values.title,
                instruction: values.instruction,
                content_text: values.content_text,
                order: values.mondai_number,
            };

            if (!isEdit) payload.section = sectionId;
            if (image_key !== undefined) payload.image_key = image_key;
            if (audio_key !== undefined) payload.audio_key = audio_key;

            const method = isEdit ? "patch" : "post";
            const url = isEdit ? `jft-shared-contents/${group.id}/` : `jft-shared-contents/`;

            await authAxios[method](url, payload);

            toast.update(toastId, {
                render: intl.formatMessage({
                    id: isEdit ? "Savollar guruhi yangilandi!" : "Savollar guruhi muvaffaqiyatli qo'shildi!",
                }),
                type: "success",
                isLoading: false,
                autoClose: 3000,
            });

            closeModal("JFT_QUESTION_GROUP", { refresh: true });
            mutate([`jft-questions/`, router.locale, section?.id]);
            mutate([`jft-shared-contents/`, router.locale, section?.id]);
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

                {(section?.section_type === "GRAMMAR_READING" || section?.section_type === "READING") && (
                    <Controller
                        name="content_text"
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
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-2">
                        <label className="text-sm font-black text-heading ml-1 flex items-center gap-2">
                            <ImageIcon size={16} /> {intl.formatMessage({ id: "Rasm (Optional)" })}
                        </label>

                        {existingImageUrl && !newImageFile && (
                            <div className="relative w-40 h-24 overflow-hidden rounded-xl border border-slate-200">
                                <img
                                    src={existingImageUrl}
                                    alt="group"
                                    className="w-full h-full object-cover"
                                />
                                <button
                                    type="button"
                                    onClick={handleRemoveExistingImage}
                                    title={intl.formatMessage({ id: "O'chirish" })}
                                    className="absolute top-1 right-1 bg-white/80 p-1 rounded-full shadow-sm text-red-500 hover:bg-white"
                                >
                                    <Trash2 size={14} />
                                </button>
                            </div>
                        )}

                        {newImageFile instanceof File && (
                            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-emerald-50 border border-emerald-100 text-xs text-emerald-700 font-bold">
                                <ImageIcon size={14} />
                                <span className="truncate flex-1">{newImageFile.name}</span>
                                <button
                                    type="button"
                                    onClick={handleClearNewImage}
                                    className="text-emerald-700 hover:text-red-500"
                                >
                                    <X size={14} />
                                </button>
                            </div>
                        )}

                        <input
                            type="file"
                            accept="image/*"
                            {...register("image")}
                            className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-bold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-black text-heading ml-1 flex items-center gap-2">
                            <Music size={16} /> Audio Fayl (Optional)
                        </label>

                        {existingAudioUrl && !newAudioFile && (
                            <div className="space-y-2">
                                <audio
                                    controls
                                    src={existingAudioUrl}
                                    className="w-full h-10 rounded-xl"
                                />
                                <button
                                    type="button"
                                    onClick={handleRemoveExistingAudio}
                                    className="inline-flex items-center gap-1.5 text-xs font-bold text-red-500 hover:text-red-600"
                                >
                                    <Trash2 size={14} /> {intl.formatMessage({ id: "Audio faylni o'chirish" })}
                                </button>
                            </div>
                        )}

                        {newAudioFile instanceof File && (
                            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-blue-50 border border-blue-100 text-xs text-blue-700 font-bold">
                                <Music size={14} />
                                <span className="truncate flex-1">{newAudioFile.name}</span>
                                <button
                                    type="button"
                                    onClick={handleClearNewAudio}
                                    className="text-blue-700 hover:text-red-500"
                                >
                                    <X size={14} />
                                </button>
                            </div>
                        )}

                        <input
                            type="file"
                            accept="audio/*"
                            {...register("audio_file")}
                            className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-bold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                        />
                    </div>
                </div>

                <div className="flex items-center justify-end flex-col-reverse sm:flex-row pt-6 border-t border-gray-100">
                    <div className="flex gap-3">
                        <button
                            type="button"
                            onClick={() => closeModal("JFT_QUESTION_GROUP")}
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

export default JFTQuestionGroupFormModal;
