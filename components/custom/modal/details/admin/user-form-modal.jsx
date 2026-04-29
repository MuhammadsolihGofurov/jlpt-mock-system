import { useForm, Controller } from "react-hook-form";
import { UserCog, Save, ShieldCheck, Power } from "lucide-react";
import { Input, Select } from "@/components/ui";
import { useModal } from "@/context/modal-context";
import { useIntl } from "react-intl";
import { toast } from "react-toastify";
import { handleApiError } from "@/utils/handle-error";
import { authAxios } from "@/utils/axios";
import { mutate } from "swr";
import { useRouter } from "next/router";
import { useEffect } from "react";

const UserFormModal = ({ user = null }) => {
  const { closeModal } = useModal();
  const intl = useIntl();
  const router = useRouter();
  const isEdit = !!user;

  const {
    register,
    handleSubmit,
    control,
    setError,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      first_name: "",
      last_name: "",
      is_active: true,
      is_approved: false,
    },
  });

  useEffect(() => {
    setValue("first_name", user?.first_name);
    setValue("last_name", user?.last_name);
    setValue("is_active", user?.is_active);
    setValue("is_approved", user?.is_approved);
  }, [user]);

  const onSubmit = async (data) => {
    const toastId = toast.loading(
      intl.formatMessage({ id: "Ma'lumotlar saqlanmoqda..." }),
    );

    try {
      const method = isEdit ? "put" : "post";
      const url = isEdit ? `/users/${user.id}/` : "/users/";

      await authAxios[method](url, data);

      toast.update(toastId, {
        render: intl.formatMessage({
          id: isEdit
            ? "Muvaffaqiyatli yangilandi!"
            : "Foydalanuvchi yaratildi!",
        }),
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });

      closeModal("USER_FORM", { refresh: true });
      mutate([`users/`, router.locale, router.query.page || 1]);
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
          <UserCog size={32} />
        </div>
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-heading">
            {intl.formatMessage({
              id: isEdit ? "Foydalanuvchini tahrirlash" : "Yangi foydalanuvchi",
            })}
          </h2>
          <p className="text-muted text-sm font-medium">
            {intl.formatMessage({
              id: "Foydalanuvchi profili va ruxsatlarini boshqarish",
            })}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Name Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label={intl.formatMessage({ id: "Ism" })}
            name="first_name"
            register={register}
            error={errors.first_name}
            placeholder="Alice"
            rules={{ required: intl.formatMessage({ id: "Ism majburiy" }) }}
          />
          <Input
            label={intl.formatMessage({ id: "Familiya" })}
            name="last_name"
            register={register}
            error={errors.last_name}
            placeholder="Updated"
            rules={{
              required: intl.formatMessage({ id: "Familiya majburiy" }),
            }}
          />
        </div>

        {/* Status Switches / Selects */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Activity Status */}
          <Controller
            name="is_active"
            control={control}
            render={({ field }) => (
              <Select
                label="Hisob holati (Activity)"
                options={[
                  { value: true, label: "Faol (Active)" },
                  { value: false, label: "Bloklangan (Inactive)" },
                ]}
                value={field.value}
                onChange={(val) =>
                  field.onChange(val === "true" || val === true)
                }
                error={errors.is_active?.message}
                icon={
                  <Power
                    size={18}
                    className={field.value ? "text-green-500" : "text-red-500"}
                  />
                }
              />
            )}
          />

          {/* Approval Status */}
          <Controller
            name="is_approved"
            control={control}
            render={({ field }) => (
              <Select
                label="Tasdiqlash holati"
                options={[
                  { value: true, label: "Tasdiqlangan (Approved)" },
                  { value: false, label: "Kutilmoqda (Pending)" },
                ]}
                value={field.value}
                onChange={(val) =>
                  field.onChange(val === "true" || val === true)
                }
                error={errors.is_approved?.message}
                icon={
                  <ShieldCheck
                    size={18}
                    className={
                      field.value ? "text-emerald-500" : "text-amber-500"
                    }
                  />
                }
              />
            )}
          />
        </div>

        {/* Hint Box */}
        {/* <div className="bg-orange-50/50 border border-orange-100 rounded-2xl p-4 flex gap-3">
          <ShieldCheck className="text-primary shrink-0" size={20} />
          <p className="text-[11px] text-orange-800 font-medium">
            {intl.formatMessage({
              id: "Foydalanuvchini tasdiqlash unga tizimning yopiq funksiyalaridan foydalanish ruxsatini beradi.",
            })}
          </p>
        </div> */}

        {/* Action Buttons */}
        <div className="flex sm:flex-row flex-col-reverse items-center justify-end gap-3 pt-6 border-t border-gray-100">
          <button
            type="button"
            onClick={() => closeModal("USER_FORM")}
            className="px-6 py-3.5 rounded-2xl font-bold text-muted hover:bg-gray-100 transition-all w-full sm:w-auto"
          >
            {intl.formatMessage({ id: "Bekor qilish" })}
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-primary hover:bg-primary-dark text-white font-black px-8 py-3.5 rounded-2xl shadow-xl shadow-orange-200 transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50 w-full sm:w-auto"
          >
            <Save size={18} />
            {isSubmitting
              ? intl.formatMessage({ id: "Saqlanmoqda..." })
              : intl.formatMessage({ id: "O'zgarishlarni saqlash" })}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UserFormModal;
