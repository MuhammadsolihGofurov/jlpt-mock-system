import { useForm, Controller } from "react-hook-form";
import { Filter, RotateCcw, CheckCircle2 } from "lucide-react";
import { Select } from "@/components/ui";
import { useModal } from "@/context/modal-context";
import { useIntl } from "react-intl";
import { useRouter } from "next/router";

const ExamFilterModal = () => {
  const { closeModal } = useModal();
  const intl = useIntl();
  const router = useRouter();

  const { handleSubmit, control, reset } = useForm({
    defaultValues: {
      status: router.query.status || "",
    },
  });

  const onSubmit = (data) => {
    const params = new URLSearchParams(router.query);

    if (data.status) {
      params.set("status", data.status);
    } else {
      params.delete("status");
    }

    params.set("page", "1");

    router.push({ query: Object.fromEntries(params) }, undefined, {
      shallow: true,
    });
    closeModal("EXAM_FILTER");
  };

  const handleReset = () => {
    reset({ status: "" });
    const params = new URLSearchParams(router.query);
    params.delete("status");
    params.set("page", "1");

    router.push({ query: Object.fromEntries(params) }, undefined, {
      shallow: true,
    });
    closeModal("EXAM_FILTER");
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <div className="bg-orange-100 p-4 rounded-3xl text-primary">
          <Filter size={28} />
        </div>
        <div>
          <h2 className="text-xl font-black text-heading">
            {intl.formatMessage({ id: "Imtihonlarni saralash" })}
          </h2>
          <p className="text-muted text-sm font-medium">
            {intl.formatMessage({
              id: "Holat bo'yicha kerakli imtihonlarni toping",
            })}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 gap-5">
          {/* Status Filter */}
          <Controller
            name="status"
            control={control}
            render={({ field }) => (
              <Select
                label="Imtihon holati"
                options={[
                  { value: "", label: "Barchasi" },
                  { value: "OPEN", label: "Ochiq (Aktiv)" },
                  { value: "CLOSED", label: "Yopiq (Yakunlangan)" },
                ]}
                value={field.value}
                onChange={field.onChange}
                placeholder="Holatni tanlang"
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

export default ExamFilterModal;
