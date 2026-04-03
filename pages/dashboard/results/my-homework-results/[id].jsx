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
    Clock,
    Trophy,
    Activity,
    ChevronRight,
    ArrowLeft,
    LayoutGrid,
    CheckCircle2,
    Download,
    Calendar,
} from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { formatDateTime } from "@/utils/funcs";

const HomeworkResults = () => {
    const router = useRouter();
    const intl = useIntl();
    const { id: homeworkId } = router.query;

    // Yangi endpoint: /submissions/history/{homework_id}/list/
    const { data, isLoading } = useSWR(
        homeworkId ? [`submissions/history/${homeworkId}/list/`, homeworkId] : null,
        (url) => fetcher(url, {}, {}, true)
    );

    const submissions = data?.submissions || [];

    if (submissions.length === 0)
        return (
            <div className="p-20 text-center text-slate-400 font-bold">
                {intl.formatMessage({ id: "Hozircha natijalar yo'q." })}
            </div>
        );

    const formatTime = (seconds) => {
        if (!seconds) return "0 sec";
        const mins = Math.floor(seconds / 60);
        return mins > 0 ? `${mins} min ${seconds % 60} sec` : `${seconds} sec`;
    };

    const downloadFullPDF = () => {
        const doc = new jsPDF('p', 'mm', 'a4');

        // 1. Sarlavha va Homework nomi
        doc.setFont("helvetica", "bold");
        doc.setFontSize(20);
        doc.setTextColor(30, 41, 59);
        doc.text("HOMEWORK FULL REPORT", 15, 20);

        doc.setFontSize(10);
        doc.setTextColor(100, 100, 100);
        doc.setFont("helvetica", "normal");
        doc.text(`Homework Title: ${data.homework_title}`, 15, 28);
        doc.text(`Total Attempts: ${submissions.length}`, 15, 33);
        doc.text(`Generated on: ${new Date().toLocaleString()}`, 195, 20, { align: 'right' });

        // 2. Jadval uchun ma'lumotlarni tayyorlash (Body)
        // Eng oxirgi urinishni tepada chiqarish uchun .map dan oldin .reverse() qilish ham mumkin
        const tableBody = submissions.map((sub, index) => [
            submissions.length - index, // Tartib raqami
            sub.quiz_title,
            sub.score ?? "0",
            `${sub.percentage}%`,
            formatTime(sub.time_taken_seconds),
            formatDateTime(sub.completed_at), // Siz to'g'irlagan yangi vaqt funksiyasi
            sub.status
        ]);

        // 3. Yagona jadvalni yaratish
        autoTable(doc, {
            startY: 40,
            head: [['#', 'Quiz Title', 'Score', 'Percentage', 'Time Taken', 'Completed At', 'Status']],
            body: tableBody,
            theme: 'striped',
            headStyles: {
                fillColor: [15, 23, 42],
                textColor: [255, 255, 255],
                fontSize: 10,
                fontStyle: 'bold'
            },
            styles: {
                fontSize: 9,
                cellPadding: 4,
                valign: 'middle'
            },
            columnStyles: {
                0: { cellWidth: 10 }, // # ustuni eni
                3: { fontStyle: 'bold' } // Foizni qalin qilish
            },
            // Agar jadval sahifadan oshib ketsa, avtomat keyingi sahifaga o'tadi
            margin: { top: 40 }
        });

        // 4. Saqlash
        const fileName = data.homework_title.replace(/\s+/g, '_');
        doc.save(`Full_Results_${fileName}.pdf`);
    };

    return (
        <>
            <Seo title={`${data.homework_title || 'Natijalar'}`} />
            <AuthGuard roles={["STUDENT"]}>
                <PageHeader
                    title={data.homework_title || "Homework Results"}
                    description={"Barcha urinishlar natijalari tahlili"}
                    buttonLabel={"Orqaga"}
                    roles={["STUDENT"]}
                    icon={<ArrowLeft size={18} />}
                    onButtonClick={() => router.push("/dashboard/assignments/homework")}
                />

                <div className="flex justify-end mb-8">
                    <button
                        onClick={downloadFullPDF}
                        className="group flex items-center gap-3 px-6 py-3 bg-slate-900 text-white rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-primary transition-all shadow-lg active:scale-95"
                    >
                        <Download size={18} />
                        {intl.formatMessage({ id: "PDF Yuklash" })}
                    </button>
                </div>

                <div className="space-y-5">
                    {submissions.map((sub, idx) => (
                        <div key={sub.submission_id} className="relative group">
                            {/* Urinish tartib raqami */}
                            <div className="absolute -left-4 top-1/2 -translate-y-1/2 hidden lg:flex items-center justify-center w-10 h-10 bg-slate-100 rounded-full border-4 border-white text-slate-400 font-black z-10">
                                {submissions.length - idx}
                            </div>

                            <div className="bg-white border border-slate-100 rounded-[2.5rem] p-6 shadow-sm hover:shadow-xl transition-all duration-500">
                                <div className="flex flex-col lg:flex-row gap-8 items-center">

                                    {/* Score Circle */}
                                    <div className="relative flex-shrink-0 w-32 h-32">
                                        {/* SVG Progress Circle */}
                                        <svg className="w-full h-full transform -rotate-90">
                                            {/* Orqa fondagi bo'sh aylana */}
                                            <circle
                                                cx="64"
                                                cy="64"
                                                r="58"
                                                stroke="currentColor"
                                                strokeWidth="8"
                                                fill="transparent"
                                                className="text-slate-50"
                                            />
                                            {/* To'ladigan rangli aylana */}
                                            <circle
                                                cx="64"
                                                cy="64"
                                                r="58"
                                                stroke="currentColor"
                                                strokeWidth="8"
                                                fill="transparent"
                                                strokeDasharray={2 * Math.PI * 58}
                                                strokeDashoffset={2 * Math.PI * 58 * (1 - sub.percentage / 100)}
                                                strokeLinecap="round"
                                                className="text-primary transition-all duration-1000 ease-out"
                                            />
                                        </svg>

                                        {/* Markazdagi matn */}
                                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                                            <span className="text-3xl font-black text-slate-800 leading-none">
                                                {sub.score ?? 0}
                                            </span>
                                            <span className="text-[10px] font-bold text-slate-400 uppercase mt-1">
                                                Ball
                                            </span>
                                        </div>
                                    </div>

                                    {/* Details */}
                                    <div className="flex-1 w-full">
                                        <div className="flex flex-wrap items-center gap-3 mb-4">
                                            <h3 className="text-xl font-black text-slate-800 uppercase italic tracking-tight">
                                                {sub.quiz_title}
                                            </h3>
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${sub.status === 'GRADED' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                                                {sub.status}
                                            </span>
                                        </div>

                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                            <StatItem
                                                icon={<Activity size={14} className="text-blue-500" />}
                                                label="Aniqlik"
                                                value={`${sub.percentage}%`}
                                            />
                                            <StatItem
                                                icon={<Clock size={14} className="text-orange-500" />}
                                                label="Vaqt"
                                                value={formatTime(sub.time_taken_seconds)}
                                            />
                                            <StatItem
                                                icon={<Calendar size={14} className="text-purple-500" />}
                                                label="Sana"
                                                value={formatDateTime(sub.completed_at)}
                                            />
                                            <StatItem
                                                icon={<LayoutGrid size={14} className="text-slate-400" />}
                                                label="ID"
                                                value={`#${sub.submission_id.slice(0, 8)}`}
                                            />
                                        </div>
                                    </div>

                                    {/* Action */}
                                    {/* <button
                                        onClick={() => openModal("RESULT_VIEW", { submissionId: sub.submission_id }, "large")}
                                        className="w-full lg:w-auto px-8 py-4 bg-slate-50 hover:bg-slate-900 hover:text-white rounded-2xl text-slate-400 font-black text-[10px] uppercase tracking-widest transition-all flex items-center justify-center gap-2"
                                    >
                                        Review <ChevronRight size={14} />
                                    </button> */}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </AuthGuard>
        </>
    );
};

const StatItem = ({ icon, label, value }) => {
    const intl = useIntl();
    return (
        <div className="bg-slate-50/50 p-3 rounded-2xl border border-slate-100">
            <div className="flex items-center gap-2 mb-1">
                {icon}
                <span className="text-[8px] font-bold text-slate-400 uppercase tracking-wider">{intl.formatMessage({ id: label })}</span>
            </div>
            <div className="text-xs font-black text-slate-700">{value}</div>
        </div>
    )
};

export default HomeworkResults;