import fetcher from '@/utils/fetcher';
import { useRouter } from 'next/router';
import React from 'react'
import { useIntl } from 'react-intl'
import useSWR from 'swr';
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
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
    ArrowLeft,
    Download
} from "lucide-react";
import { useModal } from '@/context/modal-context';
import { getTodayDate } from '@/utils/funcs';
import { useSelector } from 'react-redux';

export default function MyResultExam({ examId, customLoading }) {
    const intl = useIntl();
    const router = useRouter();
    const { openModal } = useModal();
    const { user } = useSelector(state => state.auth);


    const { data, isLoading } = useSWR(
        examId ? [`jft-submissions/my-results/`, examId] : null,
        (url, id) => fetcher(`${url}?jft_exam_assignment_id=${id}`, {}, {}, true),
    );

    if (customLoading || isLoading) {
        return <MyJftExamResultSkeleton />
    }

    if (!data) {
        return null;
    }

    const res = data?.submission;
    const jft = res?.results?.jft_result;
    const sections = res?.results?.sections || {};

    const expressionData = Object.values(sections).find(
        (s) => s.section_type === "CONVERSATION_EXPRESSION",
    );
    const readingData = Object.values(sections).find(
        (s) => s.section_type === "READING",
    );
    const scriptVocabData = Object.values(sections).find(
        (s) => s.section_type === "SCRIPT_VOCAB",
    );
    const listeningData = Object.values(sections).find(
        (s) => s.section_type === "LISTENING",
    );

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        return `${mins} min`;
    };

    const downloadPDF = async () => {
        const doc = new jsPDF('p', 'mm', 'a4');

        const getGrade = (section) => {
            if (!section) return "C";
            const percent = (section.score / section.max_score) * 100;
            if (percent >= 67) return "A";
            if (percent >= 34) return "B";
            return "C";
        };

        doc.setFont("helvetica");

        doc.setFontSize(10);
        doc.setTextColor(150);
        doc.text("mikan.uz", 195, 15, { align: 'right' });
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(22);
        doc.setFont("helvetica", "bold");
        doc.text("Japan Foundation Test", 15, 25);

        doc.setFontSize(18);
        doc.text(intl.formatMessage({ id: "jft Score Report" }), 15, 34);

        // date
        const date = new Date();

        // 3. Qizil Banner
        doc.setFillColor(239, 68, 68);
        doc.rect(15, 45, 180, 18, "F");
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(11);
        doc.text(`${intl.formatMessage({ id: "Natija" })}: ${res.mock_test_level} ${intl.formatMessage({ id: "daraja uchun" })}`, 105, 53, { align: 'center' });
        doc.setFontSize(10);
        doc.text(`${intl.formatMessage({ id: "Tayyorlandi" })}: mikan.uz - ${getTodayDate()}`, 105, 59, { align: 'center' });

        // 4. Ma'lumotlar bloklari (Xatolikka yo'l qo'ymaslik uchun oddiyroq
        doc.setTextColor(0, 0, 0);
        const drawRow = (y, labelEn, value) => {
            doc.setFontSize(8);
            doc.setFont("helvetica", "normal");
            doc.text(labelEn, 15, y);
            doc.rect(60, y - 4, 135, 10);
            doc.setFontSize(11);
            doc.setFont("helvetica", "bold");
            doc.text(String(value), 127.5, y + 2.5, { align: 'center' });
        };

        drawRow(80, intl.formatMessage({ id: "Level" }), res.mock_test_level || "N5");
        drawRow(95, intl.formatMessage({ id: "Registration No." }), "MK-" + (res.id || "001"));
        drawRow(110, intl.formatMessage({ id: "STUDENT" }), `${user?.last_name}  ${user?.first_name}`);
        drawRow(125, intl.formatMessage({ id: "Holat" }), intl.formatMessage({ id: jft?.passed ? "Pass" : "Fail" }));

        // 5. Ballar jadvali
        // const vocabSection = Object.values(sections).find(s => s.section_type === "VOCAB");
        // const grammarSection = Object.values(sections).find(s => s.section_type === "GRAMMAR_READING");
        // const listeningSection = Object.values(sections).find(s => s.section_type === "LISTENING");


        autoTable(doc, {
            startY: 145,
            theme: 'grid',
            head: [[intl.formatMessage({ id: "Sections" }), intl.formatMessage({ id: 'Section Score' }), intl.formatMessage({ id: "Umumiy ball" })]],
            body: [
                [intl.formatMessage({ id: 'Conversation & Expression' }), `${expressionData?.score}/${expressionData?.max_score}` || 0, { content: `${Math.round(res.score)} / ${res.results?.max_score}`, rowSpan: 4, styles: { valign: 'middle', halign: 'center', fontSize: 16, fontStyle: 'bold' } }],
                [intl.formatMessage({ id: 'Listening' }), `${listeningData?.score}/${listeningData?.max_score}` || 0, ''],
                [intl.formatMessage({ id: 'Vocabulary' }), `${scriptVocabData?.score}/${scriptVocabData?.max_score}` || 0, ''],
                [intl.formatMessage({ id: 'Reading' }), `${readingData?.score}/${readingData?.max_score}` || 0, ''],
            ],
            headStyles: { fillColor: [51, 65, 85], textColor: [255, 255, 255] },
            styles: { font: "helvetica", cellPadding: 5 }
        });

        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");
        doc.text(intl.formatMessage({ id: "Qo'shimcha ma'lumotlar" }), 15, doc.lastAutoTable.finalY + 15);

        autoTable(doc, {
            startY: doc.lastAutoTable.finalY + 20,
            theme: 'grid',
            head: [[intl.formatMessage({ id: 'Conversation & Expression' }), intl.formatMessage({ id: 'Listening' }), intl.formatMessage({ id: 'Vocabulary' }), intl.formatMessage({ id: 'Reading' })]],
            body: [[
                getGrade(expressionData),
                getGrade(listeningData),
                getGrade(scriptVocabData),
                getGrade(readingData)
            ]],
            styles: {
                halign: 'center',
                fontSize: 14,
                fontStyle: 'bold',
                lineColor: [0, 0, 0],
                lineWidth: 0.1
            },
            headStyles: {
                fillColor: [241, 245, 249],
                textColor: [0, 0, 0],
                fontStyle: 'normal',
                fontSize: 8
            },
            columnStyles: {
                0: { cellWidth: 45 },
                1: { cellWidth: 45 },
                2: { cellWidth: 45 },
                3: { cellWidth: 45 }
            }
        });

        // 6. Footer
        doc.setFontSize(8);
        doc.setTextColor(150);
        doc.text(intl.formatMessage({ id: "Mikan platformasi tomonidan yaratilgan natijalar" }), 105, 285, { align: 'center' });

        doc.save(`Result_${res.id}.pdf`);
    };

    return (
        <>
            {/* Hero Section - Score Overview */}
            <div className="relative bg-slate-900 rounded-[2rem] p-1 overflow-hidden">
                <div className="absolute top-0 right-0 p-12 opacity-10 pointer-events-none">
                    <Trophy size={200} className="text-white" />
                </div>

                <div className="relative bg-white rounded-[2rem] p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-12">
                    <div className="flex flex-col items-center md:items-start">
                        <div
                            className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-4 ${jft?.passed ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"}`}
                        >
                            {intl.formatMessage({
                                id: jft?.passed ? "Pass" : "Fail",
                            })}
                        </div>
                        <h1 className="text-slate-900 text-5xl md:text-7xl font-black tracking-tighter flex items-baseline">
                            {Math.round(res.score)}
                            <span className="text-slate-200 text-3xl ml-2">/250</span>
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
                            value={jft?.pass_mark}
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
                    title="Conversation & Expression"
                    subtitle="Language Knowledge"
                    icon={<Type size={22} />}
                    color="indigo"
                    data={expressionData}
                    onOpen={() =>
                        openModal(
                            "RESULT_VIEW",
                            {
                                data: expressionData,
                            },
                            "middle",
                        )
                    }
                />
                <AnalysisCard
                    title="Listening"
                    subtitle="Audio Analysis"
                    icon={<Type size={22} />}
                    color="rose"
                    data={listeningData}
                    onOpen={() =>
                        openModal(
                            "RESULT_VIEW",
                            {
                                data: listeningData,
                            },
                            "middle",
                        )
                    }
                />
                <AnalysisCard
                    title="Vocabulary"
                    subtitle="Language Knowledge"
                    icon={<Type size={22} />}
                    color="orange"
                    data={scriptVocabData}
                    onOpen={() =>
                        openModal(
                            "RESULT_VIEW",
                            {
                                data: scriptVocabData,
                            },
                            "middle",
                        )
                    }
                />
                <AnalysisCard
                    title="Reading"
                    subtitle="Comprehension"
                    icon={<Type size={22} />}
                    color="indigo"
                    data={readingData}
                    onOpen={() =>
                        openModal(
                            "RESULT_VIEW",
                            {
                                data: readingData,
                            },
                            "middle",
                        )
                    }
                />
            </div>

            <div className="flex justify-end">
                <button
                    onClick={downloadPDF}
                    className="group flex items-center gap-3 px-8 py-4 bg-slate-900 text-white rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] hover:bg-primary transition-all shadow-xl hover:shadow-primary/20 active:scale-95"
                >
                    <Download size={18} className="group-hover:animate-bounce" />
                    {intl.formatMessage({ id: "Natijalarni yuklash" })}
                </button>
            </div>

        </>
    )
}


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
                {value && intl.formatMessage({ id: value })}
            </div>
            <div className="text-[9px] font-bold text-slate-400 uppercase mt-1 tracking-wider">
                {label && intl.formatMessage({ id: label })}
            </div>
        </div>
    );
};

// Bo'limlar uchun yangi dizayndagi Card
const AnalysisCard = ({ title, subtitle, icon, color, data, onOpen, showExtraButton, onOpenExtra }) => {
    if (!data) return null;
    const intl = useIntl();

    const colorVariants = {
        indigo: "bg-indigo-500 shadow-indigo-200",
        amber: "bg-amber-500 shadow-amber-200",
        rose: "bg-rose-500 shadow-rose-200",
        orange: "bg-orange-500 shadow-orange-200",
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
                        {subtitle && intl.formatMessage({ id: subtitle })}
                    </span>
                    <span className="text-2xl font-black text-slate-900 leading-none">
                        {data.score}
                    </span>
                </div>
            </div>

            <h3 className="text-xl font-black text-slate-800 mb-1">
                {title && intl.formatMessage({ id: title })}
            </h3>

            <div className="flex items-center gap-2 mb-8">
                <div className="h-1.5 flex-1 bg-slate-100 rounded-full overflow-hidden">
                    <div
                        className={`h-full transition-all duration-1000 ${data.passed ? "bg-green-500" : "bg-red-400"}`}
                        style={{ width: `${(data.score / data?.max_score) * 100}%` }}
                    />
                </div>
                <span className="text-[10px] font-bold text-slate-400 italic">
                    min {data.min_required}
                </span>
            </div>

            <div className="flex flex-col gap-2">
                <button
                    onClick={onOpen}
                    className="w-full py-4 rounded-2xl bg-slate-50 group-hover:bg-slate-900 group-hover:text-white text-slate-500 font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2"
                >
                    {intl.formatMessage({ id: "Review Questions" })}
                    <ChevronRight size={14} />
                </button>

                {showExtraButton && (
                    <button
                        onClick={onOpenExtra}
                        className="w-full py-4 rounded-2xl bg-primary/10 text-primary hover:bg-primary hover:text-white font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2"
                    >
                        {intl.formatMessage({ id: "Review Questions" })}  {intl.formatMessage({ id: showExtraButton })}
                        <Activity size={14} />
                    </button>
                )}
            </div>
        </div>
    );
};

const MyJftExamResultSkeleton = () => {
    return (
        <div className="animate-pulse space-y-8">
            {/* Page Header Skeleton */}
            <div className="flex justify-between items-end pb-4 border-b border-slate-100">
                <div className="space-y-3">
                    <div className="h-4 w-32 bg-slate-200 rounded-full" />
                    <div className="h-10 w-64 bg-orange-100 rounded-2xl" />
                    <div className="h-4 w-48 bg-slate-100 rounded-full" />
                </div>
                <div className="h-12 w-32 bg-slate-100 rounded-2xl" />
            </div>

            {/* Hero Section Skeleton */}
            <div className="relative bg-slate-50 rounded-[2rem] p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-12 border border-slate-100">
                <div className="flex flex-col items-center md:items-start space-y-4">
                    <div className="h-6 w-20 bg-orange-200/50 rounded-full" />
                    <div className="flex items-baseline gap-2">
                        <div className="h-16 w-32 bg-orange-100 rounded-2xl" />
                        <div className="h-8 w-16 bg-slate-200 rounded-lg" />
                    </div>
                    <div className="h-3 w-24 bg-slate-200 rounded-full" />
                </div>

                <div className="grid grid-cols-2 gap-4 w-full md:w-auto">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="bg-white p-5 rounded-[2rem] w-32 md:w-40 border border-slate-100 space-y-3">
                            <div className="h-5 w-5 bg-orange-50 rounded-lg" />
                            <div className="h-6 w-16 bg-slate-200 rounded-md" />
                            <div className="h-2 w-10 bg-slate-100 rounded-full" />
                        </div>
                    ))}
                </div>
            </div>

            {/* Analysis Cards Grid Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 space-y-6">
                        <div className="flex justify-between items-start">
                            <div className="h-14 w-14 bg-orange-100 rounded-2xl" />
                            <div className="space-y-2">
                                <div className="h-2 w-16 bg-slate-100 rounded-full ml-auto" />
                                <div className="h-8 w-12 bg-slate-200 rounded-lg ml-auto" />
                            </div>
                        </div>

                        <div className="h-6 w-3/4 bg-slate-200 rounded-lg" />

                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                                    <div className="h-full w-2/3 bg-orange-200" />
                                </div>
                                <div className="h-2 w-8 bg-slate-50 ml-2" />
                            </div>
                        </div>

                        <div className="h-14 w-full bg-slate-50 rounded-2xl" />
                    </div>
                ))}
            </div>

            {/* Download Button Skeleton */}
            <div className="flex justify-end">
                <div className="h-14 w-64 bg-slate-900/10 rounded-[2rem]" />
            </div>
        </div>
    );
};