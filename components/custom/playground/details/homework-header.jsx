import React, { useState, useEffect } from "react";
import { ChevronLeft, Timer } from "lucide-react";

const HomeworkHeader = ({ title, onBack, progress, duration, onTimeUp }) => {
    const [timeLeft, setTimeLeft] = useState(duration || 0);

    useEffect(() => {
        if (timeLeft <= 0) {
            onTimeUp?.();
            return;
        }
        const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
        return () => clearInterval(timer);
    }, [timeLeft]);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <header className="bg-white border-b p-4 flex items-center justify-between shadow-sm">
            <button onClick={onBack} className="p-2 hover:bg-slate-50 rounded-full">
                <ChevronLeft size={20} />
            </button>

            <div className="flex flex-col items-center">
                <div className={`flex items-center gap-2 px-3 py-1 rounded-full border ${timeLeft < 30 ? 'bg-red-50 text-red-600 border-red-100 animate-pulse' : 'bg-slate-50 text-slate-700'}`}>
                    <Timer size={16} />
                    <span className="font-black tabular-nums">{formatTime(timeLeft)}</span>
                </div>
            </div>

            <div className="w-24 h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-primary transition-all" style={{ width: `${progress}%` }} />
            </div>
        </header>
    );
};

export default HomeworkHeader;