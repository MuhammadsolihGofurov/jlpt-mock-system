import { useForm, Controller } from "react-hook-form";
import { Filter, RotateCcw, CheckCircle2 } from "lucide-react";
import { Select } from "@/components/ui";
import { useModal } from "@/context/modal-context";
import { useIntl } from "react-intl";
import { useRouter } from "next/router";

const QuizFilterModal = () => {
  const { closeModal } = useModal();
  const intl = useIntl();
  const router = useRouter();

  const { handleSubmit, control, reset } = useForm({
    defaultValues: {
      is_active: router.query.is_active || "",
    },
  });

  const onSubmit = (data) => {
    const params = new URLSearchParams(router.query);

    if (data.is_active !== "") {
      params.set("is_active", data.is_active);
    } else {
      params.delete("is_active");
    }

    params.set("page", "1"); // Filtr o'zgarganda birinchi sahifaga qaytish

    router.push({ query: Object.fromEntries(params) }, undefined, {
      shallow: true,
    });
    closeModal("QUIZ_FILTER");
  };

  const handleReset = () => {
    reset({ is_active: "" });
    const params = new URLSearchParams(router.query);
    params.delete("is_active");
    params.set("page", "1");

    router.push({ query: Object.fromEntries(params) }, undefined, {
      shallow: true,
    });
    closeModal("QUIZ_FILTER");
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <div className="bg-orange-100 p-4 rounded-3xl text-primary shadow-sm">
          <Filter size={28} />
        </div>
        <div>
          <h2 className="text-xl font-black text-heading">
            {intl.formatMessage({ id: "Quizlarni saralash" })}
          </h2>
          <p className="text-muted text-sm font-medium">
            {intl.formatMessage({
              id: "Holati bo'yicha kerakli quizlarni toping",
            })}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 gap-5">
          {/* Status Filter */}
          <Controller
            name="is_active"
            control={control}
            render={({ field }) => (
              <Select
                label={intl.formatMessage({ id: "Quiz holati" })}
                options={[
                  { value: "", label: intl.formatMessage({ id: "Barchasi" }) },
                  { value: "true", label: intl.formatMessage({ id: "Faol (Active)" }) },
                  { value: "false", label: intl.formatMessage({ id: "Noaktiv (Inactive)" }) },
                ]}
                value={field.value}
                onChange={field.onChange}
                placeholder={intl.formatMessage({ id: "Holatni tanlang" })}
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

export default QuizFilterModal;
