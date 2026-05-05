import React, { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import { authAxios } from "@/utils/axios";
import { useIntl } from "react-intl";
import { Timer, Flag, Maximize2, ChevronRight, CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { useSelector } from "react-redux";

const QuizExamPlayground = ({ examData, onFinish }) => {
    const intl = useIntl();
    const { user } = useSelector((state) => state.auth);

    const quiz = examData?.item_data;
    const questions = quiz?.questions || [];
    const duration = quiz?.default_question_duration || 30;

    const [currentIndex, setCurrentIndex] = useState(0);
    const [answers, setAnswers] = useState({});
    const [timeLeft, setTimeLeft] = useState(duration);
    const [isChecking, setIsChecking] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const currentQuestion = questions[currentIndex];
    const currentResult = answers[currentQuestion?.id];
    const isAnswered = !!currentResult;
    const isTimedOut = timeLeft === 0;
    const isLastQuestion = currentIndex === questions.length - 1;
    const answeredCount = Object.values(answers).filter(a => a.isCorrect !== undefined).length;

    // BUG 1 FIX: savol o'zgarganda ham timeLeft, ham isChecking ni reset qilamiz.
    // Avval faqat timeLeft reset bo'lardi → isChecking=true qolardi → keyingi savolda optionlar disabled!
    useEffect(() => {
        setTimeLeft(duration);
        setIsChecking(false);
    }, [currentIndex, duration]);

    // Timer tick - faqat javob berilmagan va vaqt tugamagan holda ishlaydi
    useEffect(() => {
        if (isAnswered || timeLeft <= 0) return;
        const timer = setInterval(() => {
            setTimeLeft((prev) => prev - 1);
        }, 1000);
        return () => clearInterval(timer);
    }, [timeLeft, isAnswered]);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    };

    const timerPercent = (timeLeft / duration) * 100;
    const isLowTime = timeLeft <= 5 && timeLeft > 0;

    const checkSingleQuestion = useCallback(async (questionId, selectedIndex) => {
        const payload = {
            submission_id: examData.submission_id,
            question_id: questionId,
        };
        if (typeof selectedIndex === "number") payload.selected_index = selectedIndex;
        const res = await authAxios.post("/submissions/check-single-question/", payload);
        return res.data;
    }, [examData?.submission_id]);

    // Vaqt tugaganda: xuddi noto'g'ri javob bosgandek checkSingleQuestion chaqiramiz.
    // selected_index=99 → hech qachon to'g'ri bo'lmaydi (0 ball) → lekin backend
    // correct_option_index qaytaradi → UI da to'g'ri javob yashil ko'rinadi.
    // answers da idx=null saqlaymiz → hech qaysi option "tanlangan" ko'rinmaydi.
    useEffect(() => {
        const qId = currentQuestion?.id;
        if (!qId) return;
        if (timeLeft !== 0) return;
        if (answers[qId] || isChecking || isSubmitting) return;

        let cancelled = false;
        (async () => {
            setIsChecking(true);
            try {
                const data = await checkSingleQuestion(qId, 0);
                if (cancelled) return;
                setAnswers((prev) => ({
                    ...prev,
                    [qId]: {
                        idx: null,                  // hech qaysi option "user tanlagan" ko'rinmaydi
                        isCorrect: false,           // timeout = 0 ball
                        correctIdx: data.correct_option_index,  // to'g'ri javobni ko'rsatish uchun
                    },
                }));
            } catch {
                if (!cancelled) {
                    setAnswers((prev) => ({
                        ...prev,
                        [qId]: prev[qId] || { idx: null, isCorrect: false, correctIdx: null },
                    }));
                }
            } finally {
                if (!cancelled) setIsChecking(false);
            }
        })();

        return () => { cancelled = true; };
    }, [timeLeft, currentQuestion?.id, answers, isChecking, isSubmitting, checkSingleQuestion]);

    const handleSelectOption = async (questionId, optionIndex) => {
        if (isAnswered || isChecking || isTimedOut) return;
        setIsChecking(true);
        try {
            const data = await checkSingleQuestion(questionId, optionIndex);
            setAnswers((prev) => ({
                ...prev,
                [questionId]: {
                    idx: optionIndex,
                    isCorrect: data.is_correct,
                    correctIdx: data.correct_option_index,
                },
            }));
        } catch {
            toast.error(intl.formatMessage({ id: "Yuborishda xato yuz berdi" }));
        } finally {
            setIsChecking(false);
        }
    };

    const handleNext = useCallback(async () => {
        if (isLastQuestion) {
            setIsSubmitting(true);
            try {
                await Promise.all(
                    (questions || []).map(async (q) => {
                        if (!q?.id || answers[q.id]) return;
                        try {
                            const data = await checkSingleQuestion(q.id, 0);
                            setAnswers((prev) => ({
                                ...prev,
                                [q.id]: prev[q.id] || {
                                    idx: null,
                                    isCorrect: false,
                                    correctIdx: data.correct_option_index,
                                },
                            }));
                        } catch {}
                    })
                );

                await authAxios.post("/submissions/submit-homework/", {
                    submission_id: examData.submission_id,
                    answers: {},
                });
                toast.success(intl.formatMessage({ id: "Quiz muvaffaqiyatli yakunlandi!" }));
                if (onFinish) onFinish(false);
            } catch {
                toast.error(intl.formatMessage({ id: "Yuborishda xato yuz berdi" }));
                if (onFinish) onFinish(false);
            } finally {
                setIsSubmitting(false);
            }
        } else {
            setCurrentIndex((prev) => prev + 1);
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
    }, [isLastQuestion, answers, examData?.submission_id, onFinish, intl, questions, checkSingleQuestion]);

    const userInitial = user?.full_name?.[0] || user?.first_name?.[0] || "U";

    if (!quiz) {
        return (
            <div className="fixed inset-0 flex items-center justify-center bg-white">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
            </div>
        );
    }

    // Tugma holati:
    // - isChecking: to'g'ri javobni kutish (timeout auto-check yoki option check)
    // - isSubmitting: yakunlash so'rovi yuborilmoqda
    // - isAnswered: javob berilgan → "Keyingi savol" yoki "Quizni yakunlash"
    // - !isAnswered && timer yuribdi: "O'tkazib yuborish" (skip)
    const isNextDisabled = (isChecking && !isTimedOut) || isSubmitting;

    const nextButtonLabel = () => {
        if (isSubmitting) return <span className="animate-pulse">{intl.formatMessage({ id: "Yuborilmoqda..." })}</span>;
        if (isChecking && !isTimedOut) return (
            <span className="flex items-center gap-2">
                <Loader2 size={18} className="animate-spin" />
                {intl.formatMessage({ id: "Tekshirilmoqda..." })}
            </span>
        );
        if (isLastQuestion) return intl.formatMessage({ id: "Quizni yakunlash" });
        if (isAnswered) return (
            <>
                {intl.formatMessage({ id: "Keyingi savol" })}
                <ChevronRight size={20} />
            </>
        );
        // Javob berilmagan, timer hali yuribdi → skip
        return (
            <>
                {intl.formatMessage({ id: "O'tkazib yuborish" })}
                <ChevronRight size={20} />
            </>
        );
    };

    return (
        <div className="fixed inset-0 bg-slate-50 flex flex-col overflow-hidden select-none">

            {/* Header */}
            <header className="bg-white border-b border-slate-200 px-6 py-3 flex items-center justify-between z-50 shadow-sm">

                {/* Chap: sarlavha + progress */}
                <div className="sm:flex hidden items-center gap-4">
                    <div className="bg-primary/10 p-2.5 rounded-2xl">
                        <Flag className="text-primary" size={22} />
                    </div>
                    <div>
                        <h1 className="text-base font-black text-heading leading-none uppercase tracking-tight line-clamp-1 max-w-[200px]">
                            {quiz.title}
                        </h1>
                        <p className="text-xs text-muted font-bold mt-1 uppercase opacity-70">
                            {currentIndex + 1} / {questions.length} {intl.formatMessage({ id: "savol" })}
                        </p>
                    </div>
                </div>

                {/* O'rta: Timer */}
                <div className={`flex items-center gap-3 px-6 py-2.5 rounded-2xl transition-all duration-300 border ${
                    isLowTime
                        ? "bg-red-50 text-red-600 border-red-200 animate-pulse shadow-lg shadow-red-100"
                        : isTimedOut
                        ? "bg-slate-100 text-slate-400 border-slate-200"
                        : "bg-slate-50 text-slate-700 border-slate-100"
                }`}>
                    <Timer size={22} className={isLowTime ? "text-red-500" : isTimedOut ? "text-slate-400" : "text-primary"} />
                    <span className="text-xl sm:text-2xl font-mono font-black tabular-nums">
                        {formatTime(timeLeft)}
                    </span>
                </div>

                {/* O'ng: fullscreen + foydalanuvchi */}
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => {
                            if (!document.fullscreenElement) document.documentElement.requestFullscreen();
                            else document.exitFullscreen();
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
                                {answeredCount} / {questions.length} {intl.formatMessage({ id: "ta javob berildi" })}
                            </span>
                        </div>
                    </div>
                </div>
            </header>

            {/* Timer progress bar */}
            <div className="h-1.5 bg-slate-100 w-full">
                <div
                    className={`h-full transition-all duration-1000 ease-linear ${
                        isLowTime ? "bg-red-500" : isTimedOut ? "bg-slate-300" : "bg-primary"
                    }`}
                    style={{ width: `${timerPercent}%` }}
                />
            </div>

            {/* Asosiy kontent */}
            <div className="flex-1 overflow-y-auto">
                <div className="max-w-3xl mx-auto px-4 py-8">

                    {/* Savol kartasi */}
                    <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden mb-6">
                        <div className="p-6 sm:p-8">

                            {/* Savol raqami + matni */}
                            <div className="flex gap-4 mb-6">
                                <span className="w-10 h-10 shrink-0 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-black text-sm">
                                    {currentIndex + 1}
                                </span>
                                <p className="text-slate-800 text-lg font-semibold leading-relaxed pt-1">
                                    {currentQuestion?.text}
                                </p>
                            </div>

                            {/* Rasm */}
                            {currentQuestion?.image && (
                                <img
                                    src={currentQuestion.image}
                                    alt={`Savol ${currentIndex + 1}`}
                                    className="mb-6 max-h-[45vh] w-auto mx-auto block rounded-2xl border border-slate-100 object-contain"
                                />
                            )}

                            {/* Audio */}
                            {currentQuestion?.audio && (
                                <div className="mb-6 flex justify-center">
                                    <audio
                                        controls
                                        className="w-full max-w-sm rounded-xl"
                                        src={currentQuestion.audio}
                                    />
                                </div>
                            )}

                            {/* Vaqt tugadi xabari - faqat check tugagunicha */}
                            {isTimedOut && currentResult?.idx == null && (
                                <div className="mb-5 flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4">
                                    <XCircle size={20} className="text-slate-400 shrink-0" />
                                    <span className="text-sm font-bold text-slate-500">
                                        {intl.formatMessage({ id: "Vaqt tugadi! Bu savol uchun ball berilmadi." })}
                                    </span>
                                </div>
                            )}

                            {/* Variantlar */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {currentQuestion?.options?.map((option, oIdx) => {
                                    const optionLabel = ["A", "B", "C", "D"][oIdx] || oIdx + 1;
                                    const isSelected = currentResult?.idx === oIdx && currentResult?.idx !== null;
                                    const isCorrectOption = currentResult?.correctIdx != null && currentResult?.correctIdx === oIdx;
                                    const isWrong = isSelected && !currentResult?.isCorrect;

                                    let optionStyle = "border-slate-100 bg-white hover:border-slate-300 cursor-pointer";
                                    let labelStyle = "border-slate-200 text-slate-400 bg-slate-50";

                                    if (currentResult) {
                                        if (isCorrectOption) {
                                            optionStyle = "border-emerald-400 bg-emerald-50 cursor-default";
                                            labelStyle = "bg-emerald-500 border-emerald-500 text-white";
                                        } else if (isWrong) {
                                            optionStyle = "border-red-300 bg-red-50 cursor-default";
                                            labelStyle = "bg-red-500 border-red-500 text-white";
                                        } else {
                                            optionStyle = "border-slate-100 bg-white opacity-50 cursor-default";
                                        }
                                    } else if (isTimedOut) {
                                        optionStyle = "border-slate-100 bg-white opacity-50 cursor-default";
                                    } else if (isChecking) {
                                        optionStyle = "border-slate-100 bg-slate-50 opacity-60 cursor-wait";
                                    }

                                    return (
                                        <button
                                            key={oIdx}
                                            onClick={() => handleSelectOption(currentQuestion.id, oIdx)}
                                            disabled={isAnswered || isChecking || isTimedOut}
                                            className={`p-4 text-left rounded-xl border-2 transition-all flex items-center gap-4 ${optionStyle} disabled:cursor-default`}
                                        >
                                            <span className={`w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center border font-bold text-sm transition-all ${labelStyle}`}>
                                                {optionLabel}
                                            </span>
                                            <div className="flex-1">
                                                {(option?.image || option?.img) && (
                                                    <img
                                                        src={option?.image || option?.img}
                                                        alt={`${optionLabel} variant`}
                                                        className="max-h-32 w-auto rounded-lg border border-slate-100 object-contain mb-2"
                                                    />
                                                )}
                                                <span className="font-medium text-sm text-slate-700">
                                                    {typeof option === "string" ? option : option?.text || ""}
                                                </span>
                                            </div>
                                            {isCorrectOption && currentResult && (
                                                <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
                                            )}
                                            {isWrong && (
                                                <XCircle size={16} className="text-red-500 shrink-0" />
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Next / Skip / Finish tugmasi - HAR DOIM KO'RINADI */}
                    <button
                        onClick={handleNext}
                        disabled={isNextDisabled}
                        className={`w-full py-4 rounded-2xl font-black text-base shadow-xl transition-all active:scale-95 flex items-center justify-center gap-3 disabled:opacity-60 disabled:cursor-not-allowed ${
                            !isAnswered && !isTimedOut
                                ? "bg-slate-400 hover:bg-slate-500 text-white"
                                : "bg-slate-900 hover:bg-primary text-white"
                        }`}
                    >
                        {nextButtonLabel()}
                    </button>

                </div>
            </div>
        </div>
    );
};

export default QuizExamPlayground;
