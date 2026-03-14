import React from "react";
import {
  Users,
  UserCheck,
  Calendar,
  MoreVertical,
  BookOpen,
  Trash2,
  Edit2,
  Users2,
} from "lucide-react";
import { useIntl } from "react-intl";
import { ActionDropdown } from "@/components/ui";
import { DropdownItem } from "@/components/ui/action-dropdown";
import { useModal } from "@/context/modal-context";
import { authAxios } from "@/utils/axios";

const GroupCard = ({ item }) => {
  const intl = useIntl();
  const { openModal } = useModal();

  const handleDelete = (id) => {
    openModal(
      "CONFIRM_MODAL",
      {
        title: "Guruhni o'chirish",
        body: "Ushbu guruhni o'chirib tashlamoqchimisiz? Bunda barcha bog'langan ma'lumotlar ham yo'qolishi mumkin.",
        confirmText: "Ha, o'chirilsin",
        variant: "danger",
        mutateKey: ["groups/"],
        onConfirm: async () => {
          return await authAxios.delete(`groups/${id}/`);
        },
      },
      "small",
    );
  };

  return (
    <div className="group bg-white/70 backdrop-blur-md border border-slate-100 p-6 rounded-[2.5rem] shadow-sm hover:shadow-xl hover:shadow-orange-100/50 hover:border-orange-100 transition-all duration-300 relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-orange-50/50 rounded-full blur-3xl group-hover:bg-orange-100/50 transition-colors" />

      <div className="flex justify-between items-start mb-6 relative">
        <div className="flex gap-4">
          <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white shadow-lg shadow-orange-200">
            {item?.avatar ? (
              <img
                src={item.avatar}
                alt={item.name}
                className="w-full h-full object-cover rounded-3xl"
              />
            ) : (
              <BookOpen size={28} strokeWidth={2.5} />
            )}
          </div>
          <div>
            <h3 className="text-xl font-black text-heading leading-tight group-hover:text-primary transition-colors">
              {item.name}
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <span
                className={`w-2 h-2 rounded-full ${item.is_active ? "bg-green-500 animate-pulse" : "bg-slate-300"}`}
              />
              <span className="text-[10px] font-bold uppercase tracking-widest text-muted">
                {intl.formatMessage({
                  id: item.is_active ? "Faol" : "Faol emas",
                })}
              </span>
            </div>
          </div>
        </div>

        <ActionDropdown>
          <DropdownItem
            icon={Users2}
            label="A'zolar"
            variant="blue"
            onClick={() =>
              openModal("GROUP_MEMBERS", { group: item }, "middle")
            }
          />
          <DropdownItem
            icon={Edit2}
            label="Tahrirlash"
            variant="blue"
            onClick={() => openModal("GROUP_FORM", { group: item }, "middle")}
          />
          <div className="h-[1px] bg-gray-100 mx-2 my-1" />
          <DropdownItem
            icon={Trash2}
            label="O'chirish"
            variant="danger"
            onClick={() => handleDelete(item?.id)}
          />
        </ActionDropdown>
      </div>

      <p className="text-muted text-sm font-medium line-clamp-2 mb-6 min-h-[40px]">
        {item.description ||
          intl.formatMessage({ id: "Guruh uchun tavsif yozilmagan." })}
      </p>

      {/* Teachers Section */}
      <div className="flex items-center -space-x-3 mb-6">
        {item.teachers?.map((t, idx) => (
          <div
            key={idx}
            className="w-10 h-10 rounded-2xl border-2 border-white bg-slate-100 flex items-center justify-center text-[10px] font-bold text-heading overflow-hidden shadow-sm"
            title={`${t.first_name} ${t.last_name}`}
          >
            {t.first_name?.charAt(0)}
            {t.last_name?.charAt(0)}
          </div>
        ))}
        {item.teachers?.length > 0 && (
          <span className="pl-5 text-[11px] font-bold text-muted uppercase tracking-tighter">
            {item.teachers?.length} ta o'qituvchi
          </span>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3 pt-5 border-t border-slate-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400">
            <Users size={18} />
          </div>
          <div>
            <p className="text-[10px] font-bold text-muted uppercase tracking-wider">
              {intl.formatMessage({ id: "O'quvchilar" })}
            </p>
            <p className="text-sm font-black text-heading">
              {item.student_count} ta
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400">
            <Calendar size={18} />
          </div>
          <div>
            <p className="text-[10px] font-bold text-muted uppercase tracking-wider">
              {intl.formatMessage({ id: "Yaratilgan" })}
            </p>
            <p className="text-sm font-black text-heading">
              {new Date(item.created_at).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GroupCard;
