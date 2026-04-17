import { authAxios } from "@/utils/axios";
import fetcher from "@/utils/fetcher";
import { Edit2, Trash2 } from "lucide-react";
import { useRouter } from "next/router";
import { useIntl } from "react-intl";
import useSWR from "swr";

const { useModal } = require("@/context/modal-context");

const QuestionList = ({ groupId, section_type, sectionId, groupName, currentMockType }) => {
  const { openModal } = useModal();
  const router = useRouter();
  const intl = useIntl();

  const { data: questions } = useSWR(
    groupId ? [`${currentMockType?.question}`, router.locale, groupId] : null,
    (url, locale) =>
      fetcher(
        `${url}?${currentMockType?.question_group_type}=${groupId}&page=all`,
        { headers: { "Accept-Language": locale } },
        {},
        true,
      ),
  );

  const handleDelete = (id) => {
    openModal(
      "CONFIRM_MODAL",
      {
        title: "Savolni o'chirish",
        body: "Ushbu savolni o'chirib tashlamoqchimisiz? Bunda barcha bog'langan ma'lumotlar ham yo'qolishi mumkin.",
        confirmText: "Ha, o'chirilsin",
        variant: "danger",
        mutateKey: [`${currentMockType?.question}`, router.locale, groupId],
        onConfirm: async () => {
          return await authAxios.delete(`${currentMockType?.question}${id}/`);
        },
      },
      "small",
    );
  };

  return (
    <div className="space-y-2">
      {questions?.length > 0 ? (
        questions?.map((q, idx) => (
          <div
            key={q.id}
            className="group flex items-center justify-between p-4 hover:bg-slate-50 rounded-2xl border border-transparent hover:border-slate-100 transition-all"
          >
            <div className="flex items-center gap-4">
              <span className="text-slate-300 font-bold">#{idx + 1}</span>
              <div className="text-sm font-bold text-slate-700 line-clamp-1" dangerouslySetInnerHTML={{ __html: q?.text }} />
            </div>
            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() =>
                  openModal(
                    "QUESTION_FORM",
                    { groupId, question: q, section_type, sectionId, groupName, currentMockType },
                    "middle",
                  )
                }
                className="p-2 text-emerald-500 bg-white border border-slate-100 rounded-xl shadow-sm"
              >
                <Edit2 size={14} />
              </button>
              <button
                onClick={() => handleDelete(q?.id)}
                className="p-2 text-danger bg-white border border-slate-100 rounded-xl shadow-sm"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))
      ) : (
        <p className="text-xs text-center text-muted py-4 italic">
          {intl.formatMessage({ id: "Hozircha savollar yo'q" })}
        </p>
      )}
    </div>
  );
};

export default QuestionList;
