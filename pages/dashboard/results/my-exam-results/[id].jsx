import React from "react";
import { useRouter } from "next/router";
import useSWR from "swr";
import fetcher from "@/utils/fetcher";
import { useIntl } from "react-intl";
import Seo from "@/components/seo/seo";
import { AuthGuard } from "@/components/guard";
import { PageHeader } from "@/components/layout";
import { useModal } from "@/context/modal-context";
import {
  Type,
  BookOpen,
  Headphones,
  Clock,
  Target,
  Trophy,
  ArrowRight,
  Activity,
  ChevronRight,
} from "lucide-react";

const MyExamResults = () => {
  const router = useRouter();
  const intl = useIntl();
  const { openModal } = useModal();
  const { id: examId } = router.query;

  const { data, isLoading } = useSWR(
    examId ? [`submissions/my-results/`, examId] : null,
    (url, id) => fetcher(`${url}?exam_assignment_id=${id}`, {}, {}, true),
  );

  if (isLoading)
    return (
      <div className="min-h-screen flex items-center justify-center font-black text-slate-200 animate-pulse text-2xl italic">
        Mikan Loading...
      </div>
    );
  if (!data?.submission)
    return (
      <div className="p-20 text-center text-slate-400 font-bold">
        Natija topilmadi.
      </div>
    );

  const res = data.submission;
  const jlpt = res.results?.jlpt_result;
  const sections = res.results?.sections || {};

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    return `${mins} min`;
  };

  return (
    <>
      <Seo title={`${res.assignment_title} - Result`} />
      <AuthGuard roles={["STUDENT"]}>
        <PageHeader
          title={res.assignment_title}
          description={`${res.mock_test_title} • ${res.mock_test_level}`}
          backButton={true}
        />

        {/* Hero Section - Score Overview */}
        <div className="relative bg-slate-900 rounded-[2rem] p-1 overflow-hidden">
          <div className="absolute top-0 right-0 p-12 opacity-10 pointer-events-none">
            <Trophy size={200} className="text-white" />
          </div>

          <div className="relative bg-white rounded-[2rem] p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="flex flex-col items-center md:items-start">
              <div
                className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-4 ${jlpt?.passed ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"}`}
              >
                {intl.formatMessage({
                  id: jlpt?.passed ? "Passed" : "Not Passed",
                })}
              </div>
              <h1 className="text-slate-900 text-5xl md:text-7xl font-black tracking-tighter flex items-baseline">
                {Math.round(res.score)}
                <span className="text-slate-200 text-3xl ml-2">/180</span>
              </h1>
              <p className="text-slate-400 font-bold mt-2 uppercase text-[10px] tracking-widest italic">
                {intl.formatMessage({ id: "Umumiy Ball" })}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 w-full md:w-auto">
              <StatBox
                icon={<Clock size={18} />}
                label="Vaqt"
                value={formatTime(res.time_taken_seconds)}
                color="blue"
              />
              <StatBox
                icon={<Activity size={18} />}
                label="Accuracy"
                value={`${res.percentage}%`}
                color="orange"
              />
              <StatBox
                icon={<Target size={18} />}
                label="Required"
                value={jlpt?.pass_mark}
                color="green"
              />
              <StatBox
                icon={<Trophy size={18} />}
                label="Level"
                value={res.mock_test_level}
                color="purple"
              />
            </div>
          </div>
        </div>

        {/* Sections Analysis */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <AnalysisCard
            title="Vocabulary and Grammar"
            subtitle="Language Knowledge"
            icon={<Type size={22} />}
            color="indigo"
            data={jlpt?.section_results?.language_knowledge}
            onOpen={() =>
              openModal(
                "RESULT_VIEW",
                {
                  data: Object.values(sections).find(
                    (s) => s.section_type === "VOCAB",
                  ),
                },
                "middle",
              )
            }
          />
          <AnalysisCard
            title="Reading"
            subtitle="Comprehension"
            icon={<BookOpen size={22} />}
            color="amber"
            data={jlpt?.section_results?.reading}
            onOpen={() =>
              openModal(
                "RESULT_VIEW",
                {
                  data: Object.values(sections).find(
                    (s) => s.section_type === "READING",
                  ),
                },
                "middle",
              )
            }
          />
          <AnalysisCard
            title="Listening"
            subtitle="Audio Analysis"
            icon={<Headphones size={22} />}
            color="rose"
            data={jlpt?.section_results?.listening}
            onOpen={() =>
              openModal(
                "RESULT_VIEW",
                {
                  data: Object.values(sections).find(
                    (s) => s.section_type === "LISTENING",
                  ),
                },
                "middle",
              )
            }
          />
        </div>
      </AuthGuard>
    </>
  );
};

// Kichik dashboard stat boxlari
const StatBox = ({ icon, label, value, color }) => {
  const intl = useIntl();
  const colors = {
    blue: "text-blue-500",
    orange: "text-orange-500",
    green: "text-green-500",
    purple: "text-purple-500",
  };
  return (
    <div className="bg-slate-50 p-5 rounded-[2rem] border border-slate-100/50">
      <div className={`mb-2 ${colors[color]}`}>{icon}</div>
      <div className="text-xl font-black text-slate-800 leading-none">
        {intl.formatMessage({ id: value })}
      </div>
      <div className="text-[9px] font-bold text-slate-400 uppercase mt-1 tracking-wider">
        {intl.formatMessage({ id: label })}
      </div>
    </div>
  );
};

// Bo'limlar uchun yangi dizayndagi Card
const AnalysisCard = ({ title, subtitle, icon, color, data, onOpen }) => {
  if (!data) return null;
  const intl = useIntl();

  const colorVariants = {
    indigo: "bg-indigo-500 shadow-indigo-200",
    amber: "bg-amber-500 shadow-amber-200",
    rose: "bg-rose-500 shadow-rose-200",
  };

  return (
    <div className="group relative bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 overflow-hidden">
      <div
        className={`absolute top-0 right-0 w-24 h-24 translate-x-8 -translate-y-8 rounded-full opacity-5 ${colorVariants[color]}`}
      />

      <div className="flex justify-between items-start mb-8">
        <div
          className={`p-4 rounded-2xl text-white shadow-lg ${colorVariants[color]}`}
        >
          {icon}
        </div>
        <div className="text-right">
          <span className="block text-[10px] font-black text-slate-300 uppercase tracking-widest">
            {intl.formatMessage({ id: subtitle })}
          </span>
          <span className="text-2xl font-black text-slate-900 leading-none">
            {data.score}
          </span>
        </div>
      </div>

      <h3 className="text-xl font-black text-slate-800 mb-1">
        {intl.formatMessage({ id: title })}
      </h3>

      <div className="flex items-center gap-2 mb-8">
        <div className="h-1.5 flex-1 bg-slate-100 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-1000 ${data.passed ? "bg-green-500" : "bg-red-400"}`}
            style={{ width: `${(data.score / 60) * 100}%` }}
          />
        </div>
        <span className="text-[10px] font-bold text-slate-400 italic">
          min {data.min_required}
        </span>
      </div>

      <button
        onClick={onOpen}
        className="w-full py-4 rounded-2xl bg-slate-50 group-hover:bg-slate-900 group-hover:text-white text-slate-500 font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2"
      >
        {intl.formatMessage({ id: "Review Questions" })}
        <ChevronRight size={14} />
      </button>
    </div>
  );
};

export default MyExamResults;
