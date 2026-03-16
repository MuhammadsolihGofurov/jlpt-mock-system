import { AlertCircle } from "lucide-react";

const ExamFooter = ({
  onNext,
  onPrev,
  onSubmit,
  isLastSection,
  loading,
  canPrev,
  isDisabled,
}) => {
  return (
    <footer className="max-h-24 bg-white border-t border-slate-200 px-3 py-2 sm:px-8 flex items-center flex-col sm:flex-row justify-end z-50">
      {/* {canPrev && (
        <div className="flex flex-col">
          <button
            onClick={onPrev}
            className="px-8 py-4 rounded-2xl font-bold text-slate-500 hover:bg-slate-50 transition-all"
          >
            Orqaga
          </button>
        </div>
      )} */}

      <div className="flex sm:flex-row flex-col-reverse items-center gap-1 sm:gap-6">
        {/* Agar barcha savollar yechilmagan bo'lsa ogohlantirish */}
        {isDisabled && !loading && (
          <div className="flex items-center gap-2 text-orange-600 sm:bg-orange-50 smpx-4 sm:py-2 rounded-xl sm:border sm:border-orange-100 ">
            <AlertCircle size={18} />
            <span className="text-xs font-semibold sm:font-black uppercase">
              Barcha savollarni belgilang!
            </span>
          </div>
        )}

        {isLastSection ? (
          <button
            onClick={onSubmit}
            disabled={loading || isDisabled}
            className={`px-12 py-3 sm:py-4 rounded-[1.5rem] font-semibold sm:font-black shadow-xl transition-all active:scale-95 flex items-center gap-3
              ${
                isDisabled || loading
                  ? "bg-slate-200 text-slate-400 cursor-not-allowed shadow-none"
                  : "bg-green-600 hover:bg-green-700 text-white shadow-green-100"
              }`}
          >
            {loading ? "Yuborilmoqda..." : "Imtihonni yakunlash"}
          </button>
        ) : (
          <button
            onClick={onNext}
            disabled={isDisabled}
            className={`px-12 py-3 sm:py-4 rounded-[1.5rem] font-semibold sm:font-black shadow-xl transition-all active:scale-95 flex items-center gap-3
              ${
                isDisabled
                  ? "bg-slate-200 text-slate-400 cursor-not-allowed shadow-none"
                  : "bg-primary hover:bg-primary-dark text-white shadow-orange-100"
              }`}
          >
            Keyingi bo'lim
          </button>
        )}
      </div>
    </footer>
  );
};

export default ExamFooter;
