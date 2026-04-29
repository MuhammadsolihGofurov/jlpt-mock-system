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
  Download, FileSpreadsheet, FileText
} from "lucide-react";
import { useModal } from "@/context/modal-context";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";
import autoTable from "jspdf-autotable";

const SubmissionLists = ({ customLoading }) => {
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
        descriptionKey={intl.formatMessage({ id: "Ushbu imtihon bo'yicha hali hech qanday natija mavjud emas" })}
        iconKey="exams"
      />
    );
  }

  const exportToExcel = () => {
    const tableData = data.results.map((sub, index) => {
      const isDisqualified = sub.results?.disqualified || sub.disqualified;

      let statusText = intl.formatMessage({ id: sub.results?.jlpt_result?.passed ? "Pass" : "Fail" });
      if (isDisqualified) statusText = intl.formatMessage({ id: "Disqualified" });

      return {
        "№": index + 1,
        [intl.formatMessage({ id: "STUDENT" })]: sub.student_display,
        [intl.formatMessage({ id: "Vocabulary" })]: Object.values(sub.results?.sections || {}).find(s => s.section_type === "VOCAB")?.score || 0,
        [intl.formatMessage({ id: "Reading" })]: Object.values(sub.results?.sections || {}).find(s => s.section_type === "GRAMMAR_READING")?.score || 0,
        [intl.formatMessage({ id: "Listening" })]: Object.values(sub.results?.sections || {}).find(s => s.section_type === "LISTENING")?.score || 0,
        [intl.formatMessage({ id: "total" })]: isDisqualified ? 0 : Math.round(sub.score),
        [intl.formatMessage({ id: "Holat" })]: statusText,
        [intl.formatMessage({ id: "Sana" })]: formatDate(sub.completed_at)
      };
    });

    const worksheet = XLSX.utils.json_to_sheet(tableData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Natijalar");
    XLSX.writeFile(workbook, `Imtihon_Natijalari_${examId}.xlsx`)
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text(intl.formatMessage({ id: "Topshirilgan natijalar" }), 14, 15);

    const tableRows = data.results.map((sub, index) => {
      const isDisqualified = sub.results?.disqualified || sub.disqualified;

      let statusLabel = intl.formatMessage({ id: sub.results?.jlpt_result?.passed ? "Pass" : "Fail" });
      if (isDisqualified) statusLabel = intl.formatMessage({ id: "Disqualified" });

      return [
        (page - 1) * 8 + (index + 1),
        sub.student_display,
        Object.values(sub.results?.sections || {}).find(s => s.section_type === "VOCAB")?.score || 0,
        Object.values(sub.results?.sections || {}).find(s => s.section_type === "GRAMMAR_READING")?.score || 0,
        Object.values(sub.results?.sections || {}).find(s => s.section_type === "LISTENING")?.score || 0,
        isDisqualified ? "0 (DQ)" : Math.round(sub.score),
        statusLabel,
      ];
    });

    autoTable(doc, {
      head: [[
        '№',
        intl.formatMessage({ id: "STUDENT" }),
        intl.formatMessage({ id: "Vocabulary" }),
        intl.formatMessage({ id: 'Reading' }),
        intl.formatMessage({ id: 'Listening' }),
        intl.formatMessage({ id: "total" }),
        intl.formatMessage({ id: "Holat" })
      ]],
      body: tableRows,
      startY: 25,
      styles: { font: "helvetica", fontSize: 10 },
      headStyles: { fillColor: [71, 85, 105] },
      // Diskvalifikatsiya qatorlarini qizil qilish uchun:
      didParseCell: function (data) {
        if (data.section === 'body' && data.column.index === 6) {
          if (data.cell.raw === 'DISQUALIFIED') {
            data.cell.styles.textColor = [255, 0, 0]; // Qizil rang
            data.cell.styles.fontStyle = 'bold';
          }
        }
      }
    });

    doc.save(`Natijalar_${examId}_page_${page}.pdf`);
  };

  if (customLoading || isLoading) {
    return <TableSkeleton />
  }

  return (
    <div className="flex flex-col space-y-6 pb-10">
      <div className="flex justify-between sm:flex-row flex-col gap-2 sm:items-center bg-white p-4 rounded-3xl border border-slate-100">
        <h2 className="text-base font-semibold text-slate-800 ml-2">
          {intl.formatMessage({ id: "Natijalarni yuklash" })}
        </h2>
        <div className="flex gap-2">
          <button
            onClick={exportToExcel}
            className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-600 hover:bg-green-100 rounded-xl font-bold text-sm transition-all"
          >
            <FileSpreadsheet size={18} />
            Excel
          </button>
          <button
            onClick={exportToPDF}
            className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-xl font-bold text-sm transition-all"
          >
            <FileText size={18} />
            PDF
          </button>
        </div>
      </div>

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

                const isDisqualified = sub.results?.disqualified || sub.disqualified;
                const disqualificationReason = sub.results?.disqualification_reason || sub.disqualification_reason;

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
                      {isDisqualified ? (
                        <div className="inline-flex flex-col items-center gap-1">
                          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider bg-black text-white">
                            <XCircle size={12} />
                            {intl.formatMessage({ id: "Disqualified" })}
                          </div>
                          {/* Incident vaqtini ko'rsatish (ixtiyoriy) */}
                          <span className="text-[8px] text-red-500 font-bold uppercase">
                            {sub?.results?.integrity_incident?.events?.map(e => e.type).join(", ")}
                          </span>
                        </div>
                      ) : (
                        <div
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${isPassed ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"
                            }`}
                        >
                          {isPassed ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
                          {isPassed ? "Pass" : "Fail"}
                        </div>
                      )}
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


const TableSkeleton = () => {
  // 8 ta qator chiqarish uchun massiv
  const rows = Array(8).fill(null);

  return (
    <div className="flex flex-col space-y-6 pb-10 animate-pulse">
      {/* Header Skeleton */}
      <div className="flex justify-between sm:flex-row flex-col gap-2 sm:items-center bg-white p-4 rounded-3xl border border-slate-100">
        <div className="h-6 w-48 bg-orange-100 rounded-lg ml-2"></div>
        <div className="flex gap-2">
          <div className="h-10 w-24 bg-orange-50 rounded-xl"></div>
          <div className="h-10 w-24 bg-red-50 rounded-xl"></div>
        </div>
      </div>

      {/* Table Skeleton */}
      <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[1000px]">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                {Array(9).fill(null).map((_, i) => (
                  <th key={i} className="px-6 py-6">
                    <div className="h-3 bg-slate-200 rounded w-full"></div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {rows.map((_, index) => (
                <tr key={index}>
                  {/* № */}
                  <td className="px-6 py-5">
                    <div className="h-4 w-4 bg-slate-100 rounded mx-auto"></div>
                  </td>
                  {/* Student Info */}
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-orange-200/50"></div>
                      <div className="h-4 w-32 bg-slate-100 rounded"></div>
                    </div>
                  </td>
                  {/* Section Scores (4 ta) */}
                  {Array(4).fill(null).map((_, i) => (
                    <td key={i} className="px-4 py-5">
                      <div className="h-10 w-28 bg-orange-50/60 rounded-xl mx-auto border border-orange-100/50"></div>
                    </td>
                  ))}
                  {/* Total Score */}
                  <td className="px-4 py-5">
                    <div className="h-6 w-10 bg-orange-200/40 rounded-lg mx-auto"></div>
                  </td>
                  {/* Status (Pass/Fail) */}
                  <td className="px-6 py-5">
                    <div className="h-7 w-20 bg-slate-100 rounded-lg mx-auto"></div>
                  </td>
                  {/* Time */}
                  <td className="px-6 py-5">
                    <div className="h-4 w-24 bg-slate-50 rounded"></div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination Skeleton */}
      <div className="pt-6 flex justify-center">
        <div className="bg-white p-2 rounded-[2rem] border border-slate-100">
          <div className="h-10 w-64 bg-slate-50 rounded-[2rem]"></div>
        </div>
      </div>
    </div>
  );
};

export default SubmissionLists;
