import Image from "next/image";
import {
  User,
  Mail,
  ShieldCheck,
  ShieldAlert,
  Clock,
  Edit,
  Trash2,
} from "lucide-react";
import { useIntl } from "react-intl";
import { ActionDropdown } from "@/components/ui";
import { DropdownItem } from "@/components/ui/action-dropdown";
import { useSelector } from "react-redux";
import { useModal } from "@/context/modal-context";
import { authAxios } from "@/utils/axios";
import { useRouter } from "next/router";

export const UserCard = ({ item }) => {
  const intl = useIntl();
  const router = useRouter();
  const { openModal } = useModal();
  const { user } = useSelector((state) => state.auth);
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

  const handleDelete = (id) => {
    openModal(
      "CONFIRM_MODAL",
      {
        title: intl.formatMessage({ id: "Foydalanuvchini o'chirish" }),
        body: intl.formatMessage({ id: "Ushbu foydalanuvchini o'chirib tashlamoqchimisiz? Bunda barcha bog'langan ma'lumotlar ham yo'qolishi mumkin." }),
        confirmText: intl.formatMessage({ id: "Ha, o'chirilsin" }),
        variant: "danger",
        mutateKey: ["users/", router.locale],
        onConfirm: async () => {
          return await authAxios.delete(`/users/${id}/`);
        },
      },
      "small",
    );
  };

  return (
    <div className="group relative bg-white border border-slate-100 rounded-[1.25rem] p-4 hover:border-orange-200 hover:shadow-xl hover:shadow-orange-900/5 transition-all duration-300">
      <div className="flex flex-col lg:flex-row lg:items-center gap-4 lg:gap-10">
        {/* 1. Foydalanuvchi Asosiy Profili */}
        <div className="flex items-center gap-4 flex-[1.5] min-w-0">
          <div className="relative shrink-0">
            <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center overflow-hidden shadow-sm">
              {item.avatar ? (
                <img
                  src={item.avatar}
                  alt="Avatar"
                  fill
                  className="object-cover"
                />
              ) : (
                <User size={22} className="text-slate-300" />
              )}
            </div>
            {item.is_approved ? (
              <div className="absolute -top-1 -right-1 bg-emerald-500 text-white rounded-full p-0.5 border-2 border-white shadow-sm">
                <ShieldCheck size={10} />
              </div>
            ) : (
              <div className="absolute -top-1 -right-1 bg-amber-500 text-white rounded-full p-0.5 border-2 border-white shadow-sm">
                <ShieldAlert size={10} />
              </div>
            )}
          </div>

          <div className="flex flex-col truncate">
            <span className="text-sm font-black text-slate-900 truncate tracking-tight">
              {item.first_name} {item.last_name}
            </span>
            <span className="text-[11px] text-slate-500 flex items-center gap-1 font-medium italic">
              <Mail size={10} /> {item.email}
            </span>
          </div>
        </div>

        {/* 2. Markaz va Rol */}
        <div className="flex items-center gap-8 flex-1">
          <div className="flex flex-col">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 opacity-60">
              {intl.formatMessage({ id: "Rol" })}
            </span>
            <span
              className={`text-[11px] font-black tracking-wide px-2.5 py-1 rounded-lg border ${item.role === "OWNER"
                  ? "bg-purple-50 text-purple-600 border-purple-100"
                  : "bg-blue-50 text-blue-600 border-blue-100"
                }`}
            >
              {intl.formatMessage({id:item.role})}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 opacity-60">
              {intl.formatMessage({ id: "Holat" })}
            </span>
            <div
              className={`flex items-center gap-1.5 font-black text-[11px] ${item.is_approved ? "text-emerald-500" : "text-amber-500"}`}
            >
              <div
                className={`w-1.5 h-1.5 rounded-full ${item.is_approved ? "bg-emerald-500" : "bg-amber-500 animate-pulse"}`}
              />
              {intl.formatMessage({ id: item.is_approved ? "Tasdiqlangan" : "Kutilmoqda" })}
            </div>
          </div>
        </div>

        {/* 3. Ro'yxatdan o'tgan vaqti */}
        <div className="flex items-center gap-4 lg:gap-8 flex-1 lg:justify-end border-t lg:border-none pt-3 lg:pt-0 mt-2 lg:mt-0">
          <div className="flex flex-col lg:text-right">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 opacity-60">
              {intl.formatMessage({ id: "Yaratilgan" })}
            </span>
            <div className="flex items-center gap-2.5 text-slate-800">
              <span className="text-[12px] font-black tracking-tight">
                {dateInfo.full}
              </span>
              <div className="flex items-center gap-1 px-2 py-0.5 bg-slate-100 rounded-md border border-slate-200 text-[10px] font-black text-slate-500">
                <Clock size={10} /> {dateInfo.time}
              </div>
            </div>
          </div>

          {/* 4. Dropdown Action */}
          <div className="ml-auto lg:ml-0">
            {user?.role === "CENTER_ADMIN" ? (
              <ActionDropdown>
                <DropdownItem
                  icon={Edit}
                  label={intl.formatMessage({ id: "Tahrirlash" })}
                  onClick={() =>
                    openModal("USER_FORM", { user: item }, "middle")
                  }
                />
                <div className="h-[1px] bg-gray-100 mx-2 my-1" />
                <DropdownItem
                  icon={Trash2}
                  label={intl.formatMessage({ id: "O'chirish" })}
                  variant="danger"
                  onClick={() => handleDelete(item?.id)}
                />
              </ActionDropdown>
            ) : (
              <></>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
