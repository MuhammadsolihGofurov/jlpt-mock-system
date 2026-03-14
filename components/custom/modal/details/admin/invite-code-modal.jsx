import { useForm, Controller } from "react-hook-form";
import { UserPlus, Send, Ticket, Users } from "lucide-react";
import { Input, Select } from "@/components/ui";
import { useModal } from "@/context/modal-context";
import { useIntl } from "react-intl";
import { toast } from "react-toastify";
import { handleApiError } from "@/utils/handle-error";
import { authAxios } from "@/utils/axios";
import { mutate } from "swr";
import { useRouter } from "next/router";

const InvitationFormModal = () => {
  const { closeModal, openModal } = useModal();
  const intl = useIntl();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    control,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      role: "TEACHER",
      is_guest: false,
      quantity: 1,
    },
  });

  const onSubmit = async (data) => {
    const toastId = toast.loading(
      intl.formatMessage({ id: "Taklifnomalar yaratilmoqda..." }),
    );

    try {
      const response = await authAxios.post("/centers/invitations/", data);

      toast.update(toastId, {
        render: intl.formatMessage({
          id: "Taklifnoma(lar) muvaffaqiyatli yaratildi!",
        }),
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });

      closeModal("INVITE_FORM", { refresh: true });

      setTimeout(() => {
        openModal("INVITE_SUCCESS", { invitations: response?.data }, "middle");
      }, 300);

      mutate([`centers/invitations/list/`, router.locale]);
    } catch (err) {
      toast.dismiss(toastId);
      handleApiError(err, setError);
    }
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <div className="bg-orange-100 p-2 sm:p-4 rounded-3xl text-primary">
          <UserPlus size={32} />
        </div>
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-heading">
            {intl.formatMessage({ id: "Taklifnoma yaratish" })}
          </h2>
          <p className="text-muted text-sm font-medium">
            {intl.formatMessage({
              id: "Yangi foydalanuvchilarni tizimga taklif qiling",
            })}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Role Select */}
          <Controller
            name="role"
            control={control}
            render={({ field }) => (
              <Select
                label="Foydalanuvchi roli"
                options={[
                  { value: "TEACHER", label: "O'qituvchi (Teacher)" },
                  { value: "STUDENT", label: "O'quvchi (Student)" },
                ]}
                value={field.value}
                onChange={field.onChange}
                error={errors.role?.message}
              />
            )}
          />

          {/* Invitation Type (Guest) */}
          <Controller
            name="is_guest"
            control={control}
            render={({ field }) => (
              <Select
                label="Taklifnoma turi"
                options={[
                  { value: false, label: "Standart (Muddatsiz)" },
                  { value: true, label: "Mehmon (24 soatlik)" },
                ]}
                value={field.value}
                onChange={(val) =>
                  field.onChange(val === "true" || val === true)
                }
                error={errors.is_guest?.message}
              />
            )}
          />
        </div>

        {/* Quantity Input */}
        <div className="relative">
          <Input
            label="Soni (Quantity)"
            name="quantity"
            type="number"
            register={register}
            error={errors.quantity}
            placeholder="1-100 gacha"
            rules={{
              required: intl.formatMessage({ id: "Soni majburiy" }),
              min: {
                value: 1,
                message: intl.formatMessage({ id: "Kamida 1 ta" }),
              },
              max: {
                value: 100,
                message: intl.formatMessage({ id: "Maksimal 100 ta" }),
              },
            }}
          />
          <div className="absolute right-4 top-[38px] text-orange-200">
            <Users size={20} />
          </div>
        </div>

        {/* Info Box */}
        <div className="bg-blue-50/50 border border-blue-100 rounded-2xl p-4 flex gap-3">
          <Ticket className="text-blue-500 shrink-0" size={20} />
          <p className="text-xs text-blue-700 font-medium">
            {intl.formatMessage({
              id: "Mehmon taklifnomalari faqat bir marta ro'yxatdan o'tish uchun amal qiladi va 24 soatdan keyin o'chib ketadi.",
            })}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex sm:flex-row flex-col-reverse items-center justify-end gap-3 pt-6 border-t border-gray-100">
          <button
            type="button"
            onClick={() => closeModal("invitationForm")}
            className="px-6 py-3.5 rounded-2xl font-bold text-muted hover:bg-gray-100 transition-all w-full sm:w-auto"
          >
            {intl.formatMessage({ id: "Bekor qilish" })}
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-primary hover:bg-primary-dark text-white font-black px-8 py-3.5 rounded-2xl shadow-xl shadow-orange-200 transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50 w-full sm:w-auto"
          >
            <Send size={18} />
            {isSubmitting
              ? intl.formatMessage({ id: "Yaratilmoqda..." })
              : intl.formatMessage({ id: "Taklifnomalarni yuborish" })}
          </button>
        </div>
      </form>
    </div>
  );
};

export default InvitationFormModal;
