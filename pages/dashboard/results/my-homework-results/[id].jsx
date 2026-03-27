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
    Activity,
    ChevronRight,
    ArrowLeft,
    LayoutGrid,
    CheckCircle2,
    Download,
} from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const HomeworkResults = () => {
    const router = useRouter();
    const intl = useIntl();
    const { openModal } = useModal();
    const { id: homeworkId } = router.query;

    // Homework natijalarini olish
    const { data, isLoading } = useSWR(
        homeworkId ? [`submissions/my-homework-results/`, homeworkId] : null,
        (url, id) => fetcher(`${url}?homework_assignment_id=${id}`, {}, {}, true)
    );

    if (isLoading)
        return (
            <div className="min-h-screen flex items-center justify-center font-black text-slate-200 animate-pulse text-2xl italic">
                {intl.formatMessage({ id: "Mikan Loading..." })}
            </div>
        );

    if (!data?.submissions || data.submissions.length === 0)
        return (
            <div className="p-20 text-center text-slate-400 font-bold">
                {intl.formatMessage({ id: "Hozircha natijalar yo'q." })}
            </div>
        );

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        return mins > 0 ? `${mins} min` : `${seconds} sec`;
    };

    const downloadFullPDF = () => {
        const doc = new jsPDF('p', 'mm', 'a4');

        data.submissions.forEach((submission, index) => {
            const isMock = submission.item_type === "mock_test";
            const res = submission.results;
            const isPassed = isMock ? res.jlpt_result?.passed : (res.percentage >= 50);

            if (index > 0) doc.addPage();

            // --- 1. Header ---
            doc.setFont("helvetica", "bold");
            doc.setFontSize(20);
            doc.setTextColor(30, 41, 59);
            doc.text("HOMEWORK ANALYSIS", 15, 20);

            doc.setFontSize(10);
            doc.setTextColor(150, 150, 150);
            doc.text("mikan.uz", 195, 20, { align: 'right' });

            doc.setDrawColor(226, 232, 240);
            doc.line(15, 25, 195, 25);

            // --- 2. Title Banner ---
            doc.setFillColor(15, 23, 42);
            doc.rect(15, 30, 180, 22, "F");
            doc.setTextColor(255, 255, 255);
            doc.setFontSize(11);
            doc.text(data.homework_title.toUpperCase(), 105, 39, { align: 'center' });
            doc.setFontSize(9);
            doc.setFont("helvetica", "normal");
            doc.text(`${submission.item_title} • Part ${index + 1} of ${data.submissions.length}`, 105, 46, { align: 'center' });

            // --- 3. Info Grid (Custom Boxes) ---
            const drawBox = (x, y, w, h, label, value, highlight = false) => {
                doc.setDrawColor(226, 232, 240);
                doc.rect(x, y, w, h);
                doc.setFontSize(7);
                doc.setTextColor(100, 100, 100);
                doc.text(label, x + 2, y + 4);
                doc.setFontSize(10);
                doc.setFont("helvetica", "bold");

                if (highlight) {
                    const passColor = [34, 197, 94]; // Green
                    const failColor = [239, 68, 68]; // Red
                    doc.setTextColor(...(isPassed ? passColor : failColor));
                } else {
                    doc.setTextColor(30, 41, 59);
                }

                doc.text(String(value), x + w / 2, y + 12, { align: 'center' });
                doc.setFont("helvetica", "normal");
            };

            const infoY = 60;
            drawBox(15, infoY, 45, 18, "SUBMISSION ID", `#${submission.submission_id}`);
            drawBox(60, infoY, 45, 18, "COMPLETED DATE", new Date(submission.completed_at).toLocaleDateString());
            drawBox(105, infoY, 45, 18, "TIME SPENT", formatTime(submission.time_taken_seconds));
            drawBox(150, infoY, 45, 18, "RESULT STATUS", isPassed ? "PASSED" : "FAILED", true);

            // --- 4. Score Table ---
            doc.setFontSize(12);
            doc.setTextColor(30, 41, 59);
            doc.setFont("helvetica", "bold");
            doc.text("Detailed Analysis", 15, 95);

            let tableBody = [];
            if (isMock) {
                const sections = res.jlpt_result?.section_results;
                tableBody = [
                    ["Language Knowledge", `${sections?.language_knowledge?.score || 0} / 60`, sections?.language_knowledge?.passed ? "Pass" : "Fail"],
                    ["Reading", `${sections?.reading?.score || 0} / 60`, sections?.reading?.passed ? "Pass" : "Fail"],
                    ["Listening", `${sections?.listening?.score || 0} / 60`, sections?.listening?.passed ? "Pass" : "Fail"],
                    [{ content: "TOTAL SCORE", styles: { fontStyle: 'bold', fillColor: [248, 250, 252] } },
                    { content: `${Math.round(submission.score)} / 180`, styles: { fontStyle: 'bold', fillColor: [248, 250, 252] } },
                    { content: isPassed ? "PASSED" : "FAILED", styles: { fontStyle: 'bold', fillColor: [248, 250, 252] } }]
                ];
            } else {
                tableBody = [
                    ["Correct Answers", `${res.correct_count} / ${res.total_questions ? res.total_questions : ""}`, ""],
                    ["Accuracy Percentage", `${res.percentage}%`, ""],
                    [{ content: "TOTAL SCORE", styles: { fontStyle: 'bold', fillColor: [248, 250, 252] } },
                    { content: `${Math.round(submission.score)} / ${res.max_score}`, styles: { fontStyle: 'bold', fillColor: [248, 250, 252] } }, ""]
                ];
            }

            autoTable(doc, {
                startY: 100,
                head: [['Section Name', 'Obtained Score', 'Status']],
                body: tableBody,
                theme: 'grid',
                headStyles: { fillColor: [79, 70, 229], fontSize: 10 },
                styles: { font: "helvetica", fontSize: 9, cellPadding: 4 }
            });

            // --- 5. Footer ---
            doc.setFontSize(8);
            doc.setTextColor(150, 150, 150);
            doc.text(`Generated on: ${new Date().toLocaleString()} • Page ${index + 1} of ${data.submissions.length}`, 105, 285, { align: 'center' });
        });

        doc.save(`${data.homework_title.replace(/\s+/g, '_')}_Results.pdf`);
    };

    return (
        <>
            <Seo title={`${data.homework_title} - Natijalar`} />
            <AuthGuard roles={["STUDENT"]}>
                <PageHeader
                    title={data.homework_title}
                    description={"Uy vazifasi natijalari tahlili"}
                    buttonLabel={"Orqaga"}
                    roles={["STUDENT"]}
                    icon={<ArrowLeft size={18} strokeWidth={2} />}
                    onButtonClick={() => router.push("/dashboard/assignments/homework")}
                />

                {/* PageHeader ichida yoki ostida qo'shimcha tugma */}
                <div className="flex justify-end">
                    <button
                        onClick={downloadFullPDF}
                        className="group flex items-center gap-3 px-8 py-4 bg-slate-900 text-white rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] hover:bg-primary transition-all shadow-xl hover:shadow-primary/20 active:scale-95"
                    >
                        <Download size={18} className="group-hover:animate-bounce" />
                        {intl.formatMessage({ id: "Natijalarni yuklash" })}
                    </button>
                </div>

                <div className="space-y-12">
                    {data.submissions.map((submission) => {
                        const isMock = submission.item_type === "mock_test";
                        const results = submission.results;

                        return (
                            <div key={submission.submission_id} className="space-y-6">
                                {/* Submission Header - Item Title */}
                                <div className="flex items-center gap-3 border-l-4 border-primary pl-4 py-1">
                                    <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tight">
                                        {submission.item_title}
                                    </h2>
                                    <span className="px-3 py-1 rounded-full bg-slate-100 text-[10px] font-black text-slate-500 uppercase">
                                        {submission.item_type}
                                    </span>
                                </div>

                                {/* Hero Section - Score Overview */}
                                <div className="relative bg-slate-900 rounded-[2rem] p-1 overflow-hidden">
                                    <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
                                        <Trophy size={150} className="text-white" />
                                    </div>

                                    <div className="relative bg-white rounded-[2rem] p-6 md:p-10 flex flex-col md:flex-row items-center justify-between gap-8">
                                        <div className="flex flex-col items-center md:items-start">
                                            <h1 className="text-slate-900 text-5xl md:text-6xl font-black tracking-tighter flex items-baseline">
                                                {Math.round(submission.score)}
                                                <span className="text-slate-200 text-2xl ml-2">
                                                    /{isMock ? 180 : results.max_score}
                                                </span>
                                            </h1>
                                            <p className="text-slate-400 font-bold mt-1 uppercase text-[10px] tracking-widest italic">
                                                {intl.formatMessage({ id: "To'plangan Ball" })}
                                            </p>
                                        </div>

                                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full md:w-auto">
                                            <StatBox
                                                icon={<Clock size={16} />}
                                                label="Vaqt"
                                                value={formatTime(submission.time_taken_seconds)}
                                                color="blue"
                                            />
                                            <StatBox
                                                icon={<Activity size={16} />}
                                                label="Aniqlik"
                                                value={`${Math.round(isMock ? (submission.score / 180) * 100 : results.percentage)}%`}
                                                color="orange"
                                            />
                                            <StatBox
                                                icon={<LayoutGrid size={16} />}
                                                label="Holat"
                                                value={submission?.item_type == "mock_test" ? (submission?.results?.jlpt_result?.passed ? "GRADDED" : "NOT GRADED") : submission.status}
                                                color="green"
                                            />
                                            <StatBox
                                                icon={<Trophy size={16} />}
                                                label="Sana"
                                                value={new Date(submission.completed_at).toLocaleDateString()}
                                                color="purple"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Sections / Quiz Details Analysis */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    {isMock ? (
                                        // Mock Test bo'lsa bo'limlarni chiqaramiz
                                        <>
                                            <AnalysisCard
                                                title="Vocabulary"
                                                subtitle="Moji-Goi"
                                                icon={<Type size={22} />}
                                                color="indigo"
                                                data={results.jlpt_result?.section_results?.language_knowledge}
                                                onOpen={() => openModal("RESULT_VIEW", { data: Object.values(results.sections).find(s => s.section_type === "VOCAB") }, "middle")}
                                            />
                                            <AnalysisCard
                                                title="Reading"
                                                subtitle="Bunpo & Dokkai"
                                                icon={<BookOpen size={22} />}
                                                color="amber"
                                                data={results.jlpt_result?.section_results?.reading}
                                                onOpen={() => openModal("RESULT_VIEW", { data: Object.values(results.sections).find(s => s.section_type === "GRAMMAR_READING") }, "middle")}
                                            />
                                            <AnalysisCard
                                                title="Listening"
                                                subtitle="Chokai"
                                                icon={<Headphones size={22} />}
                                                color="rose"
                                                data={results.jlpt_result?.section_results?.listening}
                                                onOpen={() => openModal("RESULT_VIEW", { data: Object.values(results.sections).find(s => s.section_type === "LISTENING") }, "middle")}
                                            />
                                        </>
                                    ) : (
                                        // Quiz bo'lsa bitta umumiy Review Card chiqaramiz
                                        <div className="md:col-span-3">
                                            <button
                                                onClick={() => openModal("RESULT_VIEW", {
                                                    data: {
                                                        section_name: submission.item_title,
                                                        section_type: "QUIZ",
                                                        score: results.total_score,
                                                        max_score: results.max_score,
                                                        questions: results.questions
                                                    }
                                                }, "middle")}
                                                className="w-full p-6 bg-white border border-dashed border-slate-300 rounded-[2rem] flex items-center justify-between hover:bg-slate-50 transition-all group"
                                            >
                                                <div className="flex items-center gap-4">
                                                    <div className="p-4 bg-emerald-50 text-emerald-600 rounded-2xl group-hover:scale-110 transition-all">
                                                        <CheckCircle2 size={24} />
                                                    </div>
                                                    <div className="text-left">
                                                        <h3 className="font-black text-slate-800 uppercase tracking-tight">{intl.formatMessage({ id: "Quiz Savollarini Ko'rish" })}</h3>
                                                        <p className="text-xs text-slate-400 font-bold uppercase">{results.correct_count}
                                                            {intl.formatMessage({ id: "ta to'g'ri javob" })}
                                                        </p>
                                                    </div>
                                                </div>
                                                <ChevronRight className="text-slate-300" />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </AuthGuard>
        </>
    );
};

// StatBox va AnalysisCard komponentlari MyExamResults bilan bir xil qoladi
const StatBox = ({ icon, label, value, color }) => {
    const intl = useIntl();
    const colors = {
        blue: "text-blue-500",
        orange: "text-orange-500",
        green: "text-green-500",
        purple: "text-purple-500",
    };
    return (
        <div className="bg-slate-50 p-4 rounded-[1.5rem] border border-slate-100/50">
            <div className={`mb-1 ${colors[color]}`}>{icon}</div>
            <div className="text-sm font-black text-slate-800 leading-none truncate">
                {value}
            </div>
            <div className="text-[8px] font-bold text-slate-400 uppercase mt-1 tracking-wider">
                {intl.formatMessage({ id: label })}
            </div>
        </div>
    );
};

const AnalysisCard = ({ title, subtitle, icon, color, data, onOpen }) => {
    if (!data) return null;
    const intl = useIntl();

    const colorVariants = {
        indigo: "bg-indigo-500 shadow-indigo-200",
        amber: "bg-amber-500 shadow-amber-200",
        rose: "bg-rose-500 shadow-rose-200",
    };

    return (
        <div className="group relative bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300">
            <div className="flex justify-between items-start mb-6">
                <div className={`p-3 rounded-xl text-white shadow-lg ${colorVariants[color]}`}>
                    {icon}
                </div>
                <div className="text-right">
                    <span className="block text-[9px] font-black text-slate-300 uppercase tracking-widest">{intl.formatMessage({ id: subtitle })}</span>
                    <span className="text-xl font-black text-slate-900 leading-none">{data.score}</span>
                </div>
            </div>
            <h3 className="text-lg font-black text-slate-800 mb-1">{intl.formatMessage({ id: title })}</h3>
            <div className="flex items-center gap-2 mb-6">
                <div className="h-1.5 flex-1 bg-slate-100 rounded-full overflow-hidden">
                    <div
                        className={`h-full transition-all duration-1000 ${data.passed ? "bg-green-500" : "bg-red-400"}`}
                        style={{ width: `${(data.score / 60) * 100}%` }}
                    />
                </div>
                <span className="text-[9px] font-bold text-slate-400 italic">min {data.min_required}</span>
            </div>
            <button
                onClick={onOpen}
                className="w-full py-3 rounded-xl bg-slate-50 group-hover:bg-slate-900 group-hover:text-white text-slate-500 font-black text-[10px] uppercase tracking-widest transition-all flex items-center justify-center gap-2"
            >
                {intl.formatMessage({ id: "Review Questions" })}
                <ChevronRight size={12} />
            </button>
        </div>
    );
};

export default HomeworkResults;