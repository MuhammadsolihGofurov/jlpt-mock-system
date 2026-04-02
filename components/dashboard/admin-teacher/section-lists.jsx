import React from "react";
import useSWR, { mutate } from "swr";
import fetcher from "@/utils/fetcher";
import {
  Edit2,
  Trash2,
  Clock,
  ChevronRight,
  BookAlertIcon,
  CirclePlus,
} from "lucide-react";
import { useModal } from "@/context/modal-context";
import { useRouter } from "next/router";
import { authAxios } from "@/utils/axios";
import { useIntl } from "react-intl";

const SectionList = ({ mockId, activeSection, sections, onSelect }) => {
  const { openModal } = useModal();
  const router = useRouter();
  const intl = useIntl();

  // Mock'ka tegishli barcha section'larni olish
  //   const { data: sections, mutate } = useSWR(
  //     mockId ? [`test-sections/`, router.locale] : null,
  //     (url, locale) =>
  //       fetcher(
  //         `${url}?mock_id=${mockId}`,
  //         { headers: { "Accept-Language": locale } },
  //         {},
  //         true,
  //       ),
  //   );

  const handleDeleteSection = (e, section) => {
    e.stopPropagation();
    openModal(
      "CONFIRM_MODAL",
      {
        title: "Bo'limni o'chirish",
        body: `"${section.title}" bo'limini o'chirib tashlamoqchimisiz? Ichidagi barcha guruhlar ham o'chib ketadi.`,
        confirmText: "Ha, o'chirilsin",
        variant: "danger",
        onConfirm: async () => {
          await authAxios.delete(`/test-sections/${section.id}/`);
          mutate([`/mock-tests/${mockId}/`, router.locale]);
          if (activeSection?.id === section.id) onSelect(null);
        },
      },
      "small",
    );
  };

  const handleEditSection = (e, section) => {
    e.stopPropagation();
    openModal("SECTION_FORM", { mockId, section }, "middle");
  };

  if (!sections)
    return (
      <div className="p-4 text-center text-xs text-muted">
        {intl.formatMessage({ id: "Yuklanmoqda..." })}
      </div>
    );

  return (
    <div className="space-y-3">
      {sections.length > 0 ? (
        sections.map((section) => (
          <div
            key={section.id}
            onClick={() => onSelect(section)}
            className={`group relative p-4 rounded-2xl border transition-all cursor-pointer ${activeSection?.id === section.id
              ? "bg-primary border-primary shadow-lg shadow-orange-100 text-white"
              : "bg-white border-slate-100 hover:border-orange-200 text-slate-600"
              }`}
          >
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-start">
                <h4
                  className={`font-black text-sm uppercase tracking-tight leading-tight pr-8 ${activeSection?.id === section.id
                    ? "text-white"
                    : "text-heading"
                    }`}
                >
                  {section.name}
                </h4>
                <ChevronRight
                  size={16}
                  className={`transition-transform ${activeSection?.id === section.id ? "rotate-90" : "opacity-30"}`}
                />
              </div>

              <div className="flex gap-3">
                <div className="flex items-center gap-2">
                  <BookAlertIcon
                    size={12}
                    className={
                      activeSection?.id === section.id
                        ? "text-white/80"
                        : "text-slate-400"
                    }
                  />
                  <span className="text-[10px] font-bold">
                    {section.section_type}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock
                    size={12}
                    className={
                      activeSection?.id === section.id
                        ? "text-white/80"
                        : "text-slate-400"
                    }
                  />
                  <span className="text-[10px] font-bold">
                    {section.duration || 0} m
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <CirclePlus
                    size={12}
                    className={
                      activeSection?.id === section.id
                        ? "text-white/80"
                        : "text-slate-400"
                    }
                  />
                  <span className="text-[10px] font-bold">
                    {section.total_score || 0} ball
                  </span>
                </div>
              </div>
            </div>

            {/* Hover Actions */}
            <div
              className={`absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity ${activeSection?.id === section.id
                ? "text-white"
                : "text-slate-400"
                }`}
            >
              <button
                onClick={(e) => handleEditSection(e, section)}
                className={`p-1.5 rounded-lg transition-colors ${activeSection?.id === section.id
                  ? "hover:bg-white/20"
                  : "hover:bg-slate-100 hover:text-primary"
                  }`}
              >
                <Edit2 size={12} />
              </button>
              <button
                onClick={(e) => handleDeleteSection(e, section)}
                className={`p-1.5 rounded-lg transition-colors ${activeSection?.id === section.id
                  ? "hover:bg-white/20"
                  : "hover:bg-slate-100 hover:text-red-500"
                  }`}
              >
                <Trash2 size={12} />
              </button>
            </div>
          </div>
        ))
      ) : (
        <div className="py-10 text-center border-2 border-dashed border-slate-100 rounded-[2rem]">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            {intl.formatMessage({ id: "Bo'limlar mavjud emas" })}
          </p>
        </div>
      )}
    </div>
  );
};

export default SectionList;
