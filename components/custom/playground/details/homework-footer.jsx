import React from "react";
import { ChevronLeft, ChevronRight, CheckCircle } from "lucide-react";

const HomeworkFooter = ({ onNext, onPrev, onFinish, isLastSection, canPrev, isDisabled }) => {
    return (
        <footer className="bg-white border-t border-slate-100 p-4 md:p-6 mt-auto">
            <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
                <button
                    onClick={onPrev}
                    disabled={!canPrev}
                    className="flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-slate-400 hover:text-slate-900 disabled:opacity-30 transition-all"
                >
                    <ChevronLeft size={20} />
                    Oldingisi
                </button>

                {isLastSection ? (
                    <button
                        onClick={onFinish}
                        disabled={isDisabled}
                        className="flex items-center gap-3 px-8 py-3 bg-emerald-600 text-white rounded-2xl font-black hover:bg-emerald-500 transition-all shadow-lg shadow-emerald-100 disabled:bg-slate-200 disabled:shadow-none"
                    >
                        Tugatish
                        <CheckCircle size={20} />
                    </button>
                ) : (
                    <button
                        onClick={onNext}
                        className="flex items-center gap-3 px-8 py-3 bg-slate-900 text-white rounded-2xl font-black hover:bg-slate-800 transition-all shadow-lg shadow-slate-200"
                    >
                        Keyingisi
                        <ChevronRight size={20} />
                    </button>
                )}
            </div>
        </footer>
    );
};

export default HomeworkFooter;