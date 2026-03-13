import { useForm, Controller } from "react-hook-form";
import { Building2, Save } from "lucide-react";
import { Input, Select } from "@/components/ui";
import { useModal } from "@/context/modal-context";
import { useIntl } from "react-intl";
import { toast } from "react-toastify";
import { handleApiError } from "@/utils/handle-error";
import { authAxios } from "@/utils/axios";
import useSWR, { mutate } from "swr";
import fetcher from "@/utils/fetcher";
import { useRouter } from "next/router";
import { useEffect } from "react";

const CenterFormModal = ({ center = null }) => {
  const { closeModal } = useModal();
  const isEdit = !!center;
  const router = useRouter();
  const intl = useIntl();

  const {
    register,
    handleSubmit,
    control,
    setError,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: center || {
      status: "TRIAL",
      primary_color: "#F5A623",
    },
  });

  const { data: centerData } = useSWR(
    center ? ["owner-centers/", router.locale, center] : null,
    (url, locale) =>
      fetcher(
        `${url}${center?.id}`,
        { headers: { "Accept-Language": locale } },
        {},
        true,
      ),
  );

  useEffect(() => {
    if (centerData) {
      reset({
        name: centerData.name,
        email: centerData.email,
        phone: centerData.phone,
        description: centerData.description,
        website: centerData.website,
        address: centerData.address,
        primary_color: centerData.primary_color,
        status: centerData.status,
      });
    }
  }, [centerData, reset]);

  const onSubmit = async (data) => {
    const toastId = toast.loading(
      intl.formatMessage({ id: "Ma'lumotlar saqlanmoqda..." }),
    );

    try {
      const isEdit = !!center?.id;
      const method = isEdit ? "patch" : "post";
      const url = isEdit ? `/owner-centers/${center.id}/` : "/owner-centers/";

      const response = await authAxios[method](url, data);

      toast.update(toastId, {
        render: isEdit
          ? intl.formatMessage({ id: "Muvaffaqiyatli yangilandi!" })
          : intl.formatMessage({ id: "Yangi markaz yaratildi!" }),
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });

      closeModal("centerForm", { refresh: true });
      mutate();
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
          <Building2 size={32} />
        </div>
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-heading">
            {intl.formatMessage({
              id: isEdit ? "Markazni tahrirlash" : "Yangi markaz ochish",
            })}
          </h2>
          <p className="text-muted text-sm font-medium">
            {intl.formatMessage({
              id: "Barcha kerakli ma'lumotlarni to'ldiring",
            })}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Markaz nomi"
            name="name"
            register={register}
            error={errors.name}
            placeholder="Mikan Academy"
          />
          <Input
            label="Email"
            name="email"
            type="email"
            register={register}
            error={errors.email}
            placeholder="admin@example.com"
          />
          <Input
            label="Telefon"
            name="phone"
            register={register}
            error={errors.phone}
            placeholder="+998 90 123 45 67"
          />

          <Controller
            name="status"
            control={control}
            render={({ field }) => (
              <Select
                label="Holati (Status)"
                options={[
                  { value: "TRIAL", label: "Sinov muddati (Trial)" },
                  { value: "ACTIVE", label: "Faol (Active)" },
                  { value: "SUSPENDED", label: "To'xtatilgan" },
                ]}
                value={field.value}
                onChange={field.onChange}
                error={errors.status?.message}
              />
            )}
          />
        </div>

        <Input
          label="Tavsif (Description)"
          name="description"
          register={register}
          error={errors.description}
          placeholder="Markaz haqida qisqacha..."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Manzil"
            name="address"
            register={register}
            error={errors.address}
            placeholder="Toshkent sh, Chilonzor..."
          />
          <Input
            label="Brend rangi (HEX)"
            name="primary_color"
            type="color"
            register={register}
            className="h-14 p-1 cursor-pointer"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex sm:flex-row flex-col-reverse items-center justify-end gap-3 pt-4 border-t border-gray-100">
          <button
            type="button"
            onClick={() => closeModal("centerForm")}
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
            {isSubmitting
              ? intl.formatMessage({ id: "Saqlanmoqda..." })
              : isEdit
                ? intl.formatMessage({ id: "O'zgarishlarni saqlash" })
                : intl.formatMessage({ id: "Markazni yaratish" })}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CenterFormModal;
