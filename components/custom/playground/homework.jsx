import React, { useState, useEffect, useCallback } from "react";
import { Timer, ChevronRight, ChevronLeft, Send, CheckCircle2, XCircle } from "lucide-react";
import HomeworkQuestionRenderer from "./details/homework-question-renderer";
import { authAxios } from "@/utils/axios";
import { toast } from "react-toastify";
import { useIntl } from "react-intl";

const HomeworkPlayground = ({ data, onFinish, onBack }) => {
    const itemData = data?.item_data;
    const questions = itemData?.questions || [];
    const [currentIndex, setCurrentIndex] = useState(0);
    const [answers, setAnswers] = useState({});
    const [isChecking, setIsChecking] = useState(false);
    const [timeLeft, setTimeLeft] = useState(itemData?.default_question_duration || 30);
    const intl = useIntl();

    const currentQuestion = questions[currentIndex];
    const totalQuestions = questions.length;
    const progress = ((currentIndex + 1) / totalQuestions) * 100;

    const handleNext = useCallback(() => {
        if (currentIndex < totalQuestions - 1) {
            setCurrentIndex(prev => prev + 1);
            setTimeLeft(itemData?.default_question_duration || 30);
        }
    }, [currentIndex, totalQuestions, itemData]);

    useEffect(() => {
        if (timeLeft <= 0) {
            handleNext();
            return;
        }
        const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
        return () => clearInterval(timer);
    }, [timeLeft, handleNext]);

    const handleSelectOption = async (questionId, optionIndex) => {
        if (answers[questionId] || isChecking) return;

        setIsChecking(true);
        try {
            const res = await authAxios.post("/submissions/check-single-question/", {
                submission_id: data.submission_id,
                question_id: questionId,
                selected_index: optionIndex
            });

            setAnswers(prev => ({
                ...prev,
                [questionId]: {
                    idx: optionIndex,
                    isCorrect: res.data.is_correct,
                    correctIdx: res.data.correct_option_index,
                    feedback: res.data.feedback
                }
            }));
        } catch (error) {
            toast.error("Xato yuz berdi");
        } finally {
            setIsChecking(false);
        }
    };

    const handleFinalSubmit = () => {
        const cleanAnswersMap = {};
        Object.keys(answers).forEach(qId => {
            cleanAnswersMap[qId] = answers[qId].idx;
        });
        onFinish({
            submission_id: data.submission_id,
            answers: cleanAnswersMap
        });
    };

    if (!itemData || questions.length === 0) return null;

    const currentResult = answers[currentQuestion?.id];

    return (
        <div className="fixed inset-0 bg-white flex flex-col z-[100] font-sans h-screen overflow-hidden text-slate-900">
            {/* CLEAN HEADER */}
            <header className="h-16 border-b border-slate-100 px-6 flex items-center relative">
                {/* Back & Title */}
                <div className="flex items-center gap-3 z-10">
                    <button onClick={onBack} className="p-2 hover:bg-slate-50 rounded-xl transition-colors border border-transparent hover:border-slate-200">
                        <ChevronLeft size={20} className="text-slate-600" />
                    </button>
                    <div className="flex flex-col">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter leading-none">{intl.formatMessage({ id: "Lesson" })}</span>
                        <span className="text-xs font-bold text-slate-800 line-clamp-1">{itemData.title}</span>
                    </div>
                </div>

                {/* CENTRAL TIMER - MODERNISED */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className={`flex items-center gap-2 px-4 py-1.5 rounded-full border-2 transition-all duration-300 ${timeLeft < 10
                        ? 'bg-rose-50 border-rose-200 text-rose-600 animate-pulse'
                        : 'bg-slate-50 border-slate-200 text-slate-700'
                        }`}>
                        <Timer size={16} className={timeLeft < 10 ? 'animate-spin-slow' : ''} />
                        <span className="font-mono text-lg font-black tracking-tight">{timeLeft < 10 ? `0${timeLeft}` : timeLeft}s</span>
                    </div>
                </div>

                {/* PROGRESS INFO */}
                <div className="ml-auto flex items-center gap-4 z-10">
                    <div className="hidden md:flex flex-col items-end">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{intl.formatMessage({ id: "Progress" })}</span>
                        <span className="text-xs font-bold">{currentIndex + 1} / {totalQuestions}</span>
                    </div>
                    <div className="w-12 h-12 relative flex items-center justify-center">
                        <svg className="w-full h-full transform -rotate-90">
                            <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="3" fill="transparent" className="text-slate-100" />
                            <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="3" fill="transparent" strokeDasharray={125.6} strokeDashoffset={125.6 - (125.6 * progress) / 100} className="text-slate-900 transition-all duration-500" strokeLinecap="round" />
                        </svg>
                        <span className="absolute text-[9px] font-black">{Math.round(progress)}%</span>
                    </div>
                </div>
            </header>

            {/* MAIN CONTENT */}
            <main className="flex-1 flex flex-col items-center justify-center p-4 md:p-8">
                <div className="w-full max-w-2xl">

                    {/* QUESTION RENDERER */}
                    <div className="mb-6">
                        <HomeworkQuestionRenderer
                            question={currentQuestion}
                            index={currentIndex}
                            onSelect={handleSelectOption}
                            result={currentResult}
                            isChecking={isChecking}
                            showLetters={true} // Component ichida harflarni chiqarish uchun
                        />
                    </div>

                    {/* INTERACTIVE FEEDBACK & NAVIGATION - INLINE */}
                    <div className="min-h-[80px]">
                        {currentResult && (
                            <div className={`p-4 rounded-2xl flex items-center justify-between border-2 transition-all animate-in zoom-in-95 duration-300 ${currentResult.isCorrect
                                ? 'bg-emerald-50 border-emerald-100 text-emerald-800'
                                : 'bg-rose-50 border-rose-100 text-rose-800'
                                }`}>
                                <div className="flex items-center gap-3">
                                    <div className={`p-2 rounded-xl ${currentResult.isCorrect ? 'bg-emerald-500' : 'bg-rose-500'} text-white shadow-lg`}>
                                        {currentResult.isCorrect ? <CheckCircle2 size={20} /> : <XCircle size={20} />}
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-sm font-black uppercase tracking-tight">
                                            {currentResult.isCorrect ? "Barakalla!" : "Diqqatli bo'ling!"}
                                        </span>
                                        {!currentResult.isCorrect && (
                                            <span className="text-xs font-bold opacity-80">
                                                {intl.formatMessage({ id: "To'g'ri javob" })}: {String.fromCharCode(65 + currentResult.correctIdx)}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {currentIndex === totalQuestions - 1 ? (
                                    <button
                                        onClick={handleFinalSubmit}
                                        className="px-8 py-3 bg-slate-900 text-white rounded-xl text-sm font-black hover:bg-black transition-all shadow-xl active:scale-95 flex items-center gap-2"
                                    >
                                        {intl.formatMessage({ id: "Yakunlash" })} <Send size={16} />
                                    </button>
                                ) : (
                                    <button
                                        onClick={handleNext}
                                        className={`px-8 py-3 rounded-xl text-sm font-black text-white transition-all shadow-xl active:scale-95 flex items-center gap-2 ${currentResult.isCorrect ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-rose-600 hover:bg-rose-700'
                                            }`}
                                    >
                                        {intl.formatMessage({ id: "Keyingisi" })} <ChevronRight size={18} />
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </main>

            {/* STYLING NOTE: A,B,C,D harflari HomeworkQuestionRenderer ichida 
                har bir option buttonining ichiga: 
                <span className="w-8 h-8 rounded-lg border flex items-center justify-center font-bold mr-3">A</span>
                ko'rinishida qo'shilishi kerak. 
            */}
        </div>
    );
};

export default HomeworkPlayground;