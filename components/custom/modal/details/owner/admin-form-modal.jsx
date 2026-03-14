import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { UserPlus, Save, ShieldCheck } from "lucide-react";
import { Input } from "@/components/ui";
import { useModal } from "@/context/modal-context";
import { useIntl } from "react-intl";
import { toast } from "react-toastify";
import { handleApiError } from "@/utils/handle-error";
import { authAxios } from "@/utils/axios";
import { mutate } from "swr";
import { useRouter } from "next/router";

const AdminFormModal = ({ admin = null, centerId }) => {
  const { closeModal, openModal } = useModal();
  const isEdit = !!admin;
  const intl = useIntl();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: admin || {
      first_name: "",
      last_name: "",
      email: "",
      password: "",
    },
  });

  // Tahrirlash rejimida ma'lumotlarni formaga yuklash
  useEffect(() => {
    if (admin) {
      reset({
        first_name: admin.first_name,
        last_name: admin.last_name,
        email: admin.email,
        // Tahrirlashda parolni ko'rsatmaymiz
      });
    }
  }, [admin, reset]);

  const onSubmit = async (data) => {
    const toastId = toast.loading(intl.formatMessage({ id: "Saqlanmoqda..." }));

    try {
      const url = isEdit
        ? `/owner-center-admins/${admin.id}/`
        : "/owner-center-admins/";
      const method = isEdit ? "patch" : "post";

      const payload = {
        ...data,
        center_id: centerId,
      };

      if (isEdit && !data.password) {
        delete payload.password;
      }

      const response = await authAxios[method](url, payload);

      toast.update(toastId, {
        render:
          response?.data?.message ||
          (isEdit ? "Admin yangilandi!" : "Admin qo'shildi!"),
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });

      // Ma'lumotlarni yangilash (Adminlar ro'yxati SWR keyini kiriting)
      mutate([`/owner-centers/${centerId}/admins/`]);

      closeModal("ADMIN_FORM", { refresh: true });
    } catch (err) {
      toast.dismiss(toastId);
      handleApiError(err, setError);
    }
  };

  const handleDelete = (id) => {
    closeModal("ADMIN_FORM");

    openModal(
      "CONFIRM_MODAL",
      {
        title: "Adminni o'chirmoqchimisiz",
        body: "Ushbu adminni o'chirib tashlamoqchimisiz? Bunda barcha bog'langan ma'lumotlar ham yo'qolishi mumkin.",
        confirmText: "Ha, o'chirilsin",
        variant: "danger",
        mutateKey: ["owner-center/", router.locale],
        onConfirm: async () => {
          return await authAxios.delete(`/owner-center-admins/${id}/`);
        },
      },
      "small",
    );
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <div className="bg-blue-100 p-4 rounded-3xl text-blue-600">
          <ShieldCheck size={32} />
        </div>
        <div>
          <h2 className="text-2xl font-black text-heading">
            {intl.formatMessage({
              id: isEdit ? "Adminni tahrirlash" : "Yangi admin qo'shish",
            })}
          </h2>
          <p className="text-muted text-sm font-medium">
            {intl.formatMessage({ id: "Markaz boshqaruvchisi ma'lumotlari" })}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Ism"
            name="first_name"
            register={register}
            error={errors.first_name}
            placeholder="Ali"
            rules={{ required: "Ism kiritilishi shart" }}
          />
          <Input
            label="Familiya"
            name="last_name"
            register={register}
            error={errors.last_name}
            placeholder="Valiyev"
          />
        </div>

        <Input
          label="email"
          name="email"
          type="email"
          register={register}
          error={errors.email}
          placeholder="admin@center.com"
          rules={{ required: "Email kiritilishi shart" }}
        />

        {!isEdit && (
          <Input
            label={"Parol"}
            name="password"
            type="password"
            register={register}
            error={errors.password}
            placeholder="••••••••"
            rules={{
              required: "Parol kiritilishi shart",
              minLength: { value: 6, message: "Kamida 6 ta belgi" },
            }}
          />
        )}

        {/* Action Buttons */}
        <div
          className={`flex items-center ${isEdit ? "justify-between" : " justify-end"} sm:flex-row flex-col-reverse gap-3 pt-6 border-t border-gray-100`}
        >
          {isEdit && (
            <button
              type="button"
              onClick={() => handleDelete(admin?.id)}
              className="px-6 py-3.5 rounded-2xl font-bold text-danger hover:bg-red-100 transition-all"
            >
              {intl.formatMessage({ id: "O'chirish" })}
            </button>
          )}
          <div className="flex items-center gap-3 sm:flex-row flex-col-reverse">
            <button
              type="button"
              onClick={() => closeModal("ADMIN_FORM")}
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
                ? "Saqlanmoqda..."
                : isEdit
                  ? "Yangilash"
                  : "Qo'shish"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AdminFormModal;
