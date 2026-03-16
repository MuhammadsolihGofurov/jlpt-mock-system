import React from "react";
import { useModal } from "@/context/modal-context";
import { useIntl } from "react-intl";
import {
  CheckCircle2,
  XCircle,
  HelpCircle,
  Info,
  Type,
  BookOpen,
  Headphones,
} from "lucide-react";

const ResultViewModal = ({ data }) => {
  const { closeModal } = useModal();
  const intl = useIntl();

  if (!data) {
    return null;
  }

  // Data ichidan kerakli ma'lumotlarni ajratib olamiz
  const { section_name, section_type, score, max_score, questions } = data;

  const getIcon = (type) => {
    switch (type) {
      case "VOCAB":
        return <Type size={24} />;
      case "READING":
        return <BookOpen size={24} />;
      case "LISTENING":
        return <Headphones size={24} />;
      default:
        return <HelpCircle size={24} />;
    }
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center flex-wrap justify-between mb-4 sm:mb-8 pb-4 sm:pb-6 gap-2 border-b border-slate-100">
        <div className="flex items-center gap-4">
          <div className="bg-primary/10 p-4 rounded-3xl text-primary">
            {getIcon(section_type)}
          </div>
          <div>
            <h2 className="text-lg sm:text-2xl font-black text-slate-800 uppercase leading-none mb-1">
              {section_type} {intl.formatMessage({ id: "Natijalari" })}
            </h2>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">
              {section_name} {intl.formatMessage({ id: "bo'limi tahlili" })}
            </p>
          </div>
        </div>
        <div className="sm:text-right">
          <div className="text-3xl font-black text-slate-900 leading-none">
            {score}
            <span className="text-slate-300 text-lg">/{max_score}</span>
          </div>
          <p className="text-[10px] font-black text-primary uppercase mt-1 tracking-tighter">
            {intl.formatMessage({ id: "To'plangan ball" })}
          </p>
        </div>
      </div>

      {/* Questions List */}
      <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
        {Object.entries(questions || {}).map(([id, q], index) => (
          <div
            key={id}
            className={`p-5 rounded-[2rem] border transition-all ${
              q.correct
                ? "bg-green-50/50 border-green-100 shadow-sm"
                : "bg-red-50/50 border-red-100"
            }`}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-4">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-xs ${
                    q.correct
                      ? "bg-green-500 text-white"
                      : "bg-red-500 text-white"
                  }`}
                >
                  {index + 1}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-black text-slate-500 uppercase tracking-wider">
                      {intl.formatMessage({ id: "Tanlangan variant" })}:
                    </span>
                    <span
                      className={`text-sm font-black ${q.correct ? "text-green-600" : "text-red-600"}`}
                    >
                      {q.selected_index + 1}
                    </span>
                  </div>
                </div>
              </div>
              <div className={q.correct ? "text-green-500" : "text-red-500"}>
                {q.correct ? <CheckCircle2 size={24} /> : <XCircle size={24} />}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="mt-4 sm:mt-8 pt-4 sm:pt-6 border-t border-slate-100 flex justify-end">
        <button
          onClick={() => closeModal("RESULT_VIEW")}
          className="px-8 py-3 sm:py-4 rounded-2xl font-semibold sm:font-black bg-slate-100 text-slate-500 hover:bg-slate-200 transition-all active:scale-95"
        >
          {intl.formatMessage({ id: "Yopish" })}
        </button>
      </div>
    </div>
  );
};

export default ResultViewModal;
