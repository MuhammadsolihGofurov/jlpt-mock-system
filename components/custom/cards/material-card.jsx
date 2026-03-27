import React from "react";
import {
  FileText,
  FileVideo,
  FileImage,
  FileAudio,
  FileMinus,
  Download,
  MoreVertical,
  Globe,
  Lock,
  User,
  Calendar,
  Trash2,
  Edit2,
  Clock,
} from "lucide-react";
import { useIntl } from "react-intl";
import { useSelector } from "react-redux";
import { useModal } from "@/context/modal-context";
import { authAxios } from "@/utils/axios";

const getFileDetails = (type) => {
  const t = type?.toUpperCase();
  switch (t) {
    case "PDF":
      return {
        icon: <FileText size={28} />,
        color: "text-red-500",
        bg: "bg-red-50",
      };
    case "DOCX":
      return {
        icon: <FileText size={28} />,
        color: "text-blue-600",
        bg: "bg-blue-50",
      };
    case "AUDIO":
      return {
        icon: <FileAudio size={28} />,
        color: "text-purple-500",
        bg: "bg-purple-50",
      };
    case "IMAGE":
      return {
        icon: <FileImage size={28} />,
        color: "text-emerald-500",
        bg: "bg-emerald-50",
      };
    case "VIDEO": // Agar kelajakda qo'shilsa
      return {
        icon: <FileVideo size={28} />,
        color: "text-indigo-500",
        bg: "bg-indigo-50",
      };
    default: // OTHER
      return {
        icon: <FileMinus size={28} />,
        color: "text-slate-500",
        bg: "bg-slate-50",
      };
  }
};
const MaterialCard = ({ item }) => {
  const { icon, color, bg } = getFileDetails(item.file_type);
  const intl = useIntl();
  const { user } = useSelector((state) => state.auth);
  const { openModal } = useModal();

  const handleDownload = (e) => {
    e.stopPropagation();
    window.open(item.file, "_blank");
  };

  const handleDelete = (id) => {
    openModal(
      "CONFIRM_MODAL",
      {
        title: "Material o'chirish",
        body: "Ushbu materialni o'chirib tashlamoqchimisiz? Bunda barcha bog'langan ma'lumotlar ham yo'qolishi mumkin.",
        confirmText: "Ha, o'chirilsin",
        variant: "danger",
        mutateKey: ["materials/"],
        onConfirm: async () => {
          return await authAxios.delete(`/materials/${id}/`);
        },
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

  const dateInfo = formatDate(item.created_at);

  return (
    <div className="group bg-white border border-slate-100 p-5 rounded-[2.25rem] shadow-sm hover:shadow-2xl hover:shadow-orange-100/50 hover:border-orange-100 transition-all duration-500 flex flex-col h-full relative overflow-hidden">
      {/* Hover Decoration */}
      <div
        className={`absolute -top-12 -right-12 w-24 h-24 ${bg} rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
      />

      <div className="relative flex-1">
        {/* Top Actions */}
        <div className="flex justify-between items-start mb-5">
          <div
            className={`p-4 rounded-2xl ${bg} ${color} shadow-sm group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300`}
          >
            {icon}
          </div>

          <div className="flex items-center gap-1.5">
            <div
              className={`px-3 py-1.5 rounded-xl flex items-center gap-1.5 border backdrop-blur-sm ${item.is_public
                ? "bg-green-50/50 border-green-100 text-green-600"
                : "bg-slate-50/50 border-slate-100 text-slate-400"
                }`}
            >
              {item.is_public ? (
                <Globe size={12} strokeWidth={3} />
              ) : (
                <Lock size={12} strokeWidth={3} />
              )}
              <span className="text-[10px] font-black uppercase tracking-tighter">
                {intl.formatMessage({ id: item.is_public ? "Public" : "Private" })}
              </span>
            </div>
          </div>
        </div>

        {/* Title & Metadata */}
        <div className="space-y-3 mb-6">
          <h3 className="text-[17px] font-black text-heading leading-[1.3] group-hover:text-primary transition-colors line-clamp-2 min-h-[44px]">
            {item.name}
          </h3>

          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 overflow-hidden">
              {item.created_by?.avatar ? (
                <img
                  src={item.created_by.avatar}
                  className="w-full h-full object-cover"
                />
              ) : (
                <User size={14} />
              )}
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest leading-none mb-1">
                {intl.formatMessage({ id: "Yuklovchi" })}
              </p>
              <p className="text-xs font-bold text-muted truncate max-w-[150px]">
                {item.created_by?.full_name}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-5 border-t border-slate-50 relative">
        <div className="flex items-center gap-2 text-slate-400">
          <Calendar size={14} />
          <span>
            {item.created_at ? (
              <div className="flex items-center gap-2.5 text-slate-800">
                <span className="text-xs font-semibold tracking-tight">
                  {dateInfo.full} {dateInfo.time}
                </span>
              </div>
            ) : (
              intl.formatMessage({ id: "Vaqt belgilanmagan" })
            )}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {(user?.role === "CENTER_ADMIN" ||
            (user?.role === "TEACHER" && user?.id == item?.created_by?.id)) && (
              <div className="flex items-center">
                <button
                  onClick={() =>
                    openModal("MATERIAL_FORM", { material: item }, "middle")
                  }
                  className="p-2 text-emerald-500 hover:bg-emerald-50 rounded-xl transition-all duration-200 active:scale-90 group/edit"
                  title="Tahrirlash"
                >
                  <Edit2
                    size={16}
                    className="group-hover/edit:rotate-12 transition-transform"
                  />
                </button>

                {/* Delete Button */}
                <button
                  onClick={() => handleDelete(item?.id)}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition-all duration-200 active:scale-90 group/del"
                  title="O'chirish"
                >
                  <Trash2
                    size={16}
                    className="group-hover/del:shake transition-transform"
                  />
                </button>
              </div>
            )}
          <button
            onClick={handleDownload}
            className="relative overflow-hidden group/btn bg-slate-900 hover:bg-primary text-white p-3.5 rounded-[1.25rem] shadow-lg shadow-slate-200 hover:shadow-orange-200 transition-all duration-300 active:scale-90"
          >
            <Download size={18} className="relative z-10" />
            <div className="absolute inset-0 bg-gradient-to-tr from-orange-400 to-orange-600 opacity-0 group-hover/btn:opacity-100 transition-opacity" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default MaterialCard;
