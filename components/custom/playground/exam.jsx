import React, { useEffect, useState } from "react";
import { useExamSecurity } from "@/hooks/useExamSecurity";
import { QuestionRenderer } from "./details/question-renderer";
import { SidebarNavigation } from "./details/sidebar-nav";
import ExamHeader from "./details/exam-header";
import ExamFooter from "./details/exam-footer";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import { authAxios } from "@/utils/axios";
import { ListeningOverlay } from "./details/exam-listening-overlay";
import { useIntl } from "react-intl";
import { ListeningModeSelector } from "./details/listening-mode-selector";

const ExamPlayground = ({ examData }) => {
  const router = useRouter();
  const intl = useIntl();
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [activeGroupIndex, setActiveGroupIndex] = useState(0);
  const [isAudioStarted, setIsAudioStarted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [audioMode, setAudioMode] = useState(null);

  useEffect(() => {
    setActiveGroupIndex(0);
    setIsAudioStarted(false);
  }, [currentSectionIndex]);

  const handleAudioEnd = () => {
    if (currentSection.section_type === "LISTENING") {
      if (activeGroupIndex < currentSection.question_groups.length - 1) {
        setActiveGroupIndex(prev => prev + 1);

        const nextGroup = currentSection.question_groups[activeGroupIndex + 1];
        document.getElementById(`group-${nextGroup.id}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else {
        toast.info(intl.formatMessage({
          id: "Tinglab tushunish bo'limi yakunlandi."
        }));
      }
    }
  };

  const sections = examData.exam_paper.sections;
  const currentSection = sections[currentSectionIndex];
  const isLastSection = currentSectionIndex === sections.length - 1;

  const currentSectionQuestions = currentSection.question_groups.flatMap(
    (group) => group.questions,
  );

  const isAllAnswered = currentSectionQuestions.every(
    (q) => answers.hasOwnProperty(q.id) && answers[q.id] !== undefined,
  );

  useExamSecurity(true, () => {
    console.error("Foydalanuvchi qoidani buzdi, API'ga xabar berish mumkin.");
    // Masalan: authAxios.post("/violations/log", { type: "CHEATING_ATTEMPT" });
  });

  const handleSelectOption = (questionId, optionIndex) => {
    setAnswers((prev) => ({ ...prev, [questionId]: optionIndex }));
  };

  // Bo'limlararo navigatsiya
  const handleNext = () => {
    if (!isLastSection) {
      setCurrentSectionIndex((prev) => prev + 1);
      // Sahifani tepaga qaytarish
      document.querySelector("main")?.scrollTo(0, 0);
    }
  };

  const handlePrev = () => {
    if (currentSectionIndex > 0) {
      setCurrentSectionIndex((prev) => prev - 1);
      document.querySelector("main")?.scrollTo(0, 0);
    }
  };

  const handleTimeUp = () => {
    if (isLastSection) {
      toast.warning(intl.formatMessage({ id: "Vaqt tugadi! Imtihon avtomatik topshirilmoqda..." }));
      handleSubmit(true);
    } else {
      toast.info(intl.formatMessage({ id: "Bo'lim vaqti tugadi. Keyingi bo'limga o'tilmoqda..." }));
      handleNext();
    }
  };

  // Imtihonni topshirish (Submit)
  const handleSubmit = async (isAuto = false) => {
    if (!isAuto && !isAllAnswered) {
      toast.error(intl.formatMessage({ id: "Iltimos, barcha savollarni belgilang!" }));
      return;
    }

    try {
      setIsSubmitting(true);
      const payload = {
        submission_id: examData.submission_id,
        answers: answers,
      };

      await authAxios.post("/submissions/submit-exam/", payload);
      toast.success(intl.formatMessage({ id: "Imtihon yakunlandi!" }));
      router.push("/dashboard/assignments/exam");
    } catch (error) {
      console.error("Submission error:", error);
      toast.error(intl.formatMessage({ id: "Topshirishda xatolik yuz berdi." }));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-50 flex flex-col overflow-hidden select-none">
      {/* Agar LISTENING bo'lsa va hali boshlanmagan bo'lsa Overlay chiqarish */}
      {/* {currentSection.section_type === "LISTENING" && !isAudioStarted && (
        <ListeningOverlay
          title={currentSection.name}
          onStart={() => setIsAudioStarted(true)}
        />
      )} */}

      {currentSection.section_type === "LISTENING" && !audioMode && (
        <ListeningModeSelector
          onSelect={(mode) => {
            setAudioMode(mode);
            if (mode === 'auto') setIsAudioStarted(true);
            else setIsAudioStarted(true);
          }}
        />
      )}

      <ExamHeader
        key={currentSection.id}
        title={examData.exam_paper.title}
        sectionName={currentSection.name}
        duration={currentSection.duration}
        // onTimeUp={isLastSection ? handleSubmit : handleNext}
        onTimeUp={handleTimeUp}
      />

      <div className="flex-1 flex overflow-hidden">
        <main className="flex-1 overflow-y-auto p-6 md:p-10 bg-white shadow-inner scroll-smooth">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-lg sm:text-2xl flex-wrap font-black text-slate-800 mb-6 border-b pb-4 flex items-center justify-between">
              <span>{currentSection.name}</span>
              <span className="text-sm font-bold bg-slate-100 px-4 py-1 rounded-full text-slate-500">
                {currentSection.section_type}
              </span>
            </h2>

            {currentSection.question_groups.map((group, index) => {
              const isActuallyVisible =
                currentSection.section_type !== "LISTENING" ||
                audioMode === 'manual' ||
                (isAudioStarted && index === activeGroupIndex);

              return (
                <QuestionRenderer
                  key={group.id}
                  isActiveGroup={isActuallyVisible}
                  audioMode={audioMode}
                  group={group}
                  onSelect={handleSelectOption}
                  sectionType={currentSection?.section_type}
                  selectedAnswers={answers}
                  // isActiveGroup={
                  //   currentSection.section_type === "LISTENING"
                  //     ? (isAudioStarted && index === activeGroupIndex)
                  //     : true
                  // }
                  onAudioEnd={handleAudioEnd}
                />
              )
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

export default ExamPlayground;
