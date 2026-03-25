import React from 'react';
import { useModal } from "@/context/modal-context";
import { useIntl } from "react-intl";
import { CheckCircle2, ArrowRight, X, Info, Sparkles } from "lucide-react";

const ServiceDetailModal = ({ data }) => {
    const { closeModal } = useModal();
    const intl = useIntl();

    // HServices dan kelayotgan ikonka
    const Icon = data.icon || Info;

    const scrollToContact = () => {
        const contactSection = document.getElementById('contact');
        if (contactSection) {
            contactSection.scrollIntoView({ behavior: 'smooth' });
        }
    };

    // Har bir xizmat uchun dinamik afzalliklar ro'yxati
    const getFeatures = (id) => {
        const features = {
            1: ["Anti-cheat tizimi", "Real-time natijalar", "JLPT darajalari (N5-N1)"],
            2: ["AI rasm generatsiyasi", "Spaced Repetition", "Offline takrorlash"],
            3: ["Xavfsiz networking", "Video/Audio chat", "Markazlararo muloqot"],
            4: ["24/7 AI Sensei", "Talaffuz tahlili", "Mavzulashtirilgan suhbat"],
            5: ["Guruhlar bellashuvi", "Haftalik reyting", "Yutuqlar (Badges)"],
            6: ["Vizual Roadmap", "Darajalar bo'yicha progress", "Duolingo uslubida"]
        };
        return features[id] || ["Professional materiallar", "AI tahlil tizimi"];
    };

    return (
        <div className="p-4 sm:p-10 relative overflow-hidden">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mb-10 relative z-10">
                <div className="p-6 rounded-[2.5rem] bg-orange-500 text-white shadow-xl shadow-orange-200 border border-orange-400">
                    <Icon size={40} strokeWidth={1.5} />
                </div>
                <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1 bg-slate-900 text-white rounded-full">
                            {data.tag}
                        </span>
                        <span className="flex items-center gap-1 text-[10px] font-black uppercase text-orange-500">
                            <Sparkles size={12} /> Premium Feature
                        </span>
                    </div>
                    <h2 className="text-xl sm:text-4xl font-black text-slate-900 tracking-tighter leading-tight">
                        {data.title}
                    </h2>
                </div>
            </div>

            {/* Main Content */}
            <div className="space-y-8 relative z-10">
                {/* Asosiy Banner Tavsif */}
                <div className="bg-slate-950 p-8 rounded-[2.5rem] border border-slate-800 shadow-2xl">
                    <p className="text-white text-lg font-medium leading-relaxed italic opacity-90">
                        "{data.desc}"
                    </p>
                </div>

                {/* Batafsil Ma'lumot */}
                <div className="px-2">
                    <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
                        <Info size={14} className="text-orange-500" />
                        {intl.formatMessage({ id: "Batafsil ma'lumot" })}
                    </h3>
                    <p className="text-slate-600 text-base sm:text-lg leading-relaxed font-normal">
                        {data.full_desc}
                    </p>
                </div>

                {/* Dinamik Afzalliklar */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {getFeatures(data.id).map((feature, i) => (
                        <div key={i} className="flex items-center gap-3 py-4 px-6 bg-slate-50 border border-slate-100 rounded-2xl group hover:border-orange-200 transition-colors">
                            <div className="bg-white p-1 rounded-full shadow-sm text-emerald-500">
                                <CheckCircle2 size={18} />
                            </div>
                            <span className="text-sm font-black text-slate-700 uppercase tracking-tight italic">
                                {intl.formatMessage({ id: feature })}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Footer Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mt-12 pt-8 border-t border-slate-100">
                <p className="text-xs font-bold text-slate-400 max-w-[200px] text-center sm:text-left">
                    {intl.formatMessage({ id: "Savollaringiz bormi? Mutaxassis bilan gaplashing." })}
                </p>

                <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                    <button
                        onClick={() => closeModal("SERVICE_MODAL")}
                        className="px-8 py-5 rounded-3xl font-black text-slate-500 hover:bg-slate-50 transition-all text-xs uppercase tracking-widest"
                    >
                        {intl.formatMessage({ id: "Yopish" })}
                    </button>

                    <button
                        onClick={() => {
                            closeModal("SERVICE_MODAL");
                            setTimeout(scrollToContact, 300);
                        }}
                        className="bg-orange-500 text-white font-black px-10 py-5 rounded-3xl shadow-2xl shadow-orange-200 transition-all active:scale-95 flex items-center justify-center gap-3 group text-xs uppercase tracking-widest"
                    >
                        {intl.formatMessage({ id: "Hoziroq boshlash" })}
                        <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
                    </button>
                </div>
            </div>

            {/* Vizual bezaklar */}
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-orange-500/5 blur-[100px] rounded-full pointer-events-none" />
            <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-orange-500/10 blur-[100px] rounded-full pointer-events-none" />
        </div>
    );
};

export default ServiceDetailModal;