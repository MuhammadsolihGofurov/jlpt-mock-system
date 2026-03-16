export const QuestionRenderer = ({ group, onSelect, selectedAnswers }) => {
  return (
    <div className="mb-4 sm:mb-12 bg-slate-50 p-2 sm:p-6 rounded-3xl border border-slate-100">
      <div className="mb-6">
        <span className="bg-primary text-white px-4 py-1 rounded-full text-sm font-bold">
          Mondai {group.mondai_number}
        </span>
        <h4 className="text-lg font-bold mt-3 text-slate-700">{group.title}</h4>
        <p className="text-slate-500 italic text-sm">{group.instruction}</p>
        {group.reading_text && (
          <div className="mt-4 p-4 bg-white border rounded-xl text-slate-700 leading-relaxed">
            {group.reading_text}
          </div>
        )}
      </div>

      <div className="space-y-8">
        {group.questions.map((q) => (
          <div
            key={q.id}
            className="bg-white p-3 sm:p-6 rounded-2xl shadow-sm border border-slate-100"
          >
            <p className="font-bold text-slate-800 mb-4">
              {q.question_number}. {q.text}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {q.options.map((option, idx) => (
                <button
                  key={idx}
                  onClick={() => onSelect(q.id, idx)}
                  className={`p-4 text-left rounded-xl border-2 transition-all flex items-center gap-3
                    ${
                      selectedAnswers[q.id] === idx
                        ? "border-primary bg-orange-50 text-primary font-bold ring-2 ring-orange-200"
                        : "border-slate-100 hover:border-slate-300 text-slate-600"
                    }`}
                >
                  <span
                    className={`w-8 h-8 rounded-full flex items-center justify-center border-2 
                    ${selectedAnswers[q.id] === idx ? "border-primary bg-primary text-white" : "border-slate-200"}`}
                  >
                    {idx + 1}
                  </span>
                  <span className="flex-1">{option.text}</span>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
