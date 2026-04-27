import React, { useEffect, useRef } from "react";
import { useIntl } from "react-intl";

export const QuestionRenderer = ({
  group,
  onSelect,
  selectedAnswers,
  isActiveGroup,
  onAudioEnd,
  audioMode,
  sectionType
}) => {
  const audioRef = useRef(null);
  const intl = useIntl();

  useEffect(() => {
    if (audioMode === "auto" && isActiveGroup && group.audio_file && audioRef.current) {
      audioRef.current.play().catch(err => console.log("Audio blocked", err));
    }
  }, [isActiveGroup, group.audio_file, audioMode]);

  return (
    <div className={`mb-12 p-4 sm:p-8 rounded-[2.5rem] border transition-all duration-500 ${isActiveGroup ? "bg-white border-primary shadow-2xl shadow-orange-100 scale-[1.01]" : "bg-slate-50 border-slate-100 opacity-60"
      }`}>
      <div className="mb-6">
        <div className="flex justify-between items-start italic">
          <span className="bg-primary text-white px-5 py-1.5 rounded-2xl text-sm font-black uppercase tracking-wider">
            Mondai {group.mondai_number}
          </span>
          {audioMode === "auto" && group.audio_file && isActiveGroup && (
            <span className="flex items-center gap-2 text-primary font-bold animate-pulse">
              <div className="w-2 h-2 bg-primary rounded-full" /> {intl.formatMessage({ id: "Tinglanmoqda..." })}
            </span>
          )}
        </div>

        <h4 className="text-xl font-black mt-4 text-slate-800 leading-tight">{group?.title}</h4>
        <div className="text-slate-500 font-medium mt-2 text-base" dangerouslySetInnerHTML={{ __html: group?.instruction }} />

        {/* 1. Image qo'shish (Full width) */}
        {group?.image && (
          <div className="mt-6 w-full overflow-hidden rounded-3xl border-4 border-slate-100">
            <img
              src={group.image}
              alt="Question illustration"
              className="w-full h-auto object-cover"
            />
          </div>
        )}

        {/* Listening Audio element (Yashirin) */}
        {group.audio_file && (
          <audio
            ref={audioRef}
            src={group.audio_file}
            onEnded={onAudioEnd}
            controls={false}
          />
        )}

        {group?.reading_text && (
          <div className="mt-6 p-6 bg-slate-50 rounded-3xl overflow-x-auto text-slate-700 leading-relaxed text-lg"
            dangerouslySetInnerHTML={{ __html: group?.reading_text }} />
        )}
      </div>

      <div className={`space-y-10 ${!isActiveGroup && group.audio_file ? "pointer-events-none" : ""}`}>
        {group?.questions.map((q) => (
          <div key={q.id} className="relative">
            {/* Savol ichidagi rasm bo'lsa */}
            {q?.image && (
              <div className="mb-4 max-w-md mx-auto rounded-2xl overflow-hidden shadow-md">
                <img src={q.image} alt="Q" className="w-full h-auto" />
              </div>
            )}

            <div className="text-slate-800 mb-5 text-lg flex gap-3">
              <span className="font-black text-primary">{q.question_number}.</span>
              <div dangerouslySetInnerHTML={{ __html: q.text }} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {q.options.map((option, idx) => {
                const isSelected = selectedAnswers[q.id] === idx;

                return (
                  <button
                    key={idx}
                    onClick={() => onSelect(q.id, idx)}
                    className={`p-5 text-left rounded-2xl border-2 transition-all flex items-center gap-4 group/opt min-h-[100px]
          ${isSelected
                        ? "border-primary bg-orange-50 ring-4 ring-orange-100"
                        : "border-slate-100 hover:border-slate-200 bg-white hover:shadow-md"
                      }`}
                  >
                    {/* Raqam belgisi */}
                    <span
                      className={`w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center border-2 font-black text-lg transition-all
            ${isSelected
                          ? "bg-primary border-primary text-white"
                          : "border-slate-200 text-slate-400 group-hover/opt:border-primary group-hover/opt:text-primary"
                        }`}
                    >
                      {idx + 1}
                    </span>

                    {/* Variant tarkibi: Matn yoki Rasm */}
                    <div className="flex-1 min-w-0">
                      {option?.image ? (
                        // Agar rasm bo'lsa
                        <div className="flex justify-center">
                          <img
                            src={option?.image}
                            alt={`Variant ${idx + 1}`}
                            className="max-h-52 max-w-full rounded-xl object-contain border border-slate-100"
                          />
                        </div>
                      ) : (
                        // Agar oddiy matn bo'lsa
                        <span
                          className={`block font-medium leading-relaxed break-words
                          ${isSelected ? "text-primary" : "text-slate-700"}`}
                        >
                          {option.text}
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};