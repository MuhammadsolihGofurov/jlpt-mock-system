import React from "react";
import { useIntl } from "react-intl";
import { Headphones } from "lucide-react";

const HomeworkQuestionRenderer = ({ group, onSelect, selectedAnswers, isActiveGroup, isListeningMode }) => {
    const intl = useIntl();

    return (
        <div className={`mb-10 p-6 sm:p-8 rounded-[2.5rem] border transition-all duration-500 bg-white border-primary shadow-xl shadow-orange-50`}>

            <div className="mb-8">
                <div className="flex justify-between items-center mb-4">
                    <span className="bg-primary text-white px-5 py-1.5 rounded-2xl text-sm font-black uppercase">
                        Mondai {group.mondai_number}
                    </span>
                </div>

                <h4 className="text-xl font-black text-slate-800">{group?.title}</h4>
                {group.instruction && (
                    <div className="text-slate-500 font-medium mt-2 italic"
                        dangerouslySetInnerHTML={{ __html: group.instruction }} />
                )}

                {/* Audio Player - Foydalanuvchi boshqaruvi bilan */}
                {group.audio_file && (
                    <div className="mt-6 p-4 bg-orange-50 rounded-3xl border border-orange-100 flex flex-col gap-3">
                        <div className="flex items-center gap-2 text-primary font-bold text-sm">
                            <Headphones size={18} />
                            {intl.formatMessage({ id: "Audioni tinglang" })}
                        </div>
                        <audio
                            src={group.audio_file}
                            controls
                            className="w-full h-10 accent-primary"
                        />
                    </div>
                )}

                {group.image && (
                    <div className="mt-6 rounded-3xl overflow-hidden border-4 border-slate-50">
                        <img src={group.image} alt="task" className="w-full object-cover" />
                    </div>
                )}

                {group.reading_text && (
                    <div className="mt-6 p-6 bg-slate-50 rounded-3xl text-slate-700 leading-relaxed text-lg"
                        dangerouslySetInnerHTML={{ __html: group.reading_text }} />
                )}
            </div>

            <div className="space-y-8">
                {group.questions?.map((q, i) => (
                    <div key={q.id} className="border-t pt-8 first:border-t-0 first:pt-0">
                        <div className="text-slate-800 mb-5 text-lg flex gap-3">
                            <span className="font-black text-primary">{q.question_number || i + 1}.</span>
                            <div dangerouslySetInnerHTML={{ __html: q.text }} />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {q.options.map((option, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => onSelect(q.id, idx)}
                                    className={`p-5 text-left rounded-2xl border-2 transition-all flex items-center gap-4 group/opt
                    ${selectedAnswers[q.id] === idx
                                            ? "border-primary bg-orange-50 ring-4 ring-orange-100"
                                            : "border-slate-100 hover:border-slate-200 bg-white"}`}
                                >
                                    <span className={`w-10 h-10 rounded-xl flex items-center justify-center border-2 font-black
                    ${selectedAnswers[q.id] === idx ? "bg-primary border-primary text-white" : "border-slate-200 text-slate-400"}`}>
                                        {idx + 1}
                                    </span>
                                    <span className={`font-bold ${selectedAnswers[q.id] === idx ? "text-primary" : "text-slate-600"}`}>
                                        {option.text}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default HomeworkQuestionRenderer;