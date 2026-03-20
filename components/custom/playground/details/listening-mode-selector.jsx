import React from "react";
import { Headphones, Users, Play, ArrowRight } from "lucide-react";
import { useIntl } from "react-intl";

export const ListeningModeSelector = ({ onSelect }) => {
    const intl = useIntl();

    const modes = [
        {
            id: "auto",
            icon: Headphones,
            title: "Individual (Online)",
            desc: "Audio har bir bo'lim uchun avtomatik ijro etiladi. Quloqchinlardan foydalanish tavsiya etiladi.",
            color: "bg-primary",
            shadow: "shadow-orange-200"
        },
        {
            id: "manual",
            icon: Users,
            title: "Auditoriya (Manual)",
            desc: "Audio xonadagi umumiy dinamik orqali qo'yiladi. Tizim audioni ijro etmaydi, barcha savollar ochiq bo'ladi.",
            color: "bg-blue-600",
            shadow: "shadow-blue-200"
        }
    ];

    return (
        <div className="fixed inset-0 z-[110] bg-slate-900/95 backdrop-blur-xl flex items-center justify-center p-6">
            <div className="max-w-4xl w-full">
                <div className="text-center mb-12">
                    <h2 className="text-4xl font-black text-white mb-4 tracking-tight">
                        {intl.formatMessage({ id: "Tinglab tushunish tartibini tanlang" })}
                    </h2>
                    <p className="text-slate-400 text-lg font-medium">
                        {intl.formatMessage({ id: "Imtihonni qanday topshirishingizga qarab mos rejimni belgilang" })}
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {modes.map((mode) => (
                        <button
                            key={mode.id}
                            onClick={() => onSelect(mode.id)}
                            className="group relative bg-white/5 border border-white/10 p-8 rounded-[3rem] text-left transition-all hover:bg-white/10 hover:border-white/20 active:scale-[0.98]"
                        >
                            <div className={`w-16 h-16 ${mode.color} rounded-2xl flex items-center justify-center mb-6 shadow-2xl ${mode.shadow}`}>
                                <mode.icon size={32} className="text-white" />
                            </div>

                            <h3 className="text-2xl font-black text-white mb-3 flex items-center gap-2">
                                {intl.formatMessage({ id: mode.title })}
                                <ArrowRight className="opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-primary" />
                            </h3>

                            <p className="text-slate-400 leading-relaxed font-medium">
                                {intl.formatMessage({ id: mode.desc })}
                            </p>

                            <div className="mt-8 flex items-center gap-2 text-xs font-black text-white/40 uppercase tracking-widest">
                                <div className={`w-2 h-2 rounded-full ${mode.id === 'auto' ? 'bg-orange-500' : 'bg-blue-500'}`} />
                                {intl.formatMessage({ id: mode.id === 'auto' ? 'Self-Paced' : 'Proctored' })}
                            </div>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};