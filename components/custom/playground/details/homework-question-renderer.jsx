import React from "react";
import { CheckCircle2, XCircle, Loader2, Triangle, Square, Circle, Pentagon } from "lucide-react";
import { useIntl } from "react-intl";

// Kahoot uslubidagi ikonka va ranglar
const VARIANT_THEMES = [
    { icon: <Triangle className="fill-white" size={24} />, color: "rose", bg: "bg-rose-500/30", border: "border-rose-400", glow: "shadow-rose-500/20" },
    { icon: <Pentagon className="fill-white" size={24} />, color: "blue", bg: "bg-blue-500/30", border: "border-blue-400", glow: "shadow-blue-500/20" },
    { icon: <Circle className="fill-white" size={24} />, color: "amber", bg: "bg-amber-500/30", border: "border-amber-400", glow: "shadow-amber-500/20" },
    { icon: <Square className="fill-white" size={24} />, color: "emerald", bg: "bg-emerald-500/30", border: "border-emerald-400", glow: "shadow-emerald-500/20" },
];

const HomeworkQuestionRenderer = ({ question, index, onSelect, result, isChecking, isTimeOut }) => {
    if (!question) return null;
    const intl = useIntl();

    return (
        <div className="w-full h-full flex flex-col">
            {/* SAVOL QISMI */}
            <div className="mb-8 text-center">
                <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-6">
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                    <span className="text-[12px] font-black tracking-[0.2em] uppercase uppercase text-white/80">{intl.formatMessage({ id: "Savol" })} {index + 1}</span>
                </div>
                <h2
                    className="text-2xl md:text-4xl font-black text-white leading-tight drop-shadow-xl"
                    dangerouslySetInnerHTML={{ __html: question.text }}
                />
            </div>

            {/* VARIANTLAR - KAHOOT STYLE 2x2 GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1 pb-4">
                {question.options.map((option, idx) => {
                    const theme = VARIANT_THEMES[idx % 4];
                    const isSelected = result?.idx === idx;
                    const isCorrect = result?.correctIdx === idx;
                    const isWrong = isSelected && !result?.isCorrect;
                    const isDisabled = !!result || isChecking || isTimeOut;

                    // Dinamik klasslarni aniqlash
                    let stateStyles = `${theme.bg} ${theme.border} hover:bg-white/20`;
                    if (isCorrect) stateStyles = "bg-emerald-500 border-emerald-300 shadow-[0_0_30px_rgba(16,185,129,0.4)] scale-[1.02] z-10";
                    if (isWrong) stateStyles = "bg-rose-600 border-rose-300 opacity-100 shadow-[0_0_30px_rgba(225,29,72,0.4)]";
                    if (isDisabled && !isCorrect && !isWrong) stateStyles = "bg-black/40 border-white/10 opacity-40 grayscale-[0.5]";

                    return (
                        <button
                            key={idx}
                            disabled={isDisabled}
                            onClick={() => onSelect(question.id, idx)}
                            className={`
                relative group flex items-center p-5 md:p-7 rounded-[2rem] border-2 backdrop-blur-xl
                transition-all duration-300 text-left
                ${stateStyles}
                ${!isDisabled && "hover:-translate-y-1 active:scale-95"}
              `}
                        >
                            {/* SHAKL/IKONKA */}
                            <div className={`
                w-12 h-12 md:w-14 md:h-14 rounded-2xl flex items-center justify-center mr-4 transition-transform
                ${isCorrect || isWrong ? 'bg-white/20 scale-110' : 'bg-white/10 border border-white/20'}
                group-hover:rotate-12
              `}>
                                {theme.icon}
                            </div>

                            {/* VARIANT MATNI */}
                            <span className={`flex-1 font-bold text-lg md:text-xl drop-shadow-sm ${isCorrect || isWrong ? 'text-white' : 'text-white/90'}`}>
                                {option.text}
                            </span>

                            {/* JAVOB HOLATI */}
                            <div className="absolute top-4 right-4">
                                {isCorrect && <CheckCircle2 className="text-white animate-bounce" size={32} />}
                                {isWrong && <XCircle className="text-white animate-shake" size={32} />}
                                {isSelected && isChecking && <Loader2 className="animate-spin text-white" size={28} />}
                            </div>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default HomeworkQuestionRenderer;