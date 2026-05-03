import React, { useState } from "react";
import { useRouter } from "next/router";
import useSWR from "swr";
import fetcher from "@/utils/fetcher";
import { Seo } from "@/components/seo";
import { withAuthGuard } from "@/components/guard";
import { useIntl } from "react-intl";
import {
  BookOpen,
  AlertCircle,
  ChevronLeft,
  ShieldCheck,
  ArrowRight,
  Loader2,
  FileQuestion,
  Clock,
} from "lucide-react";
import { authAxios } from "@/utils/axios";
import { handleApiError } from "@/utils/handle-error";
import { toast } from "react-toastify";
import { useModal } from "@/context/modal-context";
import { QuizExamPlayground } from "@/components/custom/playground";

const QuizPlaygroundPage = ({ customLoading }) => {
  const router = useRouter();
  const intl = useIntl();
  const { id: assignmentId } = router.query;
  const [examData, setExamData] = useState(null);
  const [activeQuizId, setActiveQuizId] = useState(null);
  const [isStarting, setIsStarting] = useState(false);
  const { openModal } = useModal();

  const { data: assignmentInfo, isLoading } = useSWR(
    assignmentId ? [`homework-assignments/${assignmentId}/`, router.locale] : null,
    (url, locale) => fetcher(url, { headers: { "Accept-Language": locale } }, {}, true)
  );

  const quizzes = assignmentInfo?.quizzes || [];

  const handleStartQuiz = async (quiz) => {
    try {
      setIsStarting(true);
      setActiveQuizId(quiz.id);

      const res = await authAxios.post("/submissions/homework-start/", {
        homework_assignment_id: assignmentId,
        item_type: "quiz",
        item_id: quiz.id,
      });

      openModal(
        "CHECKED_CONFIRM_MODAL",
        {
          title: intl.formatMessage({ id: "Quizni boshlash" }),
          body: intl.formatMessage({ id: "Quiz qo'llanmasi" }),
          confirmText: intl.formatMessage({ id: "Tushundim va quizni boshlayman" }),
          variant: "danger",
          onConfirm: () => {
            setExamData({ ...res.data, quizTitle: quiz.title });
          },
        },
        "middle",
      );
    } catch (error) {
      const msg = handleApiError(error);
      toast.error(msg);
    } finally {
      setIsStarting(false);
      setActiveQuizId(null);
    }
  };

  if (examData) {
    return (
      <>
        <Seo title={examData.quizTitle || "Quiz"} />
        <QuizExamPlayground
          examData={examData}
          assignmentId={assignmentId}
          onFinish={(isTimeUp) => router.push(`/dashboard/assignments/homework${isTimeUp ? "?timeup=1" : ""}`)}
        />
      </>
    );
  }

  if (customLoading || isLoading) {
    return <QuizPlaygroundSkeleton />;
  }

  return (
    <>
      <Seo title={assignmentInfo?.title || "Quiz"} />
      <div className="min-h-screen bg-[#FDFDFF] text-slate-900 selection:bg-primary/10 pb-10">

        {/* Header Nav */}
        <nav className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-8 flex justify-between items-center">
          <button
            onClick={() => router.push("/dashboard/assignments/homework")}
            className="group flex items-center gap-2 text-slate-400 hover:text-slate-900 transition-all font-bold text-xs md:text-sm"
          >
            <div className="w-8 h-8 rounded-full border border-slate-100 flex items-center justify-center group-hover:bg-slate-50 transition-all">
              <ChevronLeft size={16} />
            </div>
            <span className="hidden xs:inline">{intl.formatMessage({ id: "Ortga qaytish" })}</span>
          </button>
          <div className="flex items-center gap-2">
            <ShieldCheck className="text-emerald-500" size={16} />
            <span className="text-[9px] md:text-[10px] font-black uppercase tracking-wider md:tracking-[0.2em] text-slate-400">
              {intl.formatMessage({ id: "Secure Environment" })}
            </span>
          </div>
        </nav>

        <main className="max-w-7xl mx-auto px-4 md:px-6 grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12">

          {/* Chap taraf */}
          <div className="lg:col-span-7 flex flex-col justify-center space-y-6 md:space-y-8">
            <div>
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 text-[9px] md:text-[10px] font-black uppercase tracking-widest mb-4 md:mb-6">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                </span>
                Quiz
              </span>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-black tracking-tight leading-tight mb-4 md:mb-6">
                {assignmentInfo?.title}
              </h1>
              <p className="text-base md:text-lg text-slate-500 font-medium leading-relaxed max-w-2xl">
                {assignmentInfo?.description || intl.formatMessage({ id: "Ushbu vazifani bajaring va natijangizni tekshiring." })}
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-3 md:gap-4">
              <div className="bg-white p-4 md:p-6 rounded-2xl md:rounded-[2.5rem] border border-slate-100 shadow-sm">
                <FileQuestion className="text-primary mb-2 md:mb-3" size={20} />
                <p className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest">{intl.formatMessage({ id: "Quizlar soni" })}</p>
                <p className="text-lg md:text-xl font-black">{quizzes.length} {intl.formatMessage({ id: "ta" })}</p>
              </div>
              <div className="bg-white p-4 md:p-6 rounded-2xl md:rounded-[2.5rem] border border-slate-100 shadow-sm">
                <Clock className="text-blue-500 mb-2 md:mb-3" size={20} />
                <p className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest">{intl.formatMessage({ id: "Muddat" })}</p>
                <p className="text-lg md:text-xl font-black">{assignmentInfo?.deadline ? new Date(assignmentInfo.deadline).toLocaleDateString("uz-UZ") : "—"}</p>
              </div>
            </div>

            {/* Warning */}
            <div className="p-5 md:p-8 bg-orange-50/50 rounded-2xl md:rounded-[3rem] border border-orange-100/50 flex gap-4 md:gap-6 items-start">
              <div className="w-10 h-10 md:w-12 md:h-12 shrink-0 rounded-xl md:rounded-2xl bg-orange-100 flex items-center justify-center text-orange-600">
                <AlertCircle size={20} />
              </div>
              <div>
                <h4 className="font-black text-orange-900 text-sm md:text-base mb-1">{intl.formatMessage({ id: "Muhim eslatma" })}</h4>
                <p className="text-xs md:text-sm text-orange-800/70 font-medium leading-relaxed">
                  {intl.formatMessage({ id: "Quizni boshlaganingizdan so'ng sahifani yangilamang va chiqib ketmang!" })}
                </p>
              </div>
            </div>
          </div>

          {/* O'ng taraf: Quiz ro'yxati */}
          <div className="lg:col-span-5 relative">
            <div className="bg-white rounded-2xl md:rounded-[3rem] lg:rounded-[4rem] p-6 md:p-10 border border-slate-100 shadow-[0_20px_40px_-12px_rgba(0,0,0,0.05)] lg:sticky lg:top-10">
              <h3 className="text-xl md:text-2xl font-black mb-6 md:mb-8 flex items-center justify-between">
                {intl.formatMessage({ id: "Quizlar ro'yxati" })}
                <BookOpen size={20} className="text-slate-300" />
              </h3>

              <div className="space-y-2 md:space-y-3">
                {quizzes.map((quiz, idx) => (
                  <div
                    key={quiz.id}
                    className="group flex items-center justify-between p-3 md:p-4 rounded-xl md:rounded-3xl bg-slate-50/50 border border-transparent hover:border-primary/20 hover:bg-white transition-all"
                  >
                    <div className="flex items-center gap-3 md:gap-4">
                      <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg md:rounded-2xl bg-white flex items-center justify-center shadow-sm font-black text-slate-400 text-sm">
                        {String(idx + 1).padStart(2, "0")}
                      </div>
                      <div>
                        <p className="font-bold text-slate-800 text-sm md:text-base leading-tight">
                          {quiz.title}
                        </p>
                        <p className="text-[9px] md:text-[10px] text-slate-400 font-black uppercase tracking-tighter">
                          {quiz.status || intl.formatMessage({ id: "Not Started" })}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => handleStartQuiz(quiz)}
                      disabled={isStarting}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-black hover:bg-primary transition-all disabled:opacity-50"
                    >
                      {isStarting && activeQuizId === quiz.id ? (
                        <Loader2 className="animate-spin" size={14} />
                      ) : (
                        <>
                          {intl.formatMessage({ id: "Boshlash" })}
                          <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                        </>
                      )}
                    </button>
                  </div>
                ))}

                {quizzes.length === 0 && (
                  <div className="text-center py-10 text-slate-400">
                    <FileQuestion size={40} className="mx-auto mb-3 opacity-30" />
                    <p className="text-sm font-medium">{intl.formatMessage({ id: "Quizlar topilmadi" })}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

        </main>
      </div>
    </>
  );
};

const QuizPlaygroundSkeleton = () => (
  <div className="min-h-screen bg-[#FDFDFF] animate-pulse pb-10">
    <nav className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-8 flex justify-between items-center">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-slate-100" />
        <div className="h-4 w-24 bg-slate-100 rounded-lg hidden xs:inline" />
      </div>
      <div className="h-4 w-32 bg-slate-50 rounded-lg" />
    </nav>
    <main className="max-w-7xl mx-auto px-4 md:px-6 grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12">
      <div className="lg:col-span-7 flex flex-col justify-center space-y-8">
        <div>
          <div className="h-6 w-20 bg-orange-100 rounded-full mb-6" />
          <div className="h-16 md:h-24 w-full bg-slate-100 rounded-3xl mb-6" />
          <div className="space-y-3">
            <div className="h-4 w-full bg-slate-50 rounded-lg" />
            <div className="h-4 w-2/3 bg-slate-50 rounded-lg" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {[1, 2].map((i) => (
            <div key={i} className="bg-white p-6 rounded-[2.5rem] border border-slate-100 space-y-3">
              <div className="h-6 w-6 bg-orange-50 rounded-lg" />
              <div className="h-3 w-16 bg-slate-100 rounded-full" />
              <div className="h-6 w-20 bg-slate-200 rounded-lg" />
            </div>
          ))}
        </div>
        <div className="p-8 bg-orange-50/50 rounded-[3rem] border border-orange-100/50 flex gap-6 items-start">
          <div className="w-12 h-12 shrink-0 rounded-2xl bg-orange-100" />
          <div className="flex-1 space-y-3">
            <div className="h-5 w-32 bg-orange-200/50 rounded-lg" />
            <div className="h-4 w-full bg-orange-100/50 rounded-lg" />
          </div>
        </div>
      </div>
      <div className="lg:col-span-5">
        <div className="bg-white rounded-[3rem] lg:rounded-[4rem] p-10 border border-slate-100 shadow-sm space-y-8">
          <div className="flex justify-between items-center">
            <div className="h-8 w-40 bg-slate-200 rounded-xl" />
            <div className="h-6 w-6 bg-slate-100 rounded-full" />
          </div>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between p-4 rounded-3xl bg-slate-50/50">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-white border border-slate-50" />
                  <div className="space-y-2">
                    <div className="h-4 w-24 bg-slate-200 rounded-lg" />
                    <div className="h-2 w-16 bg-slate-100 rounded-full" />
                  </div>
                </div>
                <div className="h-8 w-20 bg-slate-200/50 rounded-xl" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  </div>
);

export default withAuthGuard(QuizPlaygroundPage, ["STUDENT"]);
