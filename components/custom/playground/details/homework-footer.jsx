import React from "react";
import { AlertCircle, CheckCircle, ChevronRight } from "lucide-react";
import { useIntl } from "react-intl";

const HomeworkFooter = ({
    onNext,
    onPrev,
    onFinish,
    isLastSection,
    loading,
    canPrev,
    isDisabled,
}) => {
    const intl = useIntl();

    return (
        <footer className="max-h-32 sm:max-h-24 bg-white border-t border-slate-200 px-4 py-4 sm:px-8 flex items-center flex-col sm:flex-row justify-between z-50 mt-auto">
            {/* Chap taraf: Orqaga tugmasi */}
            <div className="flex items-center">
                {canPrev && (
                    <button
                        onClick={onPrev}
                        className="px-6 py-3 rounded-2xl font-bold text-slate-500 hover:bg-slate-50 transition-all active:scale-95"
                    >
                        {intl.formatMessage({ id: "Orqaga" })}
                    </button>
                )}
            </div>

            {/* O'ng taraf: Ogohlantirish va Asosiy tugmalar */}
            <div className="flex sm:flex-row flex-col-reverse items-center gap-3 sm:gap-6 w-full sm:w-auto mt-3 sm:mt-0">

                {/* Shart bajarilmaganda ogohlantirish */}
                {isDisabled && !loading && (
                    <div className="flex items-center gap-2 text-orange-600 sm:bg-orange-50 px-0 sm:px-4 sm:py-2 rounded-xl sm:border sm:border-orange-100">
                        <AlertCircle size={18} />
                        <span className="text-[10px] sm:text-xs font-semibold sm:font-black uppercase tracking-tight">
                            {intl.formatMessage({ id: "Barcha savollarni belgilang!" })}
                        </span>
                    </div>
                )}

                {isLastSection ? (
                    <button
                        onClick={onFinish}
                        disabled={loading || isDisabled}
                        className={`w-full sm:w-auto px-10 py-3 sm:py-4 rounded-[1.5rem] font-semibold sm:font-black shadow-xl transition-all active:scale-95 flex items-center justify-center gap-3
              ${isDisabled || loading
                                ? "bg-slate-200 text-slate-400 cursor-not-allowed shadow-none"
                                : "bg-green-600 hover:bg-green-700 text-white shadow-green-100"
                            }`}
                    >
                        {loading ? (
                            intl.formatMessage({ id: "Saqlanmoqda..." })
                        ) : (
                            <>
                                {intl.formatMessage({ id: "Tugatish" })}
                                <CheckCircle size={20} />
                            </>
                        )}
                    </button>
                ) : (
                    <button
                        onClick={onNext}
                        disabled={isDisabled}
                        className={`w-full sm:w-auto px-10 py-3 sm:py-4 rounded-[1.5rem] font-semibold sm:font-black shadow-xl transition-all active:scale-95 flex items-center justify-center gap-3
              ${isDisabled
                                ? "bg-slate-200 text-slate-400 cursor-not-allowed shadow-none"
                                : "bg-primary hover:bg-orange-600 text-white shadow-orange-100"
                            }`}
                    >
                        {intl.formatMessage({ id: "Keyingi bo'lim" })}
                        <ChevronRight size={20} />
                    </button>
                )}
            </div>
        </footer>
    );
};

export default HomeworkFooter;