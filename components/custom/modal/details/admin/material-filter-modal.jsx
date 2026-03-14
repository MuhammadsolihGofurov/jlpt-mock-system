import { useForm, Controller } from "react-hook-form";
import { Filter, RotateCcw, CheckCircle2 } from "lucide-react";
import { Select } from "@/components/ui";
import { useModal } from "@/context/modal-context";
import { useIntl } from "react-intl";
import { useRouter } from "next/router";

const MaterialFilterModal = () => {
  const { closeModal } = useModal();
  const intl = useIntl();
  const router = useRouter();

  // URL'dan joriy filtrlarni default qiymat sifatida olamiz
  const { handleSubmit, control, reset } = useForm({
    defaultValues: {
      file_type: router.query.file_type || "",
      is_public: router.query.is_public || "",
    },
  });

  const onSubmit = (data) => {
    const params = new URLSearchParams(router.query);

    // Tanlangan filtrlarni URL'ga yozish
    Object.keys(data).forEach((key) => {
      if (data[key]) {
        params.set(key, data[key]);
      } else {
        params.delete(key);
      }
    });

    params.set("page", "1"); // Filtr o'zgarganda birinchi sahifaga qaytarish

    router.push({ query: Object.fromEntries(params) }, undefined, {
      shallow: true,
    });
    closeModal("MATERIAL_FILTER");
  };

  const handleReset = () => {
    reset({ file_type: "", is_public: "" });
    // Search'dan boshqa barcha filtrlarni tozalash (ixtiyoriy)
    const { search } = router.query;
    router.push({ query: { page: 1, ...(search && { search }) } }, undefined, { 
      shallow: true 
    });
    closeModal("MATERIAL_FILTER");
  };

  return (
    <div className="p-8">
      {/* Header Section */}
      <div className="flex items-center gap-4 mb-8">
        <div className="bg-orange-100 p-4 rounded-3xl text-primary">
          <Filter size={28} />
        </div>
        <div>
          <h2 className="text-xl font-black text-heading">
            {intl.formatMessage({ id: "Materiallarni saralash" })}
          </h2>
          <p className="text-muted text-sm font-medium italic">
            {intl.formatMessage({ id: "Fayl turi va ko'rinish holati bo'yicha filtrlang" })}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 gap-5">
          {/* File Type Filter */}
          <Controller
            name="file_type"
            control={control}
            render={({ field }) => (
              <Select
                label="Fayl turi"
                options={[
                  { value: "", label: "Barchasi" },
                  { value: "PDF", label: "PDF Hujjatlar" },
                  { value: "AUDIO", label: "Audio materiallar" },
                  { value: "IMAGE", label: "Rasmlar" },
                  { value: "DOCX", label: "Word hujjatlar" },
                  { value: "OTHER", label: "Boshqalar" },
                ]}
                value={field.value}
                onChange={field.onChange}
                isLabel={false}
              />
            )}
          />

          {/* Privacy Status Filter */}
          <Controller
            name="is_public"
            control={control}
            render={({ field }) => (
              <Select
                label="Kirish holati"
                options={[
                  { value: "", label: "Barchasi" },
                  { value: "true", label: "Ochiq (Public)" },
                  { value: "false", label: "Yopiq (Private)" },
                ]}
                value={field.value}
                onChange={field.onChange}
              />
            )}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center sm:flex-row flex-col-reverse justify-end gap-3 pt-6 border-t border-gray-100">
          <button
            type="button"
            onClick={handleReset}
            className="flex items-center gap-2 px-6 py-3.5 rounded-2xl font-bold text-muted hover:bg-gray-100 transition-all w-full sm:w-auto justify-center"
          >
            <RotateCcw size={18} />
            {intl.formatMessage({ id: "Tozalash" })}
          </button>
          
          <button
            type="submit"
            className="bg-primary text-white font-black px-8 py-3.5 rounded-2xl shadow-xl shadow-orange-200 transition-all active:scale-95 flex items-center gap-2 w-full sm:w-auto justify-center"
          >
            <CheckCircle2 size={18} />
            {intl.formatMessage({ id: "Filtrni qo'llash" })}
          </button>
        </div>
      </form>
    </div>
  );
};

export default MaterialFilterModal;