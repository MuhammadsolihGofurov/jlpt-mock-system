import { useModal } from "@/context/modal-context";
import { Plus, Settings } from "lucide-react";
import QuestionList from "./question-list";
import useSWR from "swr";
import { useRouter } from "next/router";
import fetcher from "@/utils/fetcher";

const GroupAndQuestionArea = ({ section }) => {
  const { openModal } = useModal();
  const router = useRouter();

  const { data: groups, mutate } = useSWR(
    section ? [`/test-sections/${section.id}/groups/`, router.locale] : null,
    (url, locale) =>
      fetcher(url, { headers: { "Accept-Language": locale } }, {}, true),
  );

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-black text-heading">{section.name}</h2>
          <p className="text-muted text-sm font-medium">
            Vaqt: {section.duration} daqiqa
          </p>
        </div>
        <button
          onClick={() => openModal("GROUP_FORM", { sectionId: section.id })}
          className="bg-slate-900 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-slate-800 transition-all shadow-xl"
        >
          <Plus size={18} /> Guruh qo'shish
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
                <h4 className="font-black text-heading uppercase tracking-wide">
                  {group.name}
                </h4>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() =>
                    openModal("QUESTION_FORM", { groupId: group.id })
                  }
                  className="text-[10px] font-black uppercase bg-emerald-50 text-emerald-600 px-3 py-1.5 rounded-lg hover:bg-emerald-100"
                >
                  + Savol
                </button>
                <button
                  onClick={() => openModal("GROUP_FORM", { group })}
                  className="p-2 text-slate-400 hover:text-primary transition-all"
                >
                  <Settings size={18} />
                </button>
              </div>
            </div>

            {/* Questions List inside Group */}
            <div className="p-4 bg-white">
              <QuestionList groupId={group.id} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GroupAndQuestionArea;
