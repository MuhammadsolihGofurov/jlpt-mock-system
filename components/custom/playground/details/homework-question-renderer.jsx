import React from "react";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";

const HomeworkQuestionRenderer = ({ question, index, onSelect, result, isChecking }) => {
    if (!question) return null;

    return (
        <div className="bg-white p-6 md:p-8 rounded-[2rem] border-2 border-slate-100 shadow-xl">
            <div className="mb-6 text-center">
                <span className="text-primary font-black text-sm uppercase tracking-widest">
                    Question {index + 1}
                </span>
                <h2 className="text-xl md:text-2xl font-bold mt-2 text-slate-800"
                    dangerouslySetInnerHTML={{ __html: question.text }} />
            </div>

            <div className="grid gap-3">
                {question.options.map((option, idx) => {
                    const isSelected = result?.optionIndex === idx;
                    const isCorrect = result?.correctOption === idx;
                    const isWrong = isSelected && !result?.isCorrect;

                    let buttonClass = "border-slate-100 bg-slate-50 hover:border-primary/30";
                    if (result) {
                        if (isCorrect) buttonClass = "border-emerald-500 bg-emerald-50 text-emerald-700";
                        else if (isWrong) buttonClass = "border-red-500 bg-red-50 text-red-700";
                        else buttonClass = "opacity-50 border-slate-100";
                    }

                    return (
                        <button
                            key={idx}
                            disabled={!!result || isChecking}
                            onClick={() => onSelect(question.id, idx)}
                            className={`p-4 rounded-2xl border-2 transition-all flex items-center justify-between group ${buttonClass}`}
                        >
                            <span className="font-bold">{option.text}</span>
                            {result && isCorrect && <CheckCircle2 size={20} className="text-emerald-500" />}
                            {result && isWrong && <XCircle size={20} className="text-red-500" />}
                            {isSelected && isChecking && <Loader2 size={20} className="animate-spin text-primary" />}
                        </button>
                    );
                })}
            </div>

            {result?.feedback && (
                <div className="mt-4 p-4 bg-blue-50 rounded-xl text-sm text-blue-700 italic">
                    {result.feedback}
                </div>
            )}
        </div>
    );
};

export default HomeworkQuestionRenderer;