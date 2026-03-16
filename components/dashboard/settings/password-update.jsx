import React from "react";
import { useForm } from "react-hook-form";
import { Lock, Save, Loader2, ShieldCheck, Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui";
import { toast } from "react-toastify";
import { authAxios } from "@/utils/axios";
import { handleApiError } from "@/utils/handle-error";
import { useIntl } from "react-intl";

const PasswordUpdateForm = () => {
  const intl = useIntl();

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      old_password: "",
      new_password: "",
      confirm_password: "",
    },
  });

  // Yangi parolni kuzatib boramiz (Confirm bilan solishtirish uchun)
  const newPassword = watch("new_password");

  const onSubmit = async (data) => {
    const toastId = toast.loading(
      intl.formatMessage({ id: "Parol yangilanmoqda..." }),
    );
    try {
      await authAxios.post("/auth/password/update/", {
        old_password: data.old_password,
        new_password: data.new_password,
      });

      toast.update(toastId, {
        render: intl.formatMessage({
          id: "Parol muvaffaqiyatli o'zgartirildi!",
        }),
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });
      reset(); // Formani tozalash
    } catch (err) {
      toast.dismiss(toastId);
      handleApiError(err);
    }
  };

  return (
    <div className="flex flex-col gap-5">
      <h2 className="text-lg sm:text-xl font-bold text-heading flex items-center gap-3 px-4">
        <ShieldCheck className="text-primary" />
        {intl.formatMessage({ id: "Xavfsizlik va Parol" })}
      </h2>

      <div className="w-full bg-white/80 backdrop-blur-xl border border-gray-100 p-4 sm:p-8 rounded-xl sm:rounded-[3rem] shadow-sm">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Eski Parol */}
            <div className="md:col-span-2">
              <Input
                label="Eski parol"
                name="old_password"
                type="password"
                register={register}
                error={errors.old_password}
                rules={{
                  required: intl.formatMessage({
                    id: "Eski parolni kiritish shart",
                  }),
                }}
                placeholder="••••••••"
                icon={<Lock size={18} />}
              />
            </div>

            {/* Yangi Parol */}
            <Input
              label="Yangi parol"
              name="new_password"
              type="password"
              register={register}
              error={errors.new_password}
              rules={{
                required: intl.formatMessage({
                  id: "Yangi parol kiritish shart",
                }),
                minLength: {
                  value: 8,
                  message: intl.formatMessage({
                    id: "Parol kamida 8 ta belgidan iborat bo'lishi kerak",
                  }),
                },
              }}
              placeholder="••••••••"
            />

            {/* Parolni tasdiqlash */}
            <Input
              label="Parolni tasdiqlash"
              name="confirm_password"
              type="password"
              register={register}
              error={errors.confirm_password}
              rules={{
                required: intl.formatMessage({ id: "Parolni qayta kiriting" }),
                validate: (value) =>
                  value === newPassword ||
                  intl.formatMessage({ id: "Parollar mos kelmadi" }),
              }}
              placeholder="••••••••"
            />
          </div>

          <div className="flex justify-end pt-4 border-t border-gray-50">
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-primary hover:bg-primary-dark text-white font-black px-10 py-4 rounded-2xl shadow-xl shadow-orange-200 transition-all active:scale-95 flex items-center gap-2 disabled:opacity-50"
            >
              {isSubmitting ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <Save size={20} />
              )}
              {intl.formatMessage({ id: "Parolni yangilash" })}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PasswordUpdateForm;
