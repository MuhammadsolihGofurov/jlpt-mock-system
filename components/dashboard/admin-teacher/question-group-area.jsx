import { useModal } from "@/context/modal-context";
import { Edit2, Plus, Settings, Trash2 } from "lucide-react";
import QuestionList from "./question-list";
import useSWR from "swr";
import { useRouter } from "next/router";
import fetcher from "@/utils/fetcher";
import { useIntl } from "react-intl";
import { authAxios } from "@/utils/axios";

const GroupAndQuestionArea = ({ section }) => {
  const { openModal } = useModal();
  const router = useRouter();
  const intl = useIntl();

  const { data: groups, mutate } = useSWR(
    section ? [`question-groups/`, router.locale, section?.id] : null,
    (url, locale) =>
      fetcher(
        `${url}?section=${section?.id}&page=all`,
        { headers: { "Accept-Language": locale } },
        {},
        true,
      ),
  );

  const handleDelete = (id) => {
    openModal(
      "CONFIRM_MODAL",
      {
        title: "Mondaini o'chirish",
        body: "Ushbu mondaini o'chirib tashlamoqchimisiz? Bunda barcha bog'langan ma'lumotlar ham yo'qolishi mumkin.",
        confirmText: "Ha, o'chirilsin",
        variant: "danger",
        mutateKey: ["question-groups/", router.locale, section?.id],
        onConfirm: async () => {
          return await authAxios.delete(`question-groups/${id}/`);
        },
      },
      "small",
    );
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-black text-heading">{section.name}</h2>
          <p className="text-muted text-sm font-medium">
            {intl.formatMessage({ id: "Vaqt" })}: {section.duration} m
          </p>
        </div>
        <button
          onClick={() => openModal("QUESTION_GROUP", { section, group_count: groups?.length }, "middle")}
          className="bg-slate-900 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-slate-800 transition-all shadow-xl"
        >
          <Plus size={18} />{" "}
          {intl.formatMessage({ id: "Yangi Mondai qo'shish" })}
        </button>
      </div>

      <div className="space-y-4">
        {groups?.map((group) => (
          <div
            key={group.id}
            className="border border-slate-100 rounded-[2rem] overflow-hidden bg-white shadow-sm hover:border-orange-100 transition-all"
          >
            {/* Group Header */}
            <div className="bg-slate-50/50 p-5 flex justify-between items-center border-b border-slate-50">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 bg-white border border-slate-200 rounded-lg flex items-center justify-center font-bold text-xs">
                  {group.order || "0"}
                </span>
                <h4 className="font-semibold text-heading uppercase tracking-wide">
                  {group.title}
                </h4>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() =>
                    openModal(
                      "QUESTION_FORM",
                      {
                        section_type: section?.section_type,
                        groupId: group.id,
                        sectionId: section?.id,
                        question_count: group?.questions?.length,
                        groupName: group?.title
                      },
                      "middle",
                    )
                  }
                  className="text-[10px] font-black uppercase bg-emerald-50 text-emerald-600 px-3 py-1.5 rounded-lg hover:bg-emerald-100"
                >
                  + {intl.formatMessage({ id: "Savol" })}
                </button>
                <button
                  onClick={() =>
                    openModal("QUESTION_GROUP", { section, group }, "middle")
                  }
                  className="p-2 text-slate-400 hover:text-primary transition-all"
                >
                  <Edit2 size={18} />
                </button>
                <button
                  onClick={() => handleDelete(group?.id)}
                  className="p-2 text-slate-400 hover:text-danger transition-all"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>

            {/* Questions List inside Group */}
            <div className="p-4 bg-white h-60 overflow-y-scroll custom-scrollbar">
              <div className="text-sm italic text-gray-500 pb-3" dangerouslySetInnerHTML={{ __html: group?.instruction }} />
              <QuestionList
                groupId={group.id}
                section_type={section?.section_type}
                sectionId={section?.id}
                groupName={group?.title}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GroupAndQuestionArea;
