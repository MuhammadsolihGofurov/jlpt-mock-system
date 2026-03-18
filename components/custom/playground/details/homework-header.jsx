import React, { useState, useEffect } from "react";
import { ChevronLeft, Timer, AlertTriangle } from "lucide-react";

const HomeworkHeader = ({ title, sectionName, onBack, progress, duration, onTimeUp }) => {
    const [timeLeft, setTimeLeft] = useState(duration ? duration * 60 : 0);

    // MUHIM: Duration kelishi bilan yoki o'zgarganda timeLeft'ni yangilaymiz
    useEffect(() => {
        if (duration) {
            setTimeLeft(duration * 60);
        }
    }, [duration]);

    useEffect(() => {
        // Agar timeLeft hali o'rnatilmagan bo'lsa (masalan, 0 yoki NaN), timer ishlamasin
        if (isNaN(timeLeft) || timeLeft <= 0) {
            if (timeLeft === 0 && duration > 0) {
                onTimeUp?.();
            }
            return;
        }

        const timer = setInterval(() => {
            setTimeLeft((prev) => prev - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [timeLeft, onTimeUp]);

    const formatTime = (seconds) => {
        if (isNaN(seconds) || seconds < 0) return "00:00"; // NaN bo'lib qolishidan himoya
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const isLowTime = timeLeft < 60; // 1 minutdan kam qolsa qizil rangga o'tadi

    return (
        <header className="bg-white border-b border-slate-100 px-4 md:px-6 py-4 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto flex items-center justify-between">

                {/* Chap taraf: Back va Sarlavha */}
                <div className="flex items-center gap-3 md:gap-4">
                    <button
                        onClick={onBack}
                        className="p-2 hover:bg-slate-50 rounded-xl transition-all text-slate-400 hover:text-slate-900"
                    >
                        <ChevronLeft size={24} />
                    </button>
                    <div>
                        <h1 className="font-black text-slate-900 text-xs md:text-base leading-none line-clamp-1 max-w-[150px] md:max-w-none">
                            {title}
                        </h1>
                        <p className="text-[9px] md:text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1">
                            {sectionName}
                        </p>
                    </div>
                </div>

                {/* Markaz: Taymer (Agar duration bo'lsa) */}
                {duration > 0 && (
                    <div className={`flex items-center gap-2 px-4 py-2 rounded-2xl border transition-all ${isLowTime ? "bg-red-50 border-red-100 text-red-600 animate-pulse" : "bg-slate-50 border-slate-100 text-slate-700"
                        }`}>
                        <Timer size={18} className={isLowTime ? "text-red-500" : "text-slate-400"} />
                        <span className="font-black tabular-nums text-sm md:text-base">
                            {formatTime(timeLeft)}
                        </span>
                    </div>
                )}

                {/* O'ng taraf: Progress */}
                <div className="flex items-center gap-4">
                    <div className="hidden sm:flex flex-col items-end">
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Progress</span>
                        <div className="flex items-center gap-2">
                            <div className="w-20 md:w-32 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-primary transition-all duration-500"
                                    style={{ width: `${progress}%` }}
                                />
                            </div>
                            <span className="text-[10px] font-black text-slate-700">{Math.round(progress)}%</span>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default HomeworkHeader;