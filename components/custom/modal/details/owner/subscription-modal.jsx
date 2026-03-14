import React, { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { CreditCard, Save, Calendar, RefreshCcw } from "lucide-react";
import { Input, Select } from "@/components/ui"; // Select komponentingiz bor deb hisoblaymiz
import { useModal } from "@/context/modal-context";
import { useIntl } from "react-intl";
import { toast } from "react-toastify";
import { handleApiError } from "@/utils/handle-error";
import { authAxios } from "@/utils/axios";
import { mutate } from "swr";

const SubscriptionFormModal = ({ subscription = null, centerId }) => {
  const { closeModal } = useModal();
  const isEdit = !!subscription;
  const intl = useIntl();

  const {
    register,
    handleSubmit,
    control,
    setError,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: subscription || {
      plan: "FREE",
      price: "",
      currency: "UZS",
      billing_cycle: "monthly",
      next_billing_date: "",
      is_active: true,
      auto_renew: true,
    },
  });

  useEffect(() => {
    if (subscription) {
      reset(subscription);
    }
  }, [subscription, reset]);

  const onSubmit = async (data) => {
    const toastId = toast.loading(intl.formatMessage({ id: "Saqlanmoqda..." }));

    try {
      const url = isEdit 
        ? `/owner-subscriptions/${subscription.id}/` 
        : `/owner-subscriptions/`;
      const method = isEdit ? "patch" : "post";

      const response = await authAxios[method](url, data);

      toast.update(toastId, {
        render: response?.data?.message || (isEdit ? "Obuna yangilandi!" : "Obuna yaratildi!"),
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });

      mutate([`/owner-centers/${centerId}/subscriptions/`]);
      closeModal("SUBSCRIPTION_FORM");
    } catch (err) {
      toast.dismiss(toastId);
      handleApiError(err, setError);
    }
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <div className="bg-purple-100 p-4 rounded-3xl text-purple-600">
          <CreditCard size={32} />
        </div>
        <div>
          <h2 className="text-2xl font-black text-heading">
            {intl.formatMessage({
              id: isEdit ? "Obunani tahrirlash" : "Yangi obuna qo'shish",
            })}
          </h2>
          <p className="text-muted text-sm font-medium">
            {intl.formatMessage({ id: "Tarif rejasi va to'lov sozlamalari" })}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Controller
            name="plan"
            control={control}
            render={({ field }) => (
              <Select
                label="Tarif rejasi"
                options={[
                  { value: "FREE", label: "Bepul (Free)" },
                  { value: "PRO", label: "Professional" },
                  { value: "ULTRA", label: "Ultra" },
                ]}
                {...field}
                error={errors.plan?.message}
              />
            )}
          />

          <Input
            label="Narxi"
            name="price"
            type="number"
            register={register}
            error={errors.price}
            placeholder="50000"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Controller
            name="billing_cycle"
            control={control}
            render={({ field }) => (
              <Select
                label="To'lov davri"
                options={[
                  { value: "monthly", label: "Har oy" },
                  { value: "yearly", label: "Har yil" },
                ]}
                {...field}
                error={errors.billing_cycle?.message}
              />
            )}
          />

          <Input
            label="Keyingi to'lov sanasi"
            name="next_billing_date"
            type="date"
            register={register}
            error={errors.next_billing_date}
          />
        </div>

        <div className="bg-gray-50/50 p-6 rounded-[2rem] border-2 border-gray-100 flex flex-wrap gap-8">
          <label className="flex items-center gap-3 cursor-pointer group">
            <input
              type="checkbox"
              {...register("is_active")}
              className="w-6 h-6 rounded-lg border-2 border-gray-300 checked:bg-primary transition-all cursor-pointer"
            />
            <span className="text-sm font-bold text-heading group-hover:text-primary transition-colors">
              Faol holatda
            </span>
          </label>

          <label className="flex items-center gap-3 cursor-pointer group">
            <input
              type="checkbox"
              {...register("auto_renew")}
              className="w-6 h-6 rounded-lg border-2 border-gray-300 checked:bg-primary transition-all cursor-pointer"
            />
            <span className="text-sm font-bold text-heading group-hover:text-primary transition-colors">
              Avtomatik yangilash
            </span>
          </label>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-100">
          <button
            type="button"
            onClick={() => closeModal("SUBSCRIPTION_FORM")}
            className="px-6 py-3.5 rounded-2xl font-bold text-muted hover:bg-gray-100 transition-all"
          >
            {intl.formatMessage({ id: "Bekor qilish" })}
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-primary hover:bg-primary-dark text-white font-black px-8 py-3.5 rounded-2xl shadow-xl shadow-orange-200 transition-all active:scale-95 flex items-center gap-2 disabled:opacity-50"
          >
            <Save size={20} />
            {isSubmitting ? "Saqlanmoqda..." : isEdit ? "Yangilash" : "Saqlash"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SubscriptionFormModal;