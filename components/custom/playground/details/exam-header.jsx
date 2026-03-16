import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux"; // Redux ulanishi
import { Timer, AlertCircle, Maximize2, Flag } from "lucide-react";

const ExamHeader = ({ title, sectionName, duration, onTimeUp }) => {
  // Redux store'dan user ma'lumotlarini olish
  const { user } = useSelector((state) => state.auth);

  // duration minutda keladi, uni sekundga o'tkazamiz
  const [timeLeft, setTimeLeft] = useState(duration * 60);

  useEffect(() => {
    // Har safar bo'lim almashganda duration o'zgarsa, taymerni yangilash
    setTimeLeft(duration * 60);
  }, [duration]);

  useEffect(() => {
    if (timeLeft <= 0) {
      onTimeUp();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, onTimeUp]);

  // Sekundlarni MM:SS formatiga o'tkazish
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const isLowTime = timeLeft < 300; // 5 minutdan kam qolsa

  // Foydalanuvchi ismining birinchi harfini olish
  const userInitial =
    user?.full_name?.charAt(0) || user?.first_name?.charAt(0) || "U";

  return (
    <header className="max-h-20 py-2 bg-white border-b border-slate-200 px-6 flex items-center justify-between z-50 shadow-sm">
      {/* Chap taraf: Imtihon nomi */}
      <div className="sm:flex hidden items-center gap-4">
        <div className="bg-primary/10 p-2.5 rounded-2xl">
          <Flag className="text-primary" size={24} />
        </div>
        <div>
          <h1 className="text-lg font-black text-heading leading-none uppercase tracking-tight">
            {title}
          </h1>
          <p className="text-sm text-muted font-bold mt-1 uppercase opacity-70">
            {sectionName}
          </p>
        </div>
      </div>

      {/* Markaz: Taymer */}
      <div
        className={`flex items-center gap-3 px-6 py-2.5 rounded-2xl transition-all duration-500 border ${
          isLowTime
            ? "bg-red-50 text-red-600 border-red-100 animate-pulse shadow-lg shadow-red-100"
            : "bg-slate-50 text-slate-700 border-slate-100"
        }`}
      >
        <Timer
          size={24}
          className={isLowTime ? "text-red-600" : "text-primary"}
        />
        <span className="text-xl sm:text-2xl font-mono font-black tabular-nums">
          {formatTime(timeLeft)}
        </span>
        {isLowTime && (
          <AlertCircle size={18} className="text-red-600 hidden md:block" />
        )}
      </div>

      {/* O'ng taraf: Real User Info & Actions */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => {
            if (!document.fullscreenElement) {
              document.documentElement.requestFullscreen();
            } else {
              document.exitFullscreen();
            }
          }}
          className="p-3 text-slate-400 hover:text-primary hover:bg-orange-50 rounded-xl transition-all group"
          title="Fullscreen"
        >
          <Maximize2
            size={20}
            className="group-active:scale-90 transition-transform"
          />
        </button>

        <div className="h-10 w-[1px] bg-slate-200 mx-2 hidden md:block" />

        <div className="hidden md:flex items-center gap-3 bg-slate-50 p-1.5 pr-4 rounded-2xl border border-slate-100">
          <div className="w-9 h-9 rounded-xl bg-primary text-white flex items-center justify-center font-black shadow-lg shadow-orange-200 uppercase">
            {userInitial}
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-black text-slate-700 leading-none">
              {user?.full_name || user?.first_name || "Foydalanuvchi"}
            </span>
            <span className="text-[10px] font-bold text-slate-400 uppercase mt-0.5">
              ID: {user?.id?.toString().slice(0, 8) || "N/A"}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default ExamHeader;
