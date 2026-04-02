import { useForm, Controller } from "react-hook-form";
import { Filter, RotateCcw, CheckCircle2 } from "lucide-react";
import { Select } from "@/components/ui";
import { useModal } from "@/context/modal-context";
import { useIntl } from "react-intl";
import { useRouter } from "next/router";

const UserFilterModal = () => {
  const { closeModal } = useModal();
  const intl = useIntl();
  const router = useRouter();

  const { handleSubmit, control, reset } = useForm({
    defaultValues: {
      role: router.query.role || "",
      is_active: router.query.is_active || "",
      is_approved: router.query.is_approved || "",
    },
  });

  const onSubmit = (data) => {
    // Bo'sh qiymatlarni olib tashlaymiz
    const params = new URLSearchParams(router.query);

    Object.keys(data).forEach((key) => {
      if (data[key]) {
        params.set(key, data[key]);
      } else {
        params.delete(key);
      }
    });

    params.set("page", "1"); // Filtr o'zgarganda 1-sahifaga qaytarish

    router.push({ query: Object.fromEntries(params) }, undefined, {
      shallow: true,
    });
    closeModal("USER_FILTER");
  };

  const handleReset = () => {
    reset({ role: "", is_active: "", is_approved: "" });
    const { page, ...rest } = router.query; // Page'dan tashqari barchasini tozalash (ixtiyoriy)
    router.push({ query: { page: 1 } }, undefined, { shallow: true });
    closeModal("USER_FILTER");
  };

  return (
    <div className="p-8">
      <div className="flex items-center gap-4 mb-8">
        <div className="bg-orange-100 p-2 sm:p-4 rounded-3xl text-primary">
          <Filter size={28} />
        </div>
        <div>
          <h2 className="text-xl font-black text-heading">
            {intl.formatMessage({ id: "Filtrlash" })}
          </h2>
          <p className="text-muted text-sm font-medium">
            {intl.formatMessage({
              id: "Ro'yxatni saralash uchun parametrlarni tanlang",
            })}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 gap-5">
          {/* Role Filter */}
          <Controller
            name="role"
            control={control}
            render={({ field }) => (
              <Select
                label="Foydalanuvchi roli"
                options={[
                  { value: "", label: "Barchasi" },
                  { value: "CENTER_ADMIN", label: "Center Admin" },
                  { value: "TEACHER", label: "O'qituvchi" },
                  { value: "STUDENT", label: "O'quvchi" },
                  { value: "GUEST", label: "Mehmon" },
                ]}
                value={field.value}
                onChange={field.onChange}
              />
            )}
          />

          {/* Active Status */}
          <Controller
            name="is_active"
            control={control}
            render={({ field }) => (
              <Select
                label="Holat"
                options={[
                  { value: "", label: "Barchasi" },
                  { value: "true", label: "Faol" },
                  { value: "false", label: "Bloklangan" },
                ]}
                value={field.value}
                onChange={field.onChange}
              />
            )}
          />

          {/* Approved Status */}
          <Controller
            name="is_approved"
            control={control}
            render={({ field }) => (
              <Select
                label="Tasdiqlash holati"
                options={[
                  { value: "", label: "Barchasi" },
                  { value: "true", label: "Tasdiqlangan" },
                  { value: "false", label: "Kutilmoqda" },
                ]}
                value={field.value}
                onChange={field.onChange}
              />
            )}
          />
        </div>

        <div className="flex items-center sm:flex-row flex-col-reverse justify-end gap-3 pt-6 border-t border-gray-100">
          <button
            type="button"
            onClick={handleReset}
            className="flex items-center gap-2 px-6 py-3.5 rounded-2xl font-bold text-muted hover:bg-gray-100 transition-all"
          >
            <RotateCcw size={18} />
            {intl.formatMessage({ id: "Tozalash" })}
          </button>
          <button
            type="submit"
            className="bg-primary text-white font-black px-8 py-3.5 rounded-2xl shadow-xl shadow-orange-200 transition-all active:scale-95 flex items-center gap-2"
          >
            <CheckCircle2 size={18} />
            {intl.formatMessage({ id: "Filtrni qo'llash" })}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UserFilterModal;
