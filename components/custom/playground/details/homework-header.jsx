import React from "react";
import { ChevronLeft, Info } from "lucide-react";

const HomeworkHeader = ({ title, sectionName, onBack, progress }) => {
    return (
        <header className="bg-white border-b border-slate-100 px-6 py-4 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button
                        onClick={onBack}
                        className="p-2 hover:bg-slate-50 rounded-xl transition-all text-slate-400 hover:text-slate-900"
                    >
                        <ChevronLeft size={24} />
                    </button>
                    <div>
                        <h1 className="font-black text-slate-900 text-sm md:text-base leading-none">
                            {title}
                        </h1>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1">
                            {sectionName}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-6">
                    <div className="hidden md:flex flex-col items-end">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Progress</span>
                        <div className="flex items-center gap-2">
                            <div className="w-32 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-primary transition-all duration-500"
                                    style={{ width: `${progress}%` }}
                                />
                            </div>
                            <span className="text-xs font-bold text-slate-700">{Math.round(progress)}%</span>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default HomeworkHeader;