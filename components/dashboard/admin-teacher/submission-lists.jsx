import React from "react";
import { useRouter } from "next/router";
import useSWR from "swr";
import fetcher from "@/utils/fetcher";
import { useIntl } from "react-intl";
import Pagination from "@/components/ui/pagination";
import { EmptyMessage } from "@/components/custom/message";
import {
  Eye,
  CheckCircle2,
  XCircle,
  Type, // Vocabulary/Grammar uchun
  BookOpen, // Reading uchun
  Headphones, // Listening uchun
} from "lucide-react";
import { useModal } from "@/context/modal-context";

const SubmissionLists = () => {
  const router = useRouter();
  const intl = useIntl();
  const { id: examId, page = 1 } = router.query;

  const { data, isLoading } = useSWR(
    examId ? [`submissions/`, examId, page] : null,
    (url, id, p) =>
      fetcher(
        `${url}?exam_assignment_id=${id}&page=${p}&page_size=8`,
        {},
        {},
        true,
      ),
  );

  const formatDate = (dateString) => {
    if (!dateString) return "—";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("uz-UZ", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  if (!data?.results?.length) {
    return (
      <EmptyMessage
        titleKey="Natijalar topilmadi"
        descriptionKey="Ushbu imtihon bo'yicha hali hech qanday natija mavjud emas"
        iconKey="exams"
      />
    );
  }

  return (
    <div className="flex flex-col space-y-6 pb-10">
      <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden text-slate-900">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[1000px]">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100 text-slate-400">
                <th className="px-6 py-6 text-[10px] font-black uppercase tracking-widest text-center w-16">
                  №
                </th>
                <th className="px-6 py-6 text-[10px] font-black uppercase tracking-widest">
                  {intl.formatMessage({ id: "Talaba" })}
                </th>

                {/* Section Headers with Labels */}
                <th className="px-4 py-6 text-[10px] font-black uppercase tracking-widest text-center">
                  {intl.formatMessage({ id: "Vocabulary" })}
                </th>
                <th className="px-4 py-6 text-[10px] font-black uppercase tracking-widest text-center">
                  {intl.formatMessage({ id: "Reading" })}
                </th>
                <th className="px-4 py-6 text-[10px] font-black uppercase tracking-widest text-center">
                  {intl.formatMessage({ id: "Listening" })}
                </th>

                <th className="px-4 py-6 text-[10px] font-black uppercase tracking-widest text-center">
                  {intl.formatMessage({ id: "Jami" })}
                </th>
                <th className="px-6 py-6 text-[10px] font-black uppercase tracking-widest text-center">
                  {intl.formatMessage({ id: "Holat" })}
                </th>
                <th className="px-6 py-6 text-[10px] font-black uppercase tracking-widest">
                  {intl.formatMessage({ id: "Vaqt" })}
                </th>
                {/* <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-right">Amal</th> */}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {data.results.map((sub, index) => {
                const sections =
                  sub.results?.jlpt_result?.section_results || {};
                const isPassed = sub.results?.jlpt_result?.passed;

                const sectionDetails = sub.results?.sections || {};
                const jlptSections =
                  sub.results?.jlpt_result?.section_results || {};

                // Section turlariga qarab ID'larni topish (JSON structurega asoslanib)
                const vocabData = Object.values(sectionDetails).find(
                  (s) => s.section_type === "VOCAB",
                );
                const readingData = Object.values(sectionDetails).find(
                  (s) => s.section_type === "GRAMMAR_READING",
                );
                const listeningData = Object.values(sectionDetails).find(
                  (s) => s.section_type === "LISTENING",
                );

                return (
                  <tr
                    key={sub.id}
                    className="hover:bg-slate-50/80 transition-all group"
                  >
                    <td className="px-6 py-5 font-black text-slate-300 text-center text-sm">
                      {(page - 1) * 8 + (index + 1)}
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-black text-xs uppercase">
                          {sub.student_display?.charAt(0)}
                        </div>
                        <span className="font-black text-slate-700 text-sm whitespace-nowrap">
                          {sub.student_display}
                        </span>
                      </div>
                    </td>

                    {/* Section Result Components */}
                    <td className="px-4 py-5">
                      <SectionScore
                        result={vocabData}
                        icon={<Type size={14} />}
                        color="blue"
                      />
                    </td>
                    <td className="px-4 py-5">
                      <SectionScore
                        result={readingData}
                        icon={<BookOpen size={14} />}
                        color="orange"
                      />
                    </td>
                    <td className="px-4 py-5">
                      <SectionScore
                        result={listeningData}
                        icon={<Headphones size={14} />}
                        color="purple"
                      />
                    </td>

                    <td className="px-4 py-5 text-center font-black text-slate-900 text-lg">
                      {Math.round(sub.score)}
                    </td>

                    <td className="px-6 py-5 text-center">
                      <div
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${isPassed
                          ? "bg-green-50 text-green-600"
                          : "bg-red-50 text-red-600"
                          }`}
                      >
                        {isPassed ? (
                          <CheckCircle2 size={12} />
                        ) : (
                          <XCircle size={12} />
                        )}
                        {isPassed ? "Pass" : "Fail"}
                      </div>
                    </td>

                    <td className="px-6 py-5 font-bold text-slate-400 text-[11px] whitespace-nowrap">
                      {formatDate(sub.completed_at)}
                    </td>

                    {/* <td className="px-8 py-5 text-right">
                      <button
                        onClick={() => router.push(`/submissions/detail/${sub.id}`)}
                        className="p-2.5 bg-slate-100 text-slate-400 hover:bg-primary hover:text-white rounded-xl transition-all group-hover:shadow-lg shadow-orange-100/50"
                      >
                        <Eye size={18} />
                      </button>
                    </td> */}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {data?.count > 8 && (
        <div className="pt-6 flex justify-center">
          <div className="bg-white p-2 rounded-[2rem] shadow-sm border border-slate-100">
            <Pagination totalCount={data.count} pageSize={8} />
          </div>
        </div>
      )}
    </div>
  );
};

const SectionScore = ({ result, icon, color }) => {
  const { openModal } = useModal();
  if (!result)
    return (
      <div className="flex justify-center">
        <span className="text-slate-200 font-black">-</span>
      </div>
    );

  const colors = {
    blue: "text-blue-500 bg-blue-50",
    orange: "text-orange-500 bg-orange-50",
    purple: "text-purple-500 bg-purple-50",
  };

  return (
    <div className="flex items-center justify-center gap-3">
      <button
        type="button"
        onClick={() => openModal("RESULT_VIEW", { data: result }, "middle")}
        className={`p-2 rounded-lg border border-transparent hover:border-primary transition-colors duration-150 ${colors[color] || "bg-slate-50 text-slate-400"}`}
      >
        {icon}
      </button>
      <div className="flex flex-col items-start leading-none">
        <span
          className={`text-sm font-black ${result.passed ? "text-slate-700" : "text-red-500"}`}
        >
          {result.score}
        </span>
        <span className="text-[9px] font-bold text-slate-300 uppercase mt-0.5">
          min: 19
        </span>
      </div>
    </div>
  );
};

export default SubmissionLists;
