import {
  Edit2,
  Trash2,
  Calendar,
  Users,
  BarChart3,
  BookOpen,
  Clock,
  PlayCircle,
} from "lucide-react";
import { authAxios } from "@/utils/axios";
import { useModal } from "@/context/modal-context";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import Link from "next/link";
import { useIntl } from "react-intl";

const HomeworkCard = ({ item, mutate }) => {
  const { openModal } = useModal();
  const router = useRouter();
  const intl = useIntl();
  const { page = 1, search } = router.query;

  const { user } = useSelector((state) => state.auth);

  const isAdmin = user?.role === "CENTER_ADMIN";
  const isTeacher = user?.role === "TEACHER";
  const isStudent = user?.role === "STUDENT";
  const isCreator = user?.id === item.created_by_id;

  // Edit/Delete huquqi
  const canManage = isAdmin || (isTeacher && isCreator);

  const getResultsLink = () => {
    if (isStudent) {
      return `/dashboard/results/my-homework-results/${item.id}`;
    }
    return `/dashboard/results/homework-results/${item.id}`;
  };

  const handleDelete = () => {
    openModal(
      "CONFIRM_MODAL",
      {
        title: "Vazifani o'chirish",
        body: "Ushbu uy vazifasini o'chirib tashlamoqchimisiz?",
        confirmText: "Ha, o'chirilsin",
        variant: "danger",
        onConfirm: async () =>
          await authAxios.delete(`homework-assignments/${item.id}/`),
        mutateKey: [`homework-assignments/`, router.locale, page, search],
      },
      "small",
    );
  };
  
  const formatDate = (dateStr) => {
    if (!dateStr) return { full: "---", time: "--:--" };
    const date = new Date(dateStr);
    return {
      full: date.toLocaleDateString("uz-UZ", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }),
      time: date.toLocaleTimeString("uz-UZ", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
  };

  const dateInfo = formatDate(item.deadline);

  return (
    <div className="group bg-white border border-slate-100 p-6 rounded-[2.5rem] shadow-sm hover:shadow-2xl hover:shadow-blue-100/50 transition-all duration-500 flex flex-col h-full relative">
      {/* Action Buttons */}
      {canManage && (
        <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
          <button
            onClick={() =>
              openModal("HOMEWORK_FORM", { homework: item }, "middle")
            }
            className="p-2 bg-slate-50 text-slate-600 rounded-xl hover:bg-emerald-500 hover:text-white transition-all"
          >
            <Edit2 size={16} />
          </button>
          <button
            onClick={handleDelete}
            className="p-2 bg-slate-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all"
          >
            <Trash2 size={16} />
          </button>
        </div>
      )}

      {/* Icon & Badge */}
      <div className="flex flex-col items-start gap-3 mb-4">
        <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
          <BookOpen size={24} />
        </div>
        <div className="px-3 py-1 bg-amber-50 text-amber-600 rounded-lg text-[10px] font-black uppercase tracking-widest flex items-center gap-1">
          <Clock size={12} />
          <span>{intl.formatMessage({ id: "Deadline" })}:</span>
          {item.deadline ? (
            <div className="flex items-center gap-2.5 text-slate-800">
              <span className="text-[12px] font-semibold tracking-tight">
                {dateInfo.full}
              </span>
              <div className="flex items-center gap-1 px-2 py-0.5 bg-slate-100 rounded-md border border-slate-200 text-[10px] font-semibold text-slate-500">
                <Clock size={10} /> {dateInfo.time}
              </div>
            </div>
          ) : (
            "—"
          )}
        </div>
      </div>

      <div className="flex-1">
        <h3 className="text-lg font-black text-heading line-clamp-2 mb-2 leading-tight">
          {item.title}
        </h3>
        <p className="text-muted text-sm line-clamp-2 mb-4">
          {item.description || intl.formatMessage({ id: "Tavsif berilmagan" })}
        </p>

        <div className="space-y-2 mb-6">
          <div className="flex items-center gap-2 text-slate-500 text-[11px] font-bold uppercase">
            <Users size={14} className="text-slate-400" />
            <span className="truncate">
              {item.assigned_groups?.map((g) => g.name).join(", ") ||
                intl.formatMessage({ id: "Guruh biriktirilmagan" })}
            </span>
          </div>
          <div className="flex gap-2">
            <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded font-bold">
              {item.quizzes?.length || 0} {intl.formatMessage({ id: "Quizzes" })}
            </span>
            <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded font-bold">
              {item.mock_tests?.length || 0} {intl.formatMessage({ id: "Mocks" })}
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        {isStudent && (
          <Link
            href={`/dashboard/playground/homework/${item?.id}`}
            className="w-full bg-primary text-white font-semibold py-4 rounded-[1.5rem] transition-all flex items-center justify-center gap-2 text-sm shadow-sm active:scale-95"
          >
            <PlayCircle size={18} />
            {intl.formatMessage({ id: "Vazifani boshlash" })}
          </Link>
        )}

        {(
          <Link href={getResultsLink()}>
            <button className="w-full bg-slate-50 hover:bg-slate-100 text-heading font-semibold py-4 rounded-[1.5rem] transition-all flex items-center justify-center gap-2 text-sm shadow-sm active:scale-95">
              <BarChart3 size={16} />
              {intl.formatMessage({ id: "Natijalarni ko'rish" })}
            </button>
          </Link>
        )}
      </div>
    </div>
  );
};

export default HomeworkCard;
