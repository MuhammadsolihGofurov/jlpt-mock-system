import { useModal } from "@/context/modal-context";
import { Edit2, Plus, Trash2 } from "lucide-react";
import useSWR, { mutate } from "swr";
import { useRouter } from "next/router";
import fetcher from "@/utils/fetcher";
import { useIntl } from "react-intl";
import { authAxios } from "@/utils/axios";

const GroupAndQuestionArea = ({ section, currentMockType }) => {
  const { openModal } = useModal();
  const router = useRouter();
  const intl = useIntl();

  const { data: groups } = useSWR(
    section ? [`jft-shared-contents/`, router.locale, section?.id] : null,
    (url, locale) =>
      fetcher(
        `${url}?section=${section?.id}&page=all`,
        { headers: { "Accept-Language": locale } },
        {},
        true,
      ),
  );

  const { data: questions } = useSWR(
    section ? [`${currentMockType?.question}`, router.locale, section?.id] : null,
    (url, locale) =>
      fetcher(
        `${url}?section=${section?.id}&page=all`,
        { headers: { "Accept-Language": locale } },
        {},
        true,
      ),
  );

  const handleDeleteQuestion = (id) => {
    openModal(
      "CONFIRM_MODAL",
      {
        title: "Savolni o'chirish",
        body: "Ushbu savolni o'chirib tashlamoqchimisiz? Bunda barcha bog'langan ma'lumotlar ham yo'qolishi mumkin.",
        confirmText: "Ha, o'chirilsin",
        variant: "danger",
        mutateKey: [`jft-questions/`, router.locale, section?.id],
        onConfirm: async () => {
          return await authAxios.delete(`jft-questions/${id}/`);
        },
      },
      "small",
    );
  };

  const handleDeleteGroup = (id) => {
    openModal(
      "CONFIRM_MODAL",
      {
        title: "Savollar guruhini o'chirish",
        body: "Ushbu savollar guruhini o'chirib tashlamoqchimisiz? Bunda barcha bog'langan ma'lumotlar ham yo'qolishi mumkin.",
        confirmText: "Ha, o'chirilsin",
        variant: "danger",
        mutateKey: [`jft-shared-contents/`, router.locale, section?.id],
        onConfirm: async () => {
          const result = await authAxios.delete(`jft-shared-contents/${id}/`);
          mutate([`jft-questions/`, router.locale, section?.id]);
          return result;
        },
      },
      "small",
    );
  };

  const groupedQuestions = questions && questions?.reduce((acc, q) => {
    const sharedId = q.shared_content?.id || 'no-shared';
    if (!acc[sharedId]) {
      acc[sharedId] = {
        sharedData: q.shared_content,
        items: []
      };
    }
    acc[sharedId].items.push(q);
    return acc;
  }, {});

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-black text-heading">{section.name}</h2>
          <p className="text-muted text-sm font-medium">
            {intl.formatMessage({ id: "Vaqt" })}: {section.duration} m
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => openModal("JFT_QUESTION_GROUP", { section, group_count: groups?.length }, "middle")}
            className="text-[10px] font-black uppercase bg-emerald-50 text-emerald-600 px-3 py-1.5 rounded-lg hover:bg-emerald-100"
          >
            {intl.formatMessage({ id: "Savollar guruhi qo'shish" })}
          </button>
          <button
            onClick={() => openModal(
              "JFT_QUESTION_FORM",
              {
                sectionId: section?.id,
                question_count: questions?.length,
                groupName: null,
                groups: groups
              },
              "middle",
            )}
            className="bg-slate-900 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-slate-800 transition-all shadow-xl"
          >
            <Plus size={18} />{" "}
            {intl.formatMessage({ id: "Savol" })}
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {questions?.length > 0 ? (
          Object.values(groupedQuestions).map((group, _groupIdx) => (
            <div key={_groupIdx} className="mb-6 border border-slate-200 rounded-3xl overflow-hidden bg-white">

              {/* SHARED CONTENT BLOCK (Agar mavjud bo'lsa) */}
              {group.sharedData && (
                <div className="flex items-center justify-between p-4 bg-slate-100/50 border-b border-slate-200">
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-500 text-white text-[10px] px-2 py-1 rounded-md font-bold uppercase">Shared Content</div>
                    <span className="font-semibold text-slate-800">{group?.sharedData?.title}</span>
                  </div>

                  {/* Shared Content Edit/Delete */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => openModal("JFT_QUESTION_GROUP", { group: group?.sharedData, section, group_count: group?.sharedData?.count }, "middle")}
                      className="p-1.5 text-blue-600 bg-white rounded-lg border border-slate-200 shadow-sm hover:bg-blue-50"
                    >
                      <Edit2 size={14} />
                    </button>
                    <button
                      onClick={() => handleDeleteGroup(group?.sharedData?.id)}
                      className="p-1.5 text-red-500 bg-white rounded-lg border border-slate-200 shadow-sm hover:bg-red-50"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              )}

              {/* QUESTIONS UNDER THIS SHARED CONTENT */}
              <div className="divide-y divide-slate-100">
                {group.items.map((q, idx) => (
                  <div
                    key={q.id}
                    className="group flex items-center justify-between p-4 hover:bg-slate-50 transition-all"
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-slate-300 font-bold">#{q?.question_number}</span>
                      <div
                        className="text-sm font-medium text-slate-700 line-clamp-1"
                        dangerouslySetInnerHTML={{ __html: q?.text }}
                      />
                    </div>

                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => openModal("JFT_QUESTION_FORM", { question: q, sectionId: section?.id, groupName: group?.sharedData?.title, groups: groups }, "middle")}
                        className="p-2 text-emerald-500 bg-white border border-slate-100 rounded-xl shadow-sm hover:shadow-md"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        onClick={() => handleDeleteQuestion(q?.id)}
                        className="p-2 text-red-500 bg-white border border-slate-100 rounded-xl shadow-sm hover:shadow-md"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        ) : (
          <p className="text-xs text-center text-muted py-4 italic">
            {intl.formatMessage({ id: "Hozircha savollar yo'q" })}
          </p>
        )}
      </div>

      {/* <div className="space-y-4">
        {groups?.map((group) => (
          <div
            key={group.id}
            className="border border-slate-100 rounded-[2rem] overflow-hidden bg-white shadow-sm hover:border-orange-100 transition-all"
          >
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
                        section_id: section?.id,
                        section_type: section?.section_type,
                        groupId: group.id,
                        sectionId: section?.id,
                        question_count: group?.questions?.length,
                        groupName: group?.title,
                        currentMockType
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
                    openModal("QUESTION_GROUP", { section, group, currentMockType }, "middle")
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

            <div className="p-4 bg-white h-60 overflow-y-scroll custom-scrollbar">
              <div className="text-sm italic text-gray-500 pb-3" dangerouslySetInnerHTML={{ __html: group?.instruction }} />
              <QuestionList
                groupId={group.id}
                section_type={section?.section_type}
                sectionId={section?.id}
                groupName={group?.title}
                currentMockType={currentMockType}
              />
            </div>
          </div>
        ))}
      </div> */}



    </div>
  );
};

export default GroupAndQuestionArea;
