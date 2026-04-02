import {
  Edit2,
  Trash2,
  HelpCircle,
  Clock,
  Play,
  BarChart3,
  User,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { authAxios } from "@/utils/axios";
import { useModal } from "@/context/modal-context";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import Link from "next/link";
import { useIntl } from "react-intl";

const QuizCard = ({ item, mutate }) => {
  const { openModal } = useModal();
  const router = useRouter();
  const intl = useIntl();
  const { user } = useSelector((state) => state.auth);

  const isAdmin = user?.role === "CENTER_ADMIN";
  const isTeacher = user?.role === "TEACHER";
  const isCreator = user?.id === item.created_by_id;

  // Edit/Delete huquqi (Admin yoki yaratgan o'qituvchi)
  const canManage = isAdmin || (isTeacher && isCreator);

  const handleDelete = () => {
    openModal(
      "CONFIRM_MODAL",
      {
        title: "Quizni o'chirish",
        body: `Ushbu quizni butunlay o'chirib tashlamoqchimisiz? Bu amalni ortga qaytarib bo'lmaydi.`,
        confirmText: "Ha",
        variant: "danger",
        onConfirm: async () => await authAxios.delete(`quizzes/${item.id}/`),
        mutateKey: [`quizzes/`, router.locale],
      },
      "small",
    );
  };

  return (
    <div className="group bg-white border border-slate-100 p-6 rounded-[2.5rem] shadow-sm hover:shadow-2xl hover:shadow-orange-100/50 transition-all duration-500 flex flex-col h-full relative overflow-hidden">
      {/* Status Badge & Actions */}
      <div className="flex items-center justify-between mb-5">
        <div
          className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${item.is_active
              ? "bg-emerald-50 text-emerald-600"
              : "bg-red-50 text-red-600"
            }`}
        >
          {item.is_active ? (
            <>
              <CheckCircle size={12} /> {intl.formatMessage({ id: "Faol" })}
            </>
          ) : (
            <>
              <XCircle size={12} /> {intl.formatMessage({ id: "Noaktiv" })}
            </>
          )}
        </div>

        {canManage && (
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-all duration-300">
            <button
              onClick={() => openModal("QUIZ_FORM", { quiz: item }, "video")}
              className="p-2 bg-slate-50 text-slate-600 rounded-xl hover:bg-blue-500 hover:text-white transition-all"
            >
              <Edit2 size={14} />
            </button>
            <button
              onClick={handleDelete}
              className="p-2 bg-slate-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all"
            >
              <Trash2 size={14} />
            </button>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1">
        <div className="w-14 h-14 bg-orange-50 text-orange-500 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-500">
          <HelpCircle size={28} strokeWidth={2.5} />
        </div>

        <h3 className="text-lg font-black text-heading line-clamp-2 mb-2 leading-tight group-hover:text-primary transition-colors">
          {item.title}
        </h3>

        <p className="text-muted text-xs line-clamp-2 mb-5 font-medium">
          {item.description || intl.formatMessage({ id: "Tavsif berilmagan" })}
        </p>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="bg-slate-50 p-3 rounded-2xl flex flex-col gap-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
              {intl.formatMessage({ id: "Savollar" })}
            </span>
            <span className="text-sm font-black text-heading">
              {item.questions?.length || 0} {intl.formatMessage({ id: "ta" })}
            </span>
          </div>
          <div className="bg-slate-50 p-3 rounded-2xl flex flex-col gap-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
              {intl.formatMessage({ id: "Vaqt (savol)" })}
            </span>
            <span className="text-sm font-black text-heading">
              {item.default_question_duration} m
            </span>
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-50 mb-5">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-slate-100 rounded-full flex items-center justify-center overflow-hidden">
            {item.created_by?.avatar ? (
              <img
                src={item.created_by.avatar}
                alt="User"
                className="w-full h-full object-cover"
              />
            ) : (
              <User size={12} className="text-slate-400" />
            )}
          </div>
          <span className="text-[10px] font-bold text-slate-500 truncate max-w-[100px]">
            {item.created_by?.full_name || "Admin"}
          </span>
        </div>
        <div className="flex items-center gap-1 text-slate-400">
          <Clock size={12} />
          <span className="text-[10px] font-bold uppercase">
            {new Date(item.created_at).toLocaleDateString()}
          </span>
        </div>
      </div>
    </div>
  );
};

export default QuizCard;
