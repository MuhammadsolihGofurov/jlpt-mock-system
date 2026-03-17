import React from "react";
import { Headphones, Play } from "lucide-react";
import { useIntl } from "react-intl";

export const ListeningOverlay = ({ onStart, title }) => {
    const intl = useIntl();

    return (
        <div className="fixed inset-0 z-[100] bg-slate-900/95 backdrop-blur-md flex items-center justify-center p-6 text-center">
            <div className="max-w-md w-full">
                <div className="w-24 h-24 bg-primary rounded-full flex items-center justify-center mx-auto mb-8 animate-bounce shadow-2xl shadow-orange-500/20">
                    <Headphones size={48} className="text-white" />
                </div>

                <h2 className="text-3xl font-black text-white mb-4 uppercase tracking-tight">
                    {intl.formatMessage({ id: "Choukai (Listening)" })}
                </h2>
                <p className="text-slate-400 font-medium mb-10 text-lg">
                    {title} {intl.formatMessage({ id: "bo'limi boshlanishiga tayyormisiz? Audio avtomatik tarzda boshlanadi va to'xtatib bo'lmaydi." })}
                </p>

                <button
                    onClick={onStart}
                    className="group relative inline-flex items-center justify-center px-10 py-5 font-black text-white transition-all duration-200 bg-primary rounded-[2rem] hover:bg-orange-600 active:scale-95 shadow-xl shadow-orange-500/25"
                >
                    <Play className="mr-3 fill-current" size={24} />
                    {intl.formatMessage({ id: "AUDIONI BOSHLASH" })}
                </button>

                <p className="mt-8 text-xs font-bold text-slate-500 uppercase tracking-widest opacity-50">
                    {intl.formatMessage({ id: "Eslatma: Quloqchinlardan foydalanish tavsiya etiladi" })}
                </p>
            </div>
        </div>
    );
};