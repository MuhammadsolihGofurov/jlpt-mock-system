import React, { useState } from "react";
import { useExamSecurity } from "@/hooks/useExamSecurity";
import { QuestionRenderer } from "./details/question-renderer";
import { SidebarNavigation } from "./details/sidebar-nav";
import ExamHeader from "./details/exam-header";
import ExamFooter from "./details/exam-footer";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import { authAxios } from "@/utils/axios";

const ExamPlayground = ({ examData }) => {
  const router = useRouter();
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const sections = examData.exam_paper.sections;
  const currentSection = sections[currentSectionIndex];
  const isLastSection = currentSectionIndex === sections.length - 1;

  const currentSectionQuestions = currentSection.question_groups.flatMap(
    (group) => group.questions,
  );

  const isAllAnswered = currentSectionQuestions.every(
    (q) => answers.hasOwnProperty(q.id) && answers[q.id] !== undefined,
  );

  useExamSecurity(true);

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

  // Imtihonni topshirish (Submit)
  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      const payload = {
        submission_id: examData.submission_id,
        answers: answers,
      };

      await authAxios.post("/submissions/submit-exam/", payload);

      toast.success("Imtihon muvaffaqiyatli topshirildi!");
      // Natijalar sahifasiga yoki dashboardga yo'naltirish
      router.push("/dashboard/assignments/exam");
    } catch (error) {
      console.error("Submission error:", error);
      toast.error("Topshirishda xatolik yuz berdi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-50 flex flex-col overflow-hidden select-none">
      <ExamHeader
        key={currentSection.id} // Section o'zgarganda taymer qayta boshlanishi uchun
        title={examData.exam_paper.title}
        sectionName={currentSection.name}
        duration={currentSection.duration}
        onTimeUp={isLastSection ? handleSubmit : handleNext}
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

            {currentSection.question_groups.map((group) => (
              <QuestionRenderer
                key={group.id}
                group={group}
                onSelect={handleSelectOption}
                selectedAnswers={answers}
              />
            ))}
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
