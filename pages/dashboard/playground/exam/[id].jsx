import React, { useState } from "react";
import { useRouter } from "next/router";
import useSWR from "swr";
import fetcher from "@/utils/fetcher";
import { Seo } from "@/components/seo";
import { AuthGuard } from "@/components/guard";
import { useIntl } from "react-intl";
import {
  BookOpen,
  Award,
  AlertCircle,
  ChevronLeft,
  Timer,
  ShieldCheck,
  ArrowRight,
  Loader2
} from "lucide-react";
import { ExamPlayground } from "@/components/custom/playground";
import { authAxios } from "@/utils/axios";
import { handleApiError } from "@/utils/handle-error";
import { toast } from "react-toastify";

const ExamPlaygroundPage = () => {
  const router = useRouter();
  const intl = useIntl();
  const { id: examId } = router.query;
  const [examData, setExamData] = useState(null);
  const [isStarting, setIsStarting] = useState(false);

  const { data: examInfo, isLoading } = useSWR(
    examId ? [`/exam-assignments/${examId}/`, router.locale] : null,
    (url, locale) => fetcher(url, { headers: { "Accept-Language": locale } }, {}, true)
  );

  const { data: mockInfo } = useSWR(
    examInfo ? [`/mock-tests/${examInfo?.mock_test}/`, router.locale] : null,
    (url, locale) => fetcher(url, { headers: { "Accept-Language": locale } }, {}, true)
  );

  const handleStartExam = async () => {
    try {
      setIsStarting(true);
      const res = await authAxios.post("/submissions/start-exam/", {
        exam_assignment_id: examId,
      });
      setExamData(res.data);
    } catch (error) {
      const msg = handleApiError(error);
      if (msg == "You have already completed this exam. Each exam can only be attempted once.") {
        toast.error(intl.formatMessage({ id: "Siz ushbu imtihonni allaqachon topshirgansiz!" }));
      } else {
        toast.error(msg);
      }
    } finally {
      setIsStarting(false);
    }
  };

  if (examData) {
    return <ExamPlayground examData={examData} />;
  }

  return (
    <>
      <Seo title={examInfo?.title || "Exam"} />
      <AuthGuard roles={["STUDENT"]}>
        <div className="min-h-screen bg-[#FDFDFF] text-slate-900 selection:bg-primary/10 pb-10">

          {/* Header Nav */}
          <nav className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-8 flex justify-between items-center">
            <button
              onClick={() => router.push("/dashboard/assignments/exam")}
              className="group flex items-center gap-2 text-slate-400 hover:text-slate-900 transition-all font-bold text-xs md:text-sm"
            >
              <div className="w-8 h-8 rounded-full border border-slate-100 flex items-center justify-center group-hover:bg-slate-50 transition-all">
                <ChevronLeft size={16} />
              </div>
              <span className="hidden xs:inline">{intl.formatMessage({ id: "Ortga qaytish" })}</span>
            </button>
            <div className="flex items-center gap-2">
              <ShieldCheck className="text-emerald-500" size={16} />
              <span className="text-[9px] md:text-[10px] font-black uppercase tracking-wider md:tracking-[0.2em] text-slate-400">Secure Environment</span>
            </div>
          </nav>

          <main className="max-w-7xl mx-auto px-4 md:px-6 grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12">

            {/* Chap taraf: Ma'lumotlar */}
            <div className="lg:col-span-7 flex flex-col justify-center space-y-6 md:space-y-8">
              <div>
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 text-[9px] md:text-[10px] font-black uppercase tracking-widest mb-4 md:mb-6">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                  </span>
                  {examInfo?.mock_test?.level || "JLPT"} Level Exam
                </span>
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-black tracking-tight leading-tight mb-4 md:mb-6">
                  {examInfo?.title}
                </h1>
                <p className="text-base md:text-lg text-slate-500 font-medium leading-relaxed max-w-2xl">
                  {examInfo?.description || "Ushbu imtihon sizning bilimlaringizni real vaqt rejimida tekshirish uchun mo'ljallangan."}
                </p>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
                {/* <div className="bg-white p-4 md:p-6 rounded-2xl md:rounded-[2.5rem] border border-slate-100 shadow-sm">
                  <Timer className="text-primary mb-2 md:mb-3" size={20} />
                  <p className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest">Davomiyligi</p>
                  <p className="text-lg md:text-xl font-black">{mockInfo?.total_duration || 0} min</p>
                </div> */}
                <div className="bg-white p-4 md:p-6 rounded-2xl md:rounded-[2.5rem] border border-slate-100 shadow-sm">
                  <Award className="text-emerald-500 mb-2 md:mb-3" size={20} />
                  <p className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest">O'tish balli</p>
                  <p className="text-lg md:text-xl font-black">{mockInfo?.pass_score || 0} ball</p>
                </div>
                <div className="bg-white p-4 md:p-6 rounded-2xl md:rounded-[2.5rem] border border-slate-100 shadow-sm col-span-2 md:col-span-1">
                  <BookOpen className="text-blue-500 mb-2 md:mb-3" size={20} />
                  <p className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest">Bo'limlar</p>
                  <p className="text-lg md:text-xl font-black">{mockInfo?.sections?.length || 0} ta bo'lim</p>
                </div>
              </div>

              {/* Warning Box */}
              <div className="p-5 md:p-8 bg-orange-50/50 rounded-2xl md:rounded-[3rem] border border-orange-100/50 flex gap-4 md:gap-6 items-start">
                <div className="w-10 h-10 md:w-12 md:h-12 shrink-0 rounded-xl md:rounded-2xl bg-orange-100 flex items-center justify-center text-orange-600">
                  <AlertCircle size={20} />
                </div>
                <div>
                  <h4 className="font-black text-orange-900 text-sm md:text-base mb-1">Muhim eslatma</h4>
                  <p className="text-xs md:text-sm text-orange-800/70 font-medium leading-relaxed">
                    Imtihonni boshlaganingizdan so'ng taymerni to'xtatib bo'lmaydi. Sahifani yangilamang!
                  </p>
                </div>
              </div>
            </div>

            {/* O'ng taraf: Struktura va Start */}
            <div className="lg:col-span-5 relative">
              <div className="bg-white rounded-2xl md:rounded-[3rem] lg:rounded-[4rem] p-6 md:p-10 border border-slate-100 shadow-[0_20px_40px_-12px_rgba(0,0,0,0.05)] lg:sticky lg:top-10">
                <h3 className="text-xl md:text-2xl font-black mb-6 md:mb-8 flex items-center justify-between">
                  {intl.formatMessage({ id: "Imtihon tarkibi" })}
                  <BookOpen size={20} className="text-slate-300" />
                </h3>

                <div className="space-y-2 md:space-y-3 mb-8 md:mb-12 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                  {mockInfo?.sections?.map((section, idx) => (
                    <div
                      key={idx}
                      className="group flex items-center justify-between p-3 md:p-4 rounded-xl md:rounded-3xl bg-slate-50/50 border border-transparent hover:border-primary/20 hover:bg-white transition-all"
                    >
                      <div className="flex items-center gap-3 md:gap-4">
                        <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg md:rounded-2xl bg-white flex items-center justify-center shadow-sm font-black text-slate-400 text-sm">
                          {String(idx + 1).padStart(2, '0')}
                        </div>
                        <div>
                          <p className="font-bold text-slate-800 text-sm md:text-base leading-tight">
                            {section.name}
                          </p>
                          <p className="text-[9px] md:text-[10px] text-slate-400 font-black uppercase tracking-tighter">
                            {section.section_type}
                          </p>
                        </div>
                      </div>
                      <div className="bg-slate-200/50 px-2 md:px-3 py-1 rounded-full text-[9px] md:text-[10px] font-black text-slate-500 whitespace-nowrap">
                        {section.duration} MIN
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  onClick={handleStartExam}
                  disabled={isStarting || isLoading}
                  className="w-full relative group overflow-hidden py-4 md:py-6 bg-slate-900 text-white rounded-xl md:rounded-[2.5rem] font-black text-lg md:text-xl transition-all hover:bg-primary active:scale-[0.98] disabled:bg-slate-200 disabled:text-slate-400 shadow-xl shadow-slate-200"
                >
                  <div className="relative z-10 flex items-center justify-center gap-3 md:gap-4">
                    {isStarting ? (
                      <Loader2 className="animate-spin" size={20} />
                    ) : (
                      <>
                        {intl.formatMessage({ id: "Imtihonni boshlash" })}
                        <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-r from-primary to-orange-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </button>
              </div>
            </div>

          </main>
        </div>
      </AuthGuard>
    </>
  );
};

export default ExamPlaygroundPage;