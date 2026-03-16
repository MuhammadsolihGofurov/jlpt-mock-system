import React, { useState } from "react";
import { useRouter } from "next/router";
import useSWR from "swr";
import fetcher from "@/utils/fetcher";
import { Seo } from "@/components/seo";
import { AuthGuard } from "@/components/guard";
import { useIntl } from "react-intl";
import {
  Play,
  Clock,
  BookOpen,
  Award,
  AlertCircle,
  CheckCircle2,
  PlayCircle,
} from "lucide-react";
import { ExamPlayground } from "@/components/custom/playground";
import { authAxios } from "@/utils/axios";
import { handleApiError } from "@/utils/handle-error";

const HomePlaygroundPage = () => {
  const router = useRouter();
  const intl = useIntl();
  const { id: examId } = router.query;
  const [examData, setExamData] = useState(null);
  const [isStarting, setIsStarting] = useState(false);

  const { data: examInfo, isLoading } = useSWR(
    examId ? [`/exam-assignments/${examId}/`, router.locale] : null,
    (url, locale) =>
      fetcher(url, { headers: { "Accept-Language": locale } }, {}, true),
  );

  const { data: mockInfo } = useSWR(
    examInfo ? [`/mock-tests/${examInfo?.mock_test}/`, router.locale] : null,
    (url, locale) =>
      fetcher(url, { headers: { "Accept-Language": locale } }, {}, true),
  );

  const handleStartExam = async () => {
    try {
      setIsStarting(true);
      const res = await authAxios.post("/submissions/start-exam/", {
        exam_assignment_id: examId,
      });
      setExamData(res.data);
    } catch (error) {
      console.error("Start exam error:", error);
      const msg = handleApiError(error);

      toast.error(msg);
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
        <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4 md:p-8">
          <div className="max-w-4xl w-full bg-white rounded-[3.5rem] shadow-2xl shadow-slate-200/60 border border-slate-100 overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-5 h-full">
              <div className="lg:col-span-2 bg-slate-900 p-10 text-white flex flex-col justify-between">
                <div>
                  <div className="inline-block px-4 py-1.5 rounded-full bg-primary/20 text-primary border border-primary/30 text-xs font-black uppercase tracking-widest mb-6">
                    {examInfo?.mock_test?.level || "JLPT"}
                  </div>
                  <h1 className="text-4xl font-black leading-tight mb-4 text-white">
                    {examInfo?.title}
                  </h1>
                  <p className="text-slate-400 font-medium leading-relaxed">
                    {examInfo?.description}
                  </p>
                </div>

                <div className="mt-12 space-y-4">
                  {/* <div className="flex items-center gap-4 group">
                    <div className="w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center group-hover:bg-primary transition-colors">
                      <Clock
                        size={20}
                        className="text-primary group-hover:text-white"
                      />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 font-bold uppercase tracking-tighter">
                        {intl.formatMessage({ id: "Umumiy vaqt" })}
                      </p>
                      <p className="font-black text-lg">
                        {mockInfo?.total_duration || 0}{" "}
                        {intl.formatMessage({ id: "minut" })}
                      </p>
                    </div>
                  </div> */}
                  <div className="flex items-center gap-4 group">
                    <div className="w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center group-hover:bg-primary transition-colors">
                      <Award
                        size={20}
                        className="text-primary group-hover:text-white"
                      />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 font-bold uppercase tracking-tighter">
                        {intl.formatMessage({ id: "O'tish balli" })}
                      </p>
                      <p className="font-black text-lg">
                        {mockInfo?.pass_score || 0} ball
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* O'ng taraf: Bo'limlar va Start tugmasi */}
              <div className="lg:col-span-3 p-10 flex flex-col justify-center">
                <h3 className="text-xl font-black text-slate-800 mb-8 flex items-center gap-3">
                  <BookOpen className="text-primary" />
                  {intl.formatMessage({ id: "Imtihon tarkibi" })}
                </h3>

                <div className="space-y-4 mb-10">
                  {mockInfo?.sections?.map((section, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-5 rounded-3xl bg-slate-50 border border-slate-100 hover:border-primary/30 transition-all group"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm font-black text-primary">
                          {idx + 1}
                        </div>
                        <div>
                          <p className="font-black text-slate-700 leading-none">
                            {section.name}
                          </p>
                          <p className="text-xs text-slate-400 mt-1 font-bold">
                            {section.section_type}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-black text-slate-600">
                          {section.duration} m
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="bg-orange-50/50 p-6 rounded-3xl border border-orange-100 mb-8">
                  <div className="flex gap-4">
                    <AlertCircle className="text-primary shrink-0" />
                    <p className="text-sm text-orange-800 font-medium leading-relaxed">
                      {intl.formatMessage({
                        id: "Imtihonni boshlaganingizdan so'ng taymerni to'xtatib bo'lmaydi. Sahifani yangilamang!",
                      })}
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleStartExam}
                  disabled={isStarting}
                  className="w-full py-4 bg-primary hover:bg-primary-dark disabled:bg-slate-300 text-white rounded-[2rem] font-semibold text-xl shadow-2xl shadow-orange-200 transition-all flex items-center justify-center gap-4 active:scale-[0.98]"
                >
                  {isStarting ? (
                    <span className="animate-pulse">
                      {intl.formatMessage({ id: "Yuklanmoqda..." })}
                    </span>
                  ) : (
                    <>
                      {intl.formatMessage({ id: "Imtihonni boshlash" })}
                      <PlayCircle size={18} />
                    </>
                  )}
                </button>
                <button
                  onClick={() => router.push("/dashboard/assignments/exam")}
                  className="w-full mt-3 hover:text-primary"
                >
                  {intl.formatMessage({ id: "Ortga qaytish" })}
                </button>
              </div>
            </div>
          </div>
        </div>
      </AuthGuard>
    </>
  );
};

export default HomePlaygroundPage;
