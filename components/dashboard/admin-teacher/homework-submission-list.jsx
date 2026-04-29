import React from "react";
import { useRouter } from "next/router";
import useSWR from "swr";
import fetcher from "@/utils/fetcher";
import { useIntl } from "react-intl";
import Pagination from "@/components/ui/pagination";
import { EmptyMessage } from "@/components/custom/message";
import {
    CheckCircle2,
    XCircle,
    Type,
    BookOpen,
    Headphones,
    LayoutGrid,
    FileSpreadsheet, FileText
} from "lucide-react";
import { useModal } from "@/context/modal-context";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const HomeworkSubmissionList = () => {
    const router = useRouter();
    const intl = useIntl();
    const { id: homeworkId, page = 1 } = router.query;

    const { data, isLoading } = useSWR(
        homeworkId ? [`submissions/`, homeworkId, page] : null,
        (url, id, p) => fetcher(`${url}?homework_assignment_id=${id}&page=${p}&page_size=10`, {}, {}, true)
    );

    const formatDate = (dateString) => {
        if (!dateString) return "—";
        return new Intl.DateTimeFormat("uz-UZ", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        }).format(new Date(dateString));
    };

    if (isLoading) return <div className="p-10 text-center animate-pulse font-bold text-slate-300">{intl.formatMessage({ id: "Yuklanmoqda..." })}</div>;

    if (!data?.results?.length) {
        return (
            <EmptyMessage
                titleKey="Natijalar topilmadi"
                descriptionKey="Ushbu uy vazifasi bo'yicha hali hech qanday natija mavjud emas"
                iconKey="exams"
            />
        );
    }


    const exportToExcel = () => {
        const tableData = data.results.map((sub, index) => {
            const isMock = sub.results?.resource_type === "mock_test";
            const sections = sub.results?.sections || {};

            return {
                "№": (page - 1) * 10 + (index + 1),
                [intl.formatMessage({ id: "Talaba" })]: sub.student_display,
                [intl.formatMessage({ id: "Topshiriq" })]: sub.assignment_title,
                [intl.formatMessage({ id: "Turi" })]: sub.results?.resource_type,
                [intl.formatMessage({ id: "Vocab / Quiz" })]: isMock ? (Object.values(sections).find(s => s.section_type === "VOCAB")?.score || 0) : sub.results?.total_score,
                [intl.formatMessage({ id: "Reading" })]: isMock ? (Object.values(sections).find(s => s.section_type === "GRAMMAR_READING")?.score || 0) : "—",
                [intl.formatMessage({ id: "Listening" })]: isMock ? (Object.values(sections).find(s => s.section_type === "LISTENING")?.score || 0) : "—",
                [intl.formatMessage({ id: "Jami Ball" })]: Math.round(sub.score),
                [intl.formatMessage({ id: "Holat" })]: (isMock ? sub.results?.jlpt_result?.passed : sub.results?.percentage >= 50) ? intl.formatMessage({ id: "Pass" }) : intl.formatMessage({ id: "Fail" }),
                [intl.formatMessage({ id: "Sana" })]: formatDate(sub.completed_at)
            };
        });

        const worksheet = XLSX.utils.json_to_sheet(tableData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Uy vazifalari");
        XLSX.writeFile(workbook, `Vazifalar_${homeworkId}.xlsx`);
    };

    const exportToPDF = () => {
        const doc = new jsPDF("l", "mm", "a4"); // "l" - landscape (albom) ko'rinishi, ustunlar ko'p bo'lgani uchun

        doc.setFontSize(16);
        doc.text(intl.formatMessage({ id: "Uy vazifasi natijalari (Batafsil)" }), 14, 15);

        const tableHeaders = [
            ['№', intl.formatMessage({ id: "Talaba" }), intl.formatMessage({ id: "Topshiriq turi" }), intl.formatMessage({ id: "Vocab / Quiz" }), intl.formatMessage({ id: "Reading" }), intl.formatMessage({ id: "Listening" }), intl.formatMessage({ id: "Jami" }), intl.formatMessage({ id: "Holat" }), intl.formatMessage({ id: "Sana" })]
        ];

        const tableRows = data.results.map((sub, index) => {
            const isMock = sub.results?.resource_type === "mock_test";
            const sections = sub.results?.sections || {};

            // Mock bo'lsa bo'limlarni topamiz, bo'lmasa Quiz ballini Vocab ustuniga yozamiz
            const vocabScore = isMock
                ? (Object.values(sections).find(s => s.section_type === "VOCAB")?.score || 0)
                : (sub.results?.total_score || 0);

            const readingScore = isMock
                ? (Object.values(sections).find(s => s.section_type === "GRAMMAR_READING")?.score || 0)
                : "—";

            const listeningScore = isMock
                ? (Object.values(sections).find(s => s.section_type === "LISTENING")?.score || 0)
                : "—";

            const status = (isMock ? sub.results?.jlpt_result?.passed : sub.results?.percentage >= 50)
                ? "Pass"
                : "Fail";

            return [
                (page - 1) * 10 + (index + 1),
                sub.student_display,
                sub.results?.resource_type?.toUpperCase(),
                vocabScore,
                readingScore,
                listeningScore,
                Math.round(sub.score),
                status,
                formatDate(sub.completed_at).split(',')[0]
            ];
        });

        autoTable(doc, {
            head: tableHeaders,
            body: tableRows,
            startY: 25,
            theme: 'grid',
            styles: { fontSize: 8, halign: 'center' },
            headStyles: { fillColor: [79, 70, 229], fontStyle: 'bold' },
            columnStyles: {
                1: { halign: 'left', fontStyle: 'bold' },
            },
        });

        doc.save(`Batafsil_Natijalar_${homeworkId}.pdf`);
    };

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
            <div className="bg-white rounded-[2rem] border border-slate-100 overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[1000px]">
                        <thead>
                            <tr className="bg-slate-50/50 border-b border-slate-100 text-slate-400">
                                <th className="px-6 py-6 text-[10px] font-black uppercase tracking-widest text-center w-16">№</th>
                                <th className="px-6 py-6 text-[10px] font-black uppercase tracking-widest">{intl.formatMessage({ id: "Talaba" })}</th>
                                <th className="px-6 py-6 text-[10px] font-black uppercase tracking-widest">{intl.formatMessage({ id: "Topshiriq" })}</th>
                                <th className="px-4 py-6 text-[10px] font-black uppercase tracking-widest text-center">{intl.formatMessage({ id: "Batafsil Natija" })}</th>
                                <th className="px-4 py-6 text-[10px] font-black uppercase tracking-widest text-center">{intl.formatMessage({ id: "Ball" })}</th>
                                <th className="px-6 py-6 text-[10px] font-black uppercase tracking-widest text-center">{intl.formatMessage({ id: "Holat" })}</th>
                                <th className="px-6 py-6 text-[10px] font-black uppercase tracking-widest text-right">{intl.formatMessage({ id: "Sana" })}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {data.results.map((sub, index) => {
                                const isMock = sub.results?.resource_type === "mock_test";
                                const isPassed = isMock ? sub.results?.jlpt_result?.passed : sub.results?.percentage >= 50;

                                return (
                                    <tr key={sub.id} className="hover:bg-slate-50/80 transition-all group">
                                        <td className="px-6 py-5 font-black text-slate-300 text-center text-sm">
                                            {(page - 1) * 10 + (index + 1)}
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-black text-xs uppercase">
                                                    {sub.student_display?.charAt(0)}
                                                </div>
                                                <span className="font-black text-slate-700 text-sm">{sub.student_display}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex flex-col">
                                                <span className="text-[11px] font-black text-slate-900 uppercase leading-tight">{sub.assignment_title}</span>
                                                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter italic">{sub.results?.resource_type}</span>
                                            </div>
                                        </td>

                                        <td className="px-4 py-5">
                                            <div className="flex items-center justify-center gap-2">
                                                {isMock ? (
                                                    <>
                                                        <MiniScoreBtn
                                                            data={Object.values(sub.results?.sections || {}).find(s => s.section_type === "VOCAB")}
                                                            icon={<Type size={12} />}
                                                            color="blue"
                                                        />
                                                        <MiniScoreBtn
                                                            data={Object.values(sub.results?.sections || {}).find(s => s.section_type === "GRAMMAR_READING")}
                                                            icon={<BookOpen size={12} />}
                                                            color="orange"
                                                        />
                                                        <MiniScoreBtn
                                                            data={Object.values(sub.results?.sections || {}).find(s => s.section_type === "LISTENING")}
                                                            icon={<Headphones size={12} />}
                                                            color="rose"
                                                        />
                                                    </>
                                                ) : (
                                                    <MiniScoreBtn
                                                        data={{
                                                            section_name: sub.assignment_title,
                                                            section_type: "QUIZ",
                                                            score: sub.results?.total_score,
                                                            max_score: sub.results?.max_score,
                                                            questions: sub.results?.questions
                                                        }}
                                                        icon={<LayoutGrid size={12} />}
                                                        color="emerald"
                                                        label="Quizni ko'rish"
                                                    />
                                                )}
                                            </div>
                                        </td>

                                        <td className="px-4 py-5 text-center">
                                            <span className="font-black text-slate-900 text-base">{Math.round(sub.score)}</span>
                                            <span className="text-[10px] text-slate-300 ml-1">/{isMock ? 180 : sub.results?.max_score}</span>
                                        </td>

                                        <td className="px-6 py-5 text-center">
                                            <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${isPassed ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"
                                                }`}>
                                                {isPassed ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
                                                {isPassed ? "Pass" : "Fail"}
                                            </div>
                                        </td>

                                        <td className="px-6 py-5 font-bold text-slate-400 text-[11px] text-right">
                                            {formatDate(sub.completed_at)}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {data?.count > 10 && (
                <div className="pt-6 flex justify-center">
                    <Pagination totalCount={data.count} pageSize={10} />
                </div>
            )}
        </div>
    );
};

// Kichik natija tugmasi (Modalni ochadi)
const MiniScoreBtn = ({ data, icon, color, label }) => {
    const { openModal } = useModal();
    const intl = useIntl();
    if (!data) return null;

    const colorMap = {
        blue: "bg-blue-50 text-blue-500 hover:bg-blue-500",
        orange: "bg-orange-50 text-orange-500 hover:bg-orange-500",
        rose: "bg-rose-50 text-rose-500 hover:bg-rose-500",
        emerald: "bg-emerald-50 text-emerald-600 hover:bg-emerald-600",
    };

    return (
        <button
            onClick={() => openModal("RESULT_VIEW", { data }, "middle")}
            className={`flex items-center gap-1.5 p-2 rounded-xl transition-all hover:text-white hover:shadow-lg active:scale-95 ${colorMap[color]}`}
            title={label || data.section_name}
        >
            {icon}
            {label && <span className="text-[10px] font-black uppercase pr-1">{intl.formatMessage({ id: label })}</span>}
            {!label && <span className="text-[11px] font-black">{data.score}</span>}
        </button>
    );
};

export default HomeworkSubmissionList;