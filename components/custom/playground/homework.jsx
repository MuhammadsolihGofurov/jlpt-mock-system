import React, { useState } from "react";
import HomeworkHeader from "./details/homework-header";
import HomeworkFooter from "./details/homework-footer";
import HomeworkQuestionRenderer from "./details/homework-question-renderer";

const HomeworkPlayground = ({ data, onFinish, onBack }) => {
    const itemType = data.item_type;
    const itemData = data.item_data;

    const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
    const [answers, setAnswers] = useState({});

    // Strukturani tayyorlash
    const sections = itemType === "mock_test"
        ? itemData.sections
        : [{
            id: itemData.id,
            name: itemData.title,
            question_groups: [{ questions: itemData.questions, mondai_number: 1, id: 'quiz-group' }],
            section_type: 'QUIZ'
        }];

    const currentSection = sections[currentSectionIndex];
    const isLastSection = currentSectionIndex === sections.length - 1;
    const sectionDuration = currentSection?.duration || itemData?.duration || 0;

    // Progressni hisoblash
    const totalQuestions = sections.reduce((acc, sec) => acc + (sec.question_groups?.reduce((a, g) => a + g.questions.length, 0) || 0), 0);
    const answeredCount = Object.keys(answers).length;
    const progress = (answeredCount / totalQuestions) * 100;

    const handleSelectOption = (questionId, optionIndex) => {
        setAnswers(prev => ({ ...prev, [questionId]: optionIndex }));
    };

    const handleFinish = () => {
        // Bu funksiya faqat parentga javoblarni berib yuboradi, API'ga emas
        onFinish(answers, data.item_id);
    };

    return (
        <div className="fixed inset-0 bg-[#FDFDFF] flex flex-col overflow-hidden">
            <HomeworkHeader
                title={itemData.title}
                sectionName={currentSection.name}
                onBack={onBack}
                progress={progress}
                duration={sectionDuration}
                onTimeUp={() => {
                    if (isLastSection) {
                        handleFinish();
                    } else {
                        setCurrentSectionIndex(prev => prev + 1);
                    }
                }}
            />

            <main className="flex-1 overflow-y-auto p-6 md:p-10">
                <div className="max-w-4xl mx-auto">
                    {currentSection.question_groups.map((group) => (
                        <HomeworkQuestionRenderer
                            key={group.id}
                            group={group}
                            onSelect={handleSelectOption}
                            selectedAnswers={answers}
                            isListeningMode={currentSection.section_type === "LISTENING"}
                        />
                    ))}
                </div>
            </main>

            <HomeworkFooter
                onNext={() => setCurrentSectionIndex(prev => prev + 1)}
                onPrev={() => setCurrentSectionIndex(prev => prev - 1)}
                onFinish={handleFinish}
                isLastSection={isLastSection}
                canPrev={currentSectionIndex > 0}
                isDisabled={answeredCount === 0} // Kamida bitta javob bo'lsa tugatish mumkin (yoki validation mantiqi)
            />
        </div>
    );
};

export default HomeworkPlayground;