import {
  Edit2,
  Trash2,
  Calendar,
  Users,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  BarChart3,
  ExternalLink,
  MoreVertical,
  Clock,
} from "lucide-react";
import { authAxios } from "@/utils/axios";
import { useModal } from "@/context/modal-context";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import Link from "next/link";

const ExamCard = ({ item, mutate }) => {
  const { openModal } = useModal();
  const router = useRouter();
  const { user } = useSelector((state) => state.auth);

  const isOwner = user?.role === "OWNER";
  const isAdmin = user?.role === "CENTER_ADMIN";
  const isTeacher = user?.role === "TEACHER";
  const isStudent = user?.role === "STUDENT";
  const isCreator = user?.id === item.created_by_id;

  // Faqat Owner, Admin yoki o'sha imtihonni yaratgan Teacher tahrirlay oladi
  const canManage = isOwner || isAdmin || (isTeacher && isCreator);

  const isOpen = item.status === "OPEN";
  const isPublished = item.is_published;

  // 1. Status o'zgartirish (OPEN / CLOSED)
  const handleToggleStatus = () => {
    const newStatus = isOpen ? "CLOSED" : "OPEN";
    openModal(
      "CONFIRM_MODAL",
      {
        title: isOpen ? "Imtihonni yopish" : "Imtihonni ochish",
        body: isOpen
          ? "Imtihonni yopsangiz, o'quvchilar testni boshlay olmaydilar."
          : "Imtihonni ochsangiz, belgilangan guruh o'quvchilari testni topshirishlari mumkin bo'ladi.",
        confirmText: isOpen ? "Ha, yopilsin" : "Ha, ochilsin",
        variant: isOpen ? "danger" : "primary",
        onConfirm: async () => {
          return await authAxios.patch(`/exams/${item.id}/`, {
            status: newStatus,
          });
        },
        mutateKey: [`exams/`, router.locale],
      },
      "small",
    );
  };

  // 2. Publish / Unpublish (Natijalar uchun)
  const handleTogglePublish = () => {
    openModal(
      "CONFIRM_MODAL",
      {
        title: isPublished
          ? "Natijalarni yashirish"
          : "Natijalarni e'lon qilish",
        body: isPublished
          ? "Natijalarni yashirsangiz, o'quvchilar o'z ballarini ko'ra olmaydilar."
          : "Natijalarni e'lon qilsangiz, barcha topshirgan o'quvchilarga natijalar ko'rinadi.",
        confirmText: isPublished ? "Ha, yashirilsin" : "Ha, e'lon qilinsin",
        variant: isPublished ? "warning" : "primary",
        onConfirm: async () => {
          return await authAxios.patch(`/exams/${item.id}/`, {
            is_published: !isPublished,
          });
        },
        mutateKey: [`exams/`, router.locale],
      },
      "small",
    );
  };

  // 3. Delete
  const handleDelete = () => {
    openModal(
      "CONFIRM_MODAL",
      {
        title: "Imtihonni o'chirish",
        body: "Ushbu imtihonni o'chirib tashlamoqchimisiz? Bunda barcha topshirilgan natijalar ham o'chib ketadi.",
        confirmText: "Ha, o'chirilsin",
        variant: "danger",
        onConfirm: async () => {
          return await authAxios.delete(`/exams/${item.id}/`);
        },
        mutateKey: [`exams/`, router.locale],
      },
      "small",
    );
  };

  // Natijalar linkini rolga qarab aniqlash
  const getResultsLink = () => {
    if (isStudent) {
      return `/dashboard/results/my-results?exam_id=${item.id}`; // Student uchun
    }
    return `/dashboard/results/exam-results/${item.id}`; // Admin/Teacher uchun
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

  const dateInfo = formatDate(item.estimated_start_time);

  return (
    <div className="group bg-white border border-slate-100 p-6 rounded-[2.5rem] shadow-sm hover:shadow-2xl hover:shadow-orange-100/50 transition-all duration-500 flex flex-col h-full relative overflow-hidden">
      {/* Badge: Status */}
      <div className="flex justify-between items-start mb-6">
        <div
          className={`px-4 py-1.5 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 ${
            isOpen ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"
          }`}
        >
          <div
            className={`w-1.5 h-1.5 rounded-full animate-pulse ${isOpen ? "bg-emerald-600" : "bg-red-600"}`}
          />
          {isOpen ? "Ochiq" : "Yopiq"}
        </div>

        {canManage && (
          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
            <button
              onClick={() => openModal("EXAM_FORM", { exam: item }, "middle")}
              className="p-2.5 bg-slate-50 text-slate-600 rounded-xl hover:bg-primary hover:text-white transition-all"
            >
              <Edit2 size={16} />
            </button>
            <button
              onClick={handleDelete}
              className="p-2.5 bg-slate-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all"
            >
              <Trash2 size={16} />
            </button>
          </div>
        )}
      </div>

      {/* Title & Info */}
      <div className="flex-1">
        <h3 className="text-xl font-black text-heading line-clamp-2 leading-tight mb-4 group-hover:text-primary transition-colors">
          {item.title}
        </h3>

        <div className="space-y-3 mb-6">
          <div className="flex items-center gap-3 text-slate-500 font-bold text-xs uppercase tracking-tight">
            <Calendar size={16} className="text-orange-400" />
            <span>
              {item.estimated_start_time ? (
                <div className="flex items-center gap-2.5 text-slate-800">
                  <span className="text-[12px] font-black tracking-tight">
                    {dateInfo.full}
                  </span>
                  <div className="flex items-center gap-1 px-2 py-0.5 bg-slate-100 rounded-md border border-slate-200 text-[10px] font-black text-slate-500">
                    <Clock size={10} /> {dateInfo.time}
                  </div>
                </div>
              ) : (
                "Vaqt belgilanmagan"
              )}
            </span>
          </div>

          <div className="flex items-center gap-3 text-slate-500 font-bold text-xs uppercase tracking-tight">
            <Users size={16} className="text-blue-400" />
            <div className="flex flex-wrap gap-1">
              {item.assigned_groups?.map((g) => (
                <span
                  key={g.id}
                  className="bg-slate-100 px-2 py-0.5 rounded-md"
                >
                  {g.name}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Control Actions (Admin & Teacher) */}
      {canManage && (
        <div className="grid grid-cols-2 gap-2 mb-4">
          <button
            onClick={handleToggleStatus}
            className={`flex items-center justify-center gap-2 py-3 rounded-2xl text-[11px] font-black uppercase tracking-tighter transition-all ${
              isOpen
                ? "bg-red-50 text-red-600 hover:bg-red-100"
                : "bg-emerald-50 text-emerald-600 hover:bg-emerald-100"
            }`}
          >
            {isOpen ? <Lock size={14} /> : <Unlock size={14} />}
            {isOpen ? "Yopish" : "Ochish"}
          </button>

          <button
            onClick={handleTogglePublish}
            className={`flex items-center justify-center gap-2 py-3 rounded-2xl text-[11px] font-black uppercase tracking-tighter transition-all ${
              isPublished
                ? "bg-slate-900 text-white"
                : "bg-orange-50 text-orange-600 hover:bg-orange-100"
            }`}
          >
            {isPublished ? <EyeOff size={14} /> : <Eye size={14} />}
            {isPublished ? "Yashirish" : "E'lon qilish"}
          </button>
        </div>
      )}

      {/* Main Action Button */}
      <Link href={getResultsLink()}>
        <button className="w-full bg-slate-50 hover:bg-primary hover:text-white text-heading font-black py-4 rounded-[1.5rem] transition-all flex items-center justify-center gap-2 text-sm shadow-sm group-active:scale-95">
          <BarChart3 size={18} />
          Natijalarni ko'rish
        </button>
      </Link>
    </div>
  );
};

export default ExamCard;
