import {
  Edit2,
  Trash2,
  Calendar,
  Users,
  BarChart3,
  BookOpen,
  Clock,
} from "lucide-react";
import { authAxios } from "@/utils/axios";
import { useModal } from "@/context/modal-context";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import Link from "next/link";

const HomeworkCard = ({ item, mutate }) => {
  const { openModal } = useModal();
  const router = useRouter();
  const { user } = useSelector((state) => state.auth);

  const isAdmin = user?.role === "CENTER_ADMIN";
  const isTeacher = user?.role === "TEACHER";
  const isStudent = user?.role === "STUDENT";
  const isCreator = user?.id === item.created_by_id;

  // Edit/Delete huquqi
  const canManage = isAdmin || (isTeacher && isCreator);

  const getResultsLink = () => {
    if (isStudent) {
      return `/dashboard/homeworks/my-results/${item.id}`;
    }
    return `/dashboard/homeworks/results/${item.id}`;
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
          await authAxios.delete(`/homework-assignments/${item.id}/`),
        mutateKey: [`homework-assignments/`, router.locale],
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
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
          <BookOpen size={24} />
        </div>
        <div className="px-3 py-1 bg-amber-50 text-amber-600 rounded-lg text-[10px] font-black uppercase tracking-widest flex items-center gap-1">
          <Clock size={12} />
          Deadline:{" "}
          {item.deadline ? (
            <div className="flex items-center gap-2.5 text-slate-800">
              <span className="text-[12px] font-black tracking-tight">
                {dateInfo.full}
              </span>
              <div className="flex items-center gap-1 px-2 py-0.5 bg-slate-100 rounded-md border border-slate-200 text-[10px] font-black text-slate-500">
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
          {item.description || "Tavsif mavjud emas."}
        </p>

        <div className="space-y-2 mb-6">
          <div className="flex items-center gap-2 text-slate-500 text-[11px] font-bold uppercase">
            <Users size={14} className="text-slate-400" />
            <span className="truncate">
              {item.assigned_groups?.map((g) => g.name).join(", ") ||
                "Guruh biriktirilmagan"}
            </span>
          </div>
          <div className="flex gap-2">
            <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded font-bold">
              {item.quizzes?.length || 0} Quizzes
            </span>
            <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded font-bold">
              {item.mock_tests?.length || 0} Mocks
            </span>
          </div>
        </div>
      </div>

      <Link href={getResultsLink()}>
        <button className="w-full bg-slate-50 hover:bg-blue-600 hover:text-white text-heading font-black py-4 rounded-2xl transition-all flex items-center justify-center gap-2 text-xs uppercase tracking-widest shadow-sm">
          <BarChart3 size={16} />
          Natijalarni ko'rish
        </button>
      </Link>
    </div>
  );
};

export default HomeworkCard;
