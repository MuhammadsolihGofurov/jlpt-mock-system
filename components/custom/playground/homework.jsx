import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { ChevronLeft, ChevronRight, Trophy, Clock } from "lucide-react";
import HomeworkQuestionRenderer from "./details/homework-question-renderer";
import { authAxios } from "@/utils/axios";
import { toast } from "react-toastify";
import { useIntl } from "react-intl";

const HomeworkPlayground = ({ data, onFinish, onBack }) => {
    const itemData = data?.item_data;
    const questions = itemData?.questions || [];
    const [currentIndex, setCurrentIndex] = useState(0);
    const [answers, setAnswers] = useState({});
    const answersRef = useRef(answers);
    answersRef.current = answers;
    const intl = useIntl();
    const [isChecking, setIsChecking] = useState(false);
    const [timeLeft, setTimeLeft] = useState(itemData?.default_question_duration || 30);

    const normalAudio = useRef(typeof Audio !== "undefined" ? new Audio("/sounds/timeout-1.mp3") : null);
    const urgentAudio = useRef(typeof Audio !== "undefined" ? new Audio("/sounds/timeout-2.mp3") : null);

    const stopAllSounds = () => {
        if (normalAudio.current) {
            normalAudio.current.pause();
            normalAudio.current.currentTime = 0;
        }
        if (urgentAudio.current) {
            urgentAudio.current.pause();
            urgentAudio.current.currentTime = 0;
        }
    };

    const randomBg = useMemo(() => {
        const bgNumber = Math.floor(Math.random() * 3) + 1;
        return `/images/background-${bgNumber}.jpg`;
    }, []);

    const currentQuestion = questions[currentIndex];
    const totalQuestions = questions.length;
    const currentResult = answers[currentQuestion?.id];

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    useEffect(() => {
        if (currentResult || timeLeft <= 0) {
            stopAllSounds();
            return;
        }

        if (timeLeft > 5) {
            if (urgentAudio.current) {
                urgentAudio.current.pause();
                urgentAudio.current.currentTime = 0;
            }
            normalAudio.current.loop = true;
            normalAudio.current.play().catch(() => { });
        } else if (timeLeft <= 5 && timeLeft > 0) {
            if (normalAudio.current) {
                normalAudio.current.pause();
                normalAudio.current.currentTime = 0;
            }
            urgentAudio.current.loop = true;
            urgentAudio.current.play().catch(() => { });
        }

        const timer = setInterval(() => {
            setTimeLeft(prev => prev - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [timeLeft, currentResult]);

    useEffect(() => {
        return () => stopAllSounds();
    }, [currentIndex]);

    // Time ran out without a selection: ask backend to reveal the correct option
    // (selected_index omitted — persisted as JSON null, scored wrong on submit).
    useEffect(() => {
        if (timeLeft !== 0 || !currentQuestion?.id || !data?.submission_id) return;
        const qid = currentQuestion.id;
        if (answersRef.current[qid]) return;

        let cancelled = false;
        (async () => {
            setIsChecking(true);
            try {
                const res = await authAxios.post("/submissions/check-single-question/", {
                    submission_id: data.submission_id,
                    question_id: qid,
                });
                if (cancelled) return;
                setAnswers((prev) => ({
                    ...prev,
                    [qid]: {
                        idx: res.data.selected_index,
                        isCorrect: res.data.is_correct,
                        correctIdx: res.data.correct_option_index,
                        noSelection: res.data.no_selection_sent,
                    },
                }));
            } catch {
                if (!cancelled) toast.error("Xato yuz berdi");
            } finally {
                if (!cancelled) setIsChecking(false);
            }
        })();

        return () => {
            cancelled = true;
        };
    }, [timeLeft, currentQuestion?.id, data?.submission_id]);

    const handleSelectOption = async (questionId, optionIndex) => {
        if (answers[questionId] || isChecking || timeLeft === 0) return;
        setIsChecking(true);
        stopAllSounds();

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
                    noSelection: res.data.no_selection_sent,
                }
            }));
        } catch (error) {
            toast.error("Xato yuz berdi");
        } finally {
            setIsChecking(false);
        }
    };

    const handleNext = useCallback(() => {
        if (currentIndex < totalQuestions - 1) {
            stopAllSounds();
            setCurrentIndex(prev => prev + 1);
            setTimeLeft(itemData?.default_question_duration || 30);
            // Savol o'zgarganda sahifani tepaga qaytarish (mobil uchun)
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }, [currentIndex, totalQuestions, itemData]);

    const isUrgent = timeLeft <= 5 && timeLeft > 0;

    return (
        // FIXED olib tashlandi, MIN-H-SCREEN qo'shildi
        <div className="relative min-h-screen flex flex-col z-[100] bg-black text-white pb-10">
            {/* BACKGROUND - FIXED bo'lib turishi kerak, kontent ustidan o'tishi uchun */}
            <div
                className="fixed inset-0 bg-cover bg-center transition-transform duration-[10s] scale-110 animate-slow-zoom z-0"
                style={{ backgroundImage: `url(${randomBg})` }}
            />
            <div className="fixed inset-0 bg-gradient-to-tr from-black/80 via-black/40 to-black/60 backdrop-saturate-[1.2] z-1" />

            {/* UI CONTENT CONTAINER */}
            <div className="relative z-10 flex flex-col max-w-4xl mx-auto w-full px-4">
                <header className="h-20 flex items-center justify-between sticky top-0 z-30">
                    <button onClick={() => { stopAllSounds(); onBack(); }} className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 backdrop-blur-xl border border-white/20">
                        <ChevronLeft size={20} />
                    </button>

                    <div className={`px-6 py-2 rounded-full backdrop-blur-2xl border-2 transition-all duration-300 ${isUrgent ? 'border-rose-500 bg-rose-500/20 scale-105' : 'border-white/20 bg-white/5'}`}>
                        <div className="flex items-center gap-2">
                            <Clock size={18} className={isUrgent ? 'animate-pulse text-rose-400' : 'text-white/60'} />
                            <span className="font-mono text-xl font-black min-w-[50px] text-center">
                                {formatTime(timeLeft)}
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 bg-black/40 px-4 py-2 rounded-full border border-white/10">
                        <Trophy size={16} className="text-yellow-400" />
                        <span className="font-bold text-xs">{currentIndex + 1}/{totalQuestions}</span>
                    </div>
                </header>

                <main className="flex flex-col py-4 gap-6">
                    {/* Savol kartasi balandligi cheklanmagan */}
                    <div className="bg-black/30 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-5 md:p-8 shadow-2xl">
                        <HomeworkQuestionRenderer
                            question={currentQuestion}
                            index={currentIndex}
                            onSelect={handleSelectOption}
                            result={currentResult}
                            isChecking={isChecking}
                            isTimeOut={timeLeft === 0}
                        />
                    </div>

                    {/* ACTION BUTTONS */}
                    <div className="pb-8">
                        {(currentResult || timeLeft === 0) ? (
                            <button
                                onClick={() => {
                                    stopAllSounds();
                                    if (currentIndex === totalQuestions - 1) {
                                        onFinish({ submission_id: data.submission_id });
                                    } else {
                                        handleNext();
                                    }
                                }}
                                className="w-full py-5 rounded-2xl bg-white text-black font-black text-lg shadow-[0_0_30px_rgba(255,255,255,0.3)] hover:scale-[1.01] active:scale-95 transition-all flex items-center justify-center gap-2"
                            >
                                {intl.formatMessage({ id: currentIndex === totalQuestions - 1 ? "NATIJANI KO'RISH" : "KEYINGI SAVOL" })}
                                <ChevronRight size={20} />
                            </button>
                        ) : (
                            <div className="text-center text-white/40 text-sm font-medium italic animate-pulse py-4">
                                {intl.formatMessage({ id: "Javobingizni tanlang..." })}
                            </div>
                        )}
                    </div>
                </main>
            </div>

            <style jsx>{`
                @keyframes slow-zoom {
                    0% { transform: scale(1); }
                    100% { transform: scale(1.1); }
                }
                .animate-slow-zoom {
                    animation: slow-zoom 20s linear infinite alternate;
                }
            `}</style>
        </div>
    );
};

export default HomeworkPlayground;