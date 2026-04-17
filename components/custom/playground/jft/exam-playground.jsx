import React, { useEffect, useState, useMemo, useRef } from "react";
import { QuestionRenderer } from "../details/question-renderer";
import ExamHeader from "../details/exam-header";
import ExamFooter from "../details/exam-footer";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import { authAxios } from "@/utils/axios";
import { useIntl } from "react-intl";
import { ListeningModeSelector } from "../details/listening-mode-selector";
import { useExamSecurity } from "@/hooks/useExamSecurity";

const JFTExamPlayground = ({ examData, currentExamType, stopSecurity }) => {
    const router = useRouter();
    const intl = useIntl();
    const mainRef = useRef(null);

    const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
    const [answers, setAnswers] = useState({});
    const [activeGroupIndex, setActiveGroupIndex] = useState(0);
    const [isAudioStarted, setIsAudioStarted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [audioMode, setAudioMode] = useState(null);

    // Xavfsiz ma'lumot olish: sections mavjudligini tekshiramiz
    const sections = examData?.exam_paper?.sections;
    const currentSection = sections[currentSectionIndex || 0];
    const isLastSection = currentSectionIndex === sections.length - 1;

    // Guruhlash mantiqi: currentSection o'zgarganda qayta hisoblanadi
    const groupedQuestions = useMemo(() => {
        if (!currentSection?.questions) return [];

        const groups = [];
        let currentGroup = null;

        currentSection.questions.forEach((question) => {
            const sharedId = question.shared_content;
            if (sharedId) {
                if (currentGroup && currentGroup.shared_content === sharedId) {
                    currentGroup.questions.push(question);
                } else {
                    currentGroup = {
                        id: `shared-${sharedId}-${question.id}`,
                        shared_content: sharedId,
                        questions: [question],
                    };
                    groups.push(currentGroup);
                }
            } else {
                currentGroup = {
                    id: `single-${question.id}`,
                    shared_content: null,
                    questions: [question],
                };
                groups.push(currentGroup);
            }
        });
        return groups;
    }, [currentSection]);

    // Bo'lim o'zgarganda holatlarni tozalash
    useEffect(() => {
        setActiveGroupIndex(0);
        setIsAudioStarted(false);

        // Agar keyingi bo'lim LISTENING bo'lmasa, audioMode ni avtomatik 'manual' 
        // yoki boshqa neytral holatga o'tkazish kerak, aks holda QuestionRenderer yopilib qoladi
        if (currentSection?.section_type !== "LISTENING") {
            setAudioMode('none');
        } else {
            setAudioMode(null); // Listening bo'lsa qaytadan tanlovni so'raydi
        }

        if (mainRef.current) {
            mainRef.current.scrollTo(0, 0);
        }
    }, [currentSectionIndex, currentSection?.section_type]);

    // AUDIO yakunlanganda keyingi guruhga o'tish
    const handleAudioEnd = () => {
        if (currentSection?.section_type === "LISTENING" && audioMode === 'auto') {
            if (activeGroupIndex < groupedQuestions.length - 1) {
                const nextIdx = activeGroupIndex + 1;
                setActiveGroupIndex(nextIdx);

                // Keyingi savolga scroll qilish
                const nextGroup = groupedQuestions[nextIdx];
                setTimeout(() => {
                    document.getElementById(`group-${nextGroup.id}`)?.scrollIntoView({
                        behavior: 'smooth',
                        block: 'center'
                    });
                }, 100);
            } else {
                toast.info(intl.formatMessage({ id: "listening_finished" }));
            }
        }
    };

    // Savollarga to'liq javob berilganini tekshirish
    const isAllAnswered = useMemo(() => {
        if (!currentSection?.questions) return false;
        return currentSection.questions.every(
            (q) => answers.hasOwnProperty(q.id) && answers[q.id] !== undefined && answers[q.id] !== null
        );
    }, [currentSection, answers]);

    const handleSelectOption = (questionId, optionIndex) => {
        setAnswers((prev) => ({ ...prev, [questionId]: optionIndex }));
    };

    const handleNext = () => {
        if (!isLastSection) {
            setCurrentSectionIndex((prev) => prev + 1);
        }
    };

    const handlePrev = () => {
        if (currentSectionIndex > 0) {
            setCurrentSectionIndex((prev) => prev - 1);
        }
    };

    const handleTimeUp = () => {
        if (isLastSection) {
            handleSubmit(true);
        } else {
            handleNext();
        }
    };

    const handleSubmit = async (isAuto = false) => {

        // if (!isAuto && !isAllAnswered) {
        //     toast.error(intl.formatMessage({ id: "please_answer_all" }));
        //     return;
        // }

        stopSecurity();

        try {
            setIsSubmitting(true);
            const payload = {
                submission_id: examData.submission_id,
                answers: answers,
            };
            await authAxios.post(currentExamType?.submit_exam, payload);
            toast.success(intl.formatMessage({ id: "exam_finished" }));
            router.push("/dashboard/assignments/exam-jft");
        } catch (error) {
            toast.error(intl.formatMessage({ id: "error_submitting" }));
        } finally {
            setIsSubmitting(false);
        }
    };


    // const handleBegin = async () => {
    //     const extensions = await checkExtensions();
    //     if (extensions.length > 0) {
    //         setShowExtModal(true);
    //         return;
    //     }
    // };

    // handleBegin();

    // MUHIM: currentSection undefined bo'lsa, xatolik bermasligi uchun
    if (!currentSection) {
        return (
            <div className="fixed inset-0 flex items-center justify-center bg-white">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 bg-slate-50 flex flex-col overflow-hidden select-none">
            {/* Listening Mode Selector */}
            {currentSection.section_type === "LISTENING" && !audioMode && (
                <ListeningModeSelector
                    onSelect={(mode) => {
                        setAudioMode(mode);
                        setIsAudioStarted(true);
                    }}
                />
            )}

            {/* {showExtModal && (
                <div className="modal">
                    <h3>Extensionlarni o'chiring!</h3>
                    <p>Sizda quyidagi extensionlar aniqlandi: {detectedExtensions.join(", ")}</p>
                    <button onClick={() => setShowExtModal(false)}>Tayyorman</button>
                </div>
            )} */}

            <ExamHeader
                key={`header-${currentSection.id}`}
                title={examData?.exam_paper?.title}
                sectionName={currentSection?.name}
                duration={examData?.exam_paper?.duration_minutes}
                onTimeUp={handleTimeUp}
            />

            <div className="flex-1 flex overflow-hidden">
                <main ref={mainRef} className="flex-1 overflow-y-auto p-6 md:p-10 bg-white shadow-inner scroll-smooth">
                    <div className="max-w-4xl mx-auto">
                        <h2 className="text-lg sm:text-2xl font-black text-slate-800 mb-6 border-b pb-4 flex items-center justify-between">
                            <span>{currentSection?.name}</span>
                            <span className="text-sm font-bold bg-slate-100 px-4 py-1 rounded-full text-slate-500">
                                {currentSection?.section_type}
                            </span>
                        </h2>

                        {groupedQuestions.map((group, index) => {
                            // Ko'rinish mantiqi
                            const isVisible =
                                currentSection.section_type !== "LISTENING" ||
                                audioMode === 'manual' ||
                                (isAudioStarted && index === activeGroupIndex);

                            // Listeningda faqat faol guruhni ko'rsatish (yoki manualda hammasini)
                            if (currentSection.section_type === "LISTENING" && audioMode === 'auto' && !isVisible) {
                                return null;
                            }

                            return (
                                <div id={`group-${group.id}`} key={group.id} className="mb-10">
                                    <QuestionRenderer
                                        isActiveGroup={isVisible}
                                        audioMode={audioMode}
                                        group={group}
                                        onSelect={handleSelectOption}
                                        sectionType={currentSection.section_type}
                                        selectedAnswers={answers}
                                        onAudioEnd={handleAudioEnd}
                                    />
                                </div>
                            );
                        })}
                    </div>
                </main>
            </div>

            <ExamFooter
                onNext={handleNext}
                onPrev={handlePrev}
                onSubmit={handleSubmit}
                isLastSection={isLastSection}
                loading={isSubmitting}
                canPrev={currentSectionIndex > 0}
                isDisabled={!isAllAnswered}
            />
        </div>
    );
};

export default JFTExamPlayground;