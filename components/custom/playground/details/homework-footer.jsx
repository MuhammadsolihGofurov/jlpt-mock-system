import React from "react";
import { AlertCircle, CheckCircle, ChevronRight } from "lucide-react";
import { useIntl } from "react-intl";

const HomeworkFooter = ({ onNext, onPrev, onFinish, isLast, canPrev, hasAnswered }) => {
    return (
        <footer className="p-4 bg-white border-t flex justify-between items-center bg-white/80 backdrop-blur-md">
            <button
                onClick={onPrev}
                disabled={!canPrev}
                className="px-6 py-3 text-slate-400 disabled:opacity-0"
            >
                Back
            </button>

            {isLast ? (
                <button
                    onClick={onFinish}
                    className="bg-emerald-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-emerald-700 transition-all"
                >
                    Finish Quiz
                </button>
            ) : (
                <button
                    onClick={onNext}
                    disabled={!hasAnswered}
                    className="bg-primary text-white px-8 py-3 rounded-xl font-bold disabled:bg-slate-200 disabled:text-slate-400 transition-all"
                >
                    Next Question
                </button>
            )}
        </footer>
    );
};

export default HomeworkFooter;