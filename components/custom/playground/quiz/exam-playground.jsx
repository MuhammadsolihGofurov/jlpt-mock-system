import React, { useState, useEffect, useRef, useMemo } from "react";
import { toast } from "react-toastify";
import { authAxios } from "@/utils/axios";
import { useIntl } from "react-intl";
import { AlertCircle, Timer, Flag, Maximize2, X } from "lucide-react";
import { useSelector } from "react-redux";

const QuizExamPlayground = ({ examData, onFinish }) => {
    const intl = useIntl();
    const mainRef = useRef(null);
    const { user } = useSelector((state) => state.auth);

    const quiz = examData?.item_data;
    const questions = quiz?.questions || [];
    const totalSeconds = quiz?.default_question_duration
        ? quiz.default_question_duration * questions.length
        : 30 * 60;

    const [answers, setAnswers] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [timeLeft, setTimeLeft] = useState(totalSeconds);
    const hasSubmitted = useRef(false);

    const isAllAnswered = useMemo(() => {
        if (!questions.length) return false;
        return questions.every(
            (q) => answers.hasOwnProperty(q.id) && answers[q.id] !== undefined && answers[q.id] !== null
        );
    }, [questions, answers]);

    const answeredCount = useMemo(
        () => questions.filter((q) => answers.hasOwnProperty(q.id) && answers[q.id] !== null).length,
        [questions, answers]
    );

    // Timer
    useEffect(() => {
        if (timeLeft <= 0) return;
        const timer = setInterval(() => {
            setTimeLeft((prev) => prev - 1);
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    // Vaqt tugaganda submit
    useEffect(() => {
        if (timeLeft === 0 && !hasSubmitted.current) {
            handleSubmit(true);
        }
    }, [timeLeft]);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    };

    const isLowTime = timeLeft < 300 && timeLeft > 0;

    const handleSelectOption = (questionId, optionIndex) => {
        setAnswers((prev) => ({ ...prev, [questionId]: optionIndex }));
    };

    const handleSubmit = async (isAuto = false) => {
        if (hasSubmitted.current) return;
        hasSubmitted.current = true;

        if (isAuto && Object.keys(answers).length === 0) {
            if (onFinish) onFinish(isAuto);
            return;
        }

        try {
            setIsSubmitting(true);
            await authAxios.post("/submissions/submit-homework/", {
                submission_id: examData.submission_id,
                answers: answers,
            });
            toast.success(intl.formatMessage({ id: "Quiz muvaffaqiyatli yakunlandi!" }));
            if (onFinish) onFinish(isAuto);
        } catch (error) {
            toast.error(intl.formatMessage({ id: "Yuborishda xato yuz berdi" }));
            if (isAuto && onFinish) onFinish(isAuto);
        } finally {
            setIsSubmitting(false);
        }
    };

    const userInitial = user?.full_name?.[0] || user?.first_name?.[0] || "U";

    if (!quiz) {
        return (
            <div className="fixed inset-0 flex items-center justify-center bg-white">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 bg-slate-50 flex flex-col overflow-hidden select-none">

            {/* Header */}
            <header className="max-h-20 py-2 bg-white border-b border-slate-200 px-6 flex items-center justify-between z-50 shadow-sm">
                <div className="sm:flex hidden items-center gap-4">
                    <div className="bg-primary/10 p-2.5 rounded-2xl">
                        <Flag className="text-primary" size={24} />
                    </div>
                    <div>
                        <h1 className="text-lg font-black text-heading leading-none uppercase tracking-tight">
                            {quiz.title}
                        </h1>
                        <p className="text-sm text-muted font-bold mt-1 uppercase opacity-70">
                            {answeredCount} / {questions.length} {intl.formatMessage({ id: "ta javob berildi" })}
                        </p>
                    </div>
                </div>

                <div className={`flex items-center gap-3 px-6 py-2.5 rounded-2xl transition-all duration-500 border ${
                    isLowTime
                        ? "bg-red-50 text-red-600 border-red-100 animate-pulse shadow-lg shadow-red-100"
                        : "bg-slate-50 text-slate-700 border-slate-100"
                }`}>
                    <Timer size={24} className={isLowTime ? "text-red-600" : "text-primary"} />
                    <span className="text-xl sm:text-2xl font-mono font-black tabular-nums">
                        {formatTime(timeLeft)}
                    </span>
                    {isLowTime && <AlertCircle size={18} className="text-red-600 hidden md:block" />}
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={() => {
                            if (!document.fullscreenElement) {
                                document.documentElement.requestFullscreen();
                            } else {
                                document.exitFullscreen();
                            }
                        }}
                        className="p-3 text-slate-400 hover:text-primary hover:bg-orange-50 rounded-xl transition-all"
                    >
                        <Maximize2 size={20} />
                    </button>
                    <div className="h-10 w-[1px] bg-slate-200 mx-2 hidden md:block" />
                    <div className="hidden md:flex items-center gap-3 bg-slate-50 p-1.5 pr-4 rounded-2xl border border-slate-100">
                        <div className="w-9 h-9 rounded-xl bg-primary text-white flex items-center justify-center font-black shadow-lg shadow-orange-200 uppercase">
                            {userInitial}
                        </div>
                        <div className="flex flex-col">
                            <span className="text-sm font-black text-slate-700 leading-none">
                                {user?.full_name || user?.first_name || "Foydalanuvchi"}
                            </span>
                            <span className="text-[10px] font-bold text-slate-400 uppercase mt-0.5">
                                ID: {user?.id?.toString().slice(0, 8) || "N/A"}
                            </span>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main */}
            <div className="flex-1 flex overflow-hidden">
                <main
                    ref={mainRef}
                    className="flex-1 overflow-y-auto p-6 md:p-10 bg-white shadow-inner scroll-smooth"
                >
                    <div className="max-w-4xl mx-auto">
                        <h2 className="text-lg sm:text-2xl font-black text-slate-800 mb-6 border-b pb-4 flex items-center justify-between">
                            <span>{quiz.title}</span>
                            <span className="text-sm font-bold bg-slate-100 px-4 py-1 rounded-full text-slate-500">
                                Quiz
                            </span>
                        </h2>

                        <div className="space-y-8">
                            {questions.map((q, idx) => {
                                const isAnswered = answers.hasOwnProperty(q.id) && answers[q.id] !== null;
                                return (
                                    <div
                                        key={q.id}
                                        className={`rounded-[2rem] border transition-all duration-300 overflow-hidden ${
                                            isAnswered
                                                ? "bg-white border-primary shadow-xl shadow-orange-50"
                                                : "bg-white border-slate-200 shadow-sm"
                                        }`}
                                    >
                                        <div className="p-6 sm:p-8">
                                            <div className="flex gap-4 mb-5">
                                                <span className="w-9 h-9 shrink-0 rounded-xl bg-slate-100 flex items-center justify-center font-black text-slate-500 text-sm">
                                                    {idx + 1}
                                                </span>
                                                <div className="flex-1">
                                                    <p className="text-slate-800 text-base md:text-lg font-semibold leading-relaxed">
                                                        {q.text}
                                                    </p>
                                                </div>
                                            </div>

                                            {q.image && (
                                                <img
                                                    src={q.image}
                                                    alt={`Savol ${idx + 1}`}
                                                    className="mb-5 max-h-[40vh] w-auto mx-auto block rounded-xl border border-slate-100 object-contain"
                                                />
                                            )}

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                {q.options.map((option, oIdx) => {
                                                    const isSelected = answers[q.id] === oIdx;
                                                    const optionLabel = ["A", "B", "C", "D"][oIdx] || oIdx + 1;
                                                    return (
                                                        <button
                                                            key={oIdx}
                                                            onClick={() => handleSelectOption(q.id, oIdx)}
                                                            className={`p-4 text-left rounded-xl border-2 transition-all flex items-center gap-4 ${
                                                                isSelected
                                                                    ? "border-primary bg-orange-50"
                                                                    : "border-slate-100 bg-white hover:border-slate-300"
                                                            }`}
                                                        >
                                                            <span className={`w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center border font-bold text-sm ${
                                                                isSelected
                                                                    ? "bg-primary border-primary text-white"
                                                                    : "border-slate-200 text-slate-400 bg-slate-50"
                                                            }`}>
                                                                {optionLabel}
                                                            </span>
                                                            <span className="font-medium text-sm text-slate-700">
                                                                {typeof option === "string" ? option : option?.text || ""}
                                                            </span>
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </main>
            </div>

            {/* Footer */}
            <footer className="bg-white border-t border-slate-200 px-4 py-3 sm:px-8 flex items-center justify-between z-50">
                <div className="flex items-center gap-2 text-slate-500 text-sm font-medium">
                    <span className="font-black text-slate-800">{answeredCount}</span>
                    <span>/</span>
                    <span>{questions.length}</span>
                    <span className="hidden sm:inline">{intl.formatMessage({ id: "ta savol javoblandi" })}</span>
                </div>

                <div className="flex items-center gap-4">
                    {!isAllAnswered && !isSubmitting && (
                        <div className="hidden sm:flex items-center gap-2 text-orange-600 bg-orange-50 px-4 py-2 rounded-xl border border-orange-100">
                            <AlertCircle size={16} />
                            <span className="text-xs font-black uppercase">
                                {intl.formatMessage({ id: "Barcha savollarni belgilang!" })}
                            </span>
                        </div>
                    )}
                    <button
                        onClick={() => handleSubmit(false)}
                        disabled={isSubmitting || !isAllAnswered}
                        className={`px-8 sm:px-12 py-3 sm:py-4 rounded-[1.5rem] font-black shadow-xl transition-all active:scale-95 ${
                            isAllAnswered && !isSubmitting
                                ? "bg-green-600 hover:bg-green-700 text-white shadow-green-100"
                                : "bg-slate-200 text-slate-400 cursor-not-allowed shadow-none"
                        }`}
                    >
                        {isSubmitting
                            ? intl.formatMessage({ id: "Yuborilmoqda..." })
                            : intl.formatMessage({ id: "Quizni yakunlash" })
                        }
                    </button>
                </div>
            </footer>
        </div>
    );
};

export default QuizExamPlayground;
