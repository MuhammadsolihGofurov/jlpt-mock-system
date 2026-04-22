import React, { useEffect, useState, useMemo, useRef } from "react";
import ExamHeader from "../details/exam-header";
import ExamFooter from "../details/exam-footer";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import { authAxios } from "@/utils/axios";
import { useIntl } from "react-intl";
import { JFTQuestionRenderer } from "../details/jft-question-renderer";
import JFTExamHeader from "../details/jft-exam-header";

const JFTExamPlayground = ({ examData, currentExamType, stopSecurity }) => {
    const router = useRouter();
    const intl = useIntl();
    const mainRef = useRef(null);

    const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
    const [answers, setAnswers] = useState({});
    const [activeGroupIndex, setActiveGroupIndex] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const sections = examData?.exam_paper?.sections;
    const currentSection = sections[currentSectionIndex || 0];
    const isLastSection = currentSectionIndex === sections.length - 1;
    const isListening = currentSection?.section_type === "LISTENING";

    // Group questions by shared_content
    const groupedQuestions = useMemo(() => {
        if (!currentSection?.questions) return [];

        const groups = [];
        let currentGroup = null;

        currentSection.questions.forEach((question) => {
            const sharedId = question.shared_content?.id;
            if (sharedId) {
                if (currentGroup && currentGroup.shared_content === sharedId) {
                    currentGroup.questions.push(question);
                } else {
                    currentGroup = {
                        id: `shared-${sharedId}-${question.id}`,
                        shared_content: sharedId,
                        questions: [question],
                        audio_file: question?.shared_content?.audio_file || null,
                        mondai_number: question?.mondai_number,
                        title: question?.shared_content?.title,
                        instruction: question?.shared_content?.instruction,
                    };
                    groups.push(currentGroup);
                }
            } else {
                currentGroup = {
                    id: `single-${question.id}`,
                    shared_content: null,
                    questions: [question],
                    audio_file: null, // will use question-level audio_file
                    mondai_number: question?.mondai_number,
                    title: null,
                    instruction: null,
                };
                groups.push(currentGroup);
            }
        });

        return groups;
    }, [currentSection]);

    // Reset state on section change
    useEffect(() => {
        setActiveGroupIndex(0);
        if (mainRef.current) {
            mainRef.current.scrollTo(0, 0);
        }
    }, [currentSectionIndex]);

    // Scroll to active group on change (Listening mode)
    useEffect(() => {
        if (!isListening) return;
        const group = groupedQuestions[activeGroupIndex];
        if (!group) return;

        setTimeout(() => {
            document.getElementById(`group-${group.id}`)?.scrollIntoView({
                behavior: "smooth",
                block: "center",
            });
        }, 150);
    }, [activeGroupIndex, isListening]);

    // Called by JFTQuestionRenderer when audio finishes + 3s countdown passed
    const handleAudioEnd = () => {
        if (!isListening) return;

        if (activeGroupIndex < groupedQuestions.length - 1) {
            setActiveGroupIndex((prev) => prev + 1);
        } else {
            toast.info(intl.formatMessage({ id: "listening_finished" }));
        }
    };

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
        if (!isLastSection) setCurrentSectionIndex((prev) => prev + 1);
    };

    const handlePrev = () => {
        if (currentSectionIndex > 0) setCurrentSectionIndex((prev) => prev - 1);
    };

    const handleTimeUp = () => {
        if (isLastSection) {
            handleSubmit(true);
        } else {
            handleNext();
        }
    };

    const handleSubmit = async (isAuto = false) => {
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

    if (!currentSection) {
        return (
            <div className="fixed inset-0 flex items-center justify-center bg-white">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 bg-slate-50 flex flex-col overflow-hidden select-none">
            <JFTExamHeader
                // key={`header-${currentSection.id}`}
                title={examData?.exam_paper?.title}
                sectionName={currentSection?.name}
                duration={examData?.exam_paper?.duration_minutes}
                onTimeUp={handleTimeUp}
            />

            <div className="flex-1 flex overflow-hidden">
                <main
                    ref={mainRef}
                    className="flex-1 overflow-y-auto p-6 md:p-10 bg-white shadow-inner scroll-smooth"
                >
                    <div className="max-w-4xl mx-auto">
                        <h2 className="text-lg sm:text-2xl font-black text-slate-800 mb-6 border-b pb-4 flex items-center justify-between">
                            <span>{currentSection?.name}</span>
                            <span className="text-sm font-bold bg-slate-100 px-4 py-1 rounded-full text-slate-500">
                                {currentSection?.section_type}
                            </span>
                        </h2>

                        {groupedQuestions.map((group, index) => {
                            // LISTENING: faqat activeGroupIndex va undan oldingilari ko'rinadi
                            // (oldingilari read-only, faqat aktiv guruh interaktiv)
                            const isActive = !isListening || index === activeGroupIndex;
                            const isPast = isListening && index < activeGroupIndex;

                            // Listening rejimida faqat aktiv va o'tgan guruhlarni ko'rsatamiz
                            if (isListening && index > activeGroupIndex) return null;

                            return (
                                <div id={`group-${group.id}`} key={group.id} className="mb-10">
                                    <JFTQuestionRenderer
                                        group={group}
                                        onSelect={handleSelectOption}
                                        sectionType={currentSection.section_type}
                                        selectedAnswers={answers}
                                        onAudioEnd={handleAudioEnd}
                                        isActiveGroup={isActive}
                                        isPastGroup={isPast}
                                        isLastGroup={isListening && index === groupedQuestions.length - 1}
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