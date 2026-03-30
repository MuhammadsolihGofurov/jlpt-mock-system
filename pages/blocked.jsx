import React from "react";
import { ShieldAlert, XCircle, Ban, AlertTriangle, FileText } from "lucide-react";
import { useIntl } from "react-intl";
import Head from "next/head";
import { useRouter } from "next/router";

const ExamBlockedPage = () => {
    const intl = useIntl();
    const router = useRouter();

    const violations = [
        { id: 1, text: "To'liq ekran (Fullscreen) rejimidan chiqish" },
        { id: 2, text: "Boshqa brauzer oynasiga yoki tabiga o'tish" },
        { id: 3, text: "Dasturchi asboblari (DevTools) orqali kodni tekshirish" },
        { id: 4, text: "Sahifani qayta yuklash (Refresh) yoki nusxa ko'chirish" },
    ];

    return (
        <>
            <Head>
                <title>{intl.formatMessage({ id: "Imtihondan chetlashtirildingiz" })}</title>
                <meta name="robots" content="noindex, nofollow" />
            </Head>

            {/* Asosiy konteyner - Oq fon */}
            <div className="inset-0 bg-slate-50 flex items-center justify-center p-4 z-[200]">
                <div className="max-w-xl w-full bg-white border-2 border-red-100 p-8 md:p-12 rounded-[2rem] text-center shadow-[0_20px_50px_rgba(220,38,38,0.1)] animate-in fade-in slide-in-from-bottom-4 duration-700">

                    {/* Yuqori qism: Ikonka va Status */}
                    <div className="flex justify-center mb-8">
                        <div className="relative">
                            <div className="absolute inset-0 bg-red-500 blur-2xl opacity-20 animate-pulse"></div>
                            <div className="relative w-24 h-24 bg-red-50 border-4 border-red-500/30 rounded-full flex items-center justify-center shadow-inner">
                                <ShieldAlert size={48} className="text-red-600" />
                            </div>
                        </div>
                    </div>

                    {/* Sarlavha - Qora va Qalin */}
                    <h1 className="text-3xl md:text-4xl font-[900] text-slate-900 tracking-tight mb-4">
                        {intl.formatMessage({ id: "Siz imtihondan chetlashtirildingiz" })}
                    </h1>

                    <div className="h-1 w-20 bg-red-500 mx-auto mb-8 rounded-full" />

                    {/* Xabar bloki */}
                    <p className="text-slate-600 text-lg font-semibold leading-relaxed mb-10">
                        {intl.formatMessage({ id: "Xavfsizlik tizimi imtihon qoidalarining buzilganini aniqladi. Sizning imtihon sessiyangiz darhol to'xtatildi va natijalaringiz bekor qilindi." })}
                    </p>

                    {/* Sabablar ro'yxati - Kulrang blok */}
                    <div className="text-left bg-slate-50 border border-slate-200 p-6 rounded-2xl mb-8">
                        <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                            <FileText size={14} />
                            {intl.formatMessage({ id: "Aniqlangan qoidabuzarliklar" })}:
                        </h3>
                        <ul className="space-y-3">
                            {violations.map((v) => (
                                <li key={v.id} className="flex items-start gap-3 text-slate-700 text-sm font-bold">
                                    <XCircle size={16} className="text-red-500 mt-0.5 shrink-0" />
                                    {intl.formatMessage({ id: v.text })}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Ogohlantirish */}
                    <div className="flex items-center justify-center gap-2 text-red-600 font-black text-xs uppercase tracking-widest bg-red-50 py-3 rounded-xl border border-red-100 mb-8">
                        <Ban size={14} />
                        {intl.formatMessage({ id: "Qayta topshirish imkoniyati mavjud emas" })}
                    </div>

                    {/* Pastki qism */}
                    <p className="text-slate-400 text-[11px] font-medium max-w-xs mx-auto italic pb-5">
                        {intl.formatMessage({ id: "Ushbu xabar xavfsizlik protokoli (SecureExam Engine) tomonidan avtomatik ravishda yaratildi." })}
                    </p>

                    {/* asosiy sahifaga qaytish */}
                    <button
                        onClick={() => router.push("/login")}
                        className="bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-6 rounded-full shadow-lg transition duration-300 ease-in-out transform hover:scale-105"
                    >
                        {intl.formatMessage({ id: "Orqaga" })}
                    </button>
                </div>
            </div>
        </>
    );
};

export default ExamBlockedPage;