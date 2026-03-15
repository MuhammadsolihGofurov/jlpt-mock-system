import { Edit2 } from "lucide-react";

const { useModal } = require("@/context/modal-context");

const QuestionList = ({ groupId }) => {
  const { openModal } = useModal();

  const { data: questions } = useSWR(
    groupId ? [`/question-groups/${groupId}/questions/`, router.locale] : null,
    (url, locale) =>
      fetcher(url, { headers: { "Accept-Language": locale } }, {}, true),
  );

  return (
    <div className="space-y-2">
      {questions?.length > 0 ? (
        questions.map((q, idx) => (
          <div
            key={q.id}
            className="group flex items-center justify-between p-4 hover:bg-slate-50 rounded-2xl border border-transparent hover:border-slate-100 transition-all"
          >
            <div className="flex items-center gap-4">
              <span className="text-slate-300 font-bold">#{idx + 1}</span>
              <p className="text-sm font-bold text-slate-700 line-clamp-1">
                {q.text}
              </p>
            </div>
            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => openModal("QUESTION_FORM", { question: q })}
                className="p-2 text-emerald-500 bg-white border border-slate-100 rounded-xl shadow-sm"
              >
                <Edit2 size={14} />
              </button>
              {/* Delete function logic xuddi yuqoridagidek CONFIRM_MODAL bilan */}
            </div>
          </div>
        ))
      ) : (
        <p className="text-xs text-center text-muted py-4 italic">
          Hozircha savollar yo'q
        </p>
      )}
    </div>
  );
};

export default QuestionList;
