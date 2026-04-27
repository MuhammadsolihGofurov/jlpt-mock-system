import { Edit2, Layers, Plus, Trash2 } from "lucide-react";
import useSWR, { mutate } from "swr";
import { useRouter } from "next/router";
import { useIntl } from "react-intl";
import fetcher from "@/utils/fetcher";
import { authAxios } from "@/utils/axios";
import { useModal } from "@/context/modal-context";

const JFTQuestionGroupListModal = ({ section }) => {
  const { openModal, closeModal } = useModal();
  const router = useRouter();
  const intl = useIntl();

  const { data: groups, isLoading } = useSWR(
    section ? [`jft-shared-contents/`, router.locale, section?.id] : null,
    (url, locale) =>
      fetcher(
        `${url}?section=${section?.id}&page=all`,
        { headers: { "Accept-Language": locale } },
        {},
        true,
      ),
  );

  const handleDelete = (item) => {
    openModal(
      "CONFIRM_MODAL",
      {
        title: intl.formatMessage({ id: "Savollar guruhini o'chirish" }),
        body: intl.formatMessage({
          id: "Ushbu savollar guruhini o'chirib tashlamoqchimisiz? Bunda barcha bog'langan ma'lumotlar ham yo'qolishi mumkin.",
        }),
        confirmText: intl.formatMessage({ id: "Ha, o'chirilsin" }),
        variant: "danger",
        mutateKey: [`jft-shared-contents/`, router.locale, section?.id],
        onConfirm: async () => {
          // First delete all questions belonging to this group
          const questionsRes = await authAxios.get(
            `jft-questions/?section=${section?.id}&page=all`
          );
          const allQuestions = Array.isArray(questionsRes.data)
            ? questionsRes.data
            : questionsRes.data?.results || [];
          const groupQuestions = allQuestions.filter(
            (q) => q.shared_content?.id === item.id
          );
          await Promise.all(
            groupQuestions.map((q) => authAxios.delete(`jft-questions/${q.id}/`))
          );
          // Then delete the group itself
          const result = await authAxios.delete(`jft-shared-contents/${item.id}/`);
          mutate([`jft-questions/`, router.locale, section?.id]);
          return result;
        },
      },
      "small",
    );
  };

  return (
    <div className="p-6 sm:p-8 max-h-[90vh] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="bg-emerald-100 p-3 rounded-2xl text-emerald-600">
            <Layers size={24} />
          </div>
          <div>
            <h2 className="text-xl font-black text-heading">{section?.name}</h2>
            <p className="text-muted text-sm font-medium">
              {intl.formatMessage({ id: "Savollar guruhlari" })}
            </p>
          </div>
        </div>

        <button
          onClick={() =>
            openModal(
              "JFT_QUESTION_GROUP",
              { section, group_count: groups?.length ?? 0 },
              "middle",
            )
          }
          className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-xl font-bold shadow-lg shadow-orange-100 hover:scale-105 transition-all"
        >
          <Plus size={16} />
          {intl.formatMessage({ id: "Yangi guruh qo'shish" })}
        </button>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto custom-scrollbar pr-1">
        {isLoading ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-14 bg-slate-50 animate-pulse rounded-2xl" />
            ))}
          </div>
        ) : groups?.length > 0 ? (
          <div className="space-y-3">
            {groups.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-2xl hover:border-emerald-200 hover:shadow-sm transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="bg-blue-500 text-white text-[10px] px-2 py-1 rounded-md font-bold uppercase">
                    {item.mondai_number ?? item.order ?? "—"}
                  </div>
                  <span className="font-semibold text-slate-800 text-sm">
                    {item.title}
                  </span>
                </div>

                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() =>
                      openModal("JFT_QUESTION_GROUP", { group: item, section }, "middle")
                    }
                    className="p-2 text-blue-500 bg-white border border-slate-100 rounded-xl shadow-sm hover:bg-blue-50 transition-all"
                  >
                    <Edit2 size={14} />
                  </button>
                  <button
                    onClick={() => handleDelete(item)}
                    className="p-2 text-red-500 bg-white border border-slate-100 rounded-xl shadow-sm hover:bg-red-50 transition-all"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-slate-50/50 rounded-[2rem] border border-dashed border-slate-200">
            <Layers size={40} className="mx-auto text-slate-300 mb-3" />
            <p className="text-slate-500 font-medium text-sm">
              {intl.formatMessage({ id: "Hozircha savollar guruhi yo'q" })}
            </p>
          </div>
        )}
      </div>

      {/* Footer close */}
      <div className="pt-6 mt-2 border-t border-slate-100 flex justify-end">
        <button
          onClick={() => closeModal("JFT_QUESTION_GROUP_LIST")}
          className="px-6 py-3 rounded-2xl font-bold text-muted hover:bg-slate-100 transition-all"
        >
          {intl.formatMessage({ id: "Yopish" })}
        </button>
      </div>
    </div>
  );
};

export default JFTQuestionGroupListModal;
