import Image from "next/image";
import {
  Calendar,
  User,
  Copy,
  Clock,
  Hash,
  Mail,
  ArrowRight,
  UserMinus,
  CheckCircle2,
  ShieldCheck,
  Ban,
} from "lucide-react";
import { toast } from "react-toastify";
import { ActionDropdown } from "@/components/ui";
import { DropdownItem } from "@/components/ui/action-dropdown";
import { useModal } from "@/context/modal-context";
import { authAxios } from "@/utils/axios";
import { useRouter } from "next/router";
import { useIntl } from "react-intl";

const InvitationCard = ({ item }) => {
  const user = item.target_user;
  const { openModal } = useModal();
  const router = useRouter();
  const intl = useIntl();

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success("Kod nusxalandi!");
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

  const handleActivate = (code) => {
    openModal(
      "CONFIRM_MODAL",
      {
        title: "Foydalanuvchini qabul qilish",
        body: "Ushbu foydalanuvchini qabul qilmoqchimisiz? Bunda foydalanuvchi tizimga kirish imkoniyati mavjud bo'ladi.",
        confirmText: "Ha",
        variant: "info",
        mutateKey: ["centers/invitations/list/", router.locale],
        onConfirm: async () => {
          return await authAxios.post(`/centers/invitations/approve/`, {
            code,
          });
        },
      },
      "small",
    );
  };

  return (
    <div className="group relative bg-white border border-slate-100 rounded-[1.25rem] p-4 hover:border-orange-200 hover:shadow-xl hover:shadow-orange-900/5 transition-all duration-300">
      <div className="flex flex-col lg:flex-row lg:items-center gap-4 lg:gap-10">
        {/* 1. Foydalanuvchi qismi - Conditional Rendering */}
        <div className="flex items-center gap-4 flex-[1.5] min-w-0">
          <div className="relative shrink-0">
            {user ? (
              <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center overflow-hidden shadow-sm">
                {user.avatar ? (
                  <Image
                    src={user.avatar}
                    alt="User"
                    fill
                    className="object-cover"
                  />
                ) : (
                  <User size={22} className="text-slate-400" />
                )}
              </div>
            ) : (
              <div className="w-12 h-12 rounded-2xl bg-orange-50/50 border border-dashed border-orange-200 flex items-center justify-center shadow-inner">
                <UserMinus size={22} className="text-orange-300" />
              </div>
            )}
            <div
              className={`absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-white shadow-sm ${item.status === "PENDING" ? "bg-amber-400" : "bg-emerald-500"}`}
            />
          </div>

          <div className="flex flex-col truncate">
            {user ? (
              <>
                <span className="text-sm font-black text-slate-900 truncate tracking-tight">
                  {user.first_name} {user.last_name}
                </span>
                <span className="text-[11px] text-slate-500 flex items-center gap-1 font-medium italic">
                  <Mail size={10} /> {user.email}
                </span>
              </>
            ) : (
              <>
                <span className="text-sm font-bold text-slate-400 italic">
                  {intl.formatMessage({ id: "User kutilmoqda..." })}
                </span>
                <span className="text-[10px] text-orange-400 font-bold uppercase tracking-widest mt-0.5">
                  {intl.formatMessage({ id: "Hali ro'yxatdan o'tilmagan" })}
                </span>
              </>
            )}
          </div>
        </div>

        {/* 2. Taklif kodi - Minimalist & Interactive */}
        <div className="flex flex-col flex-1">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 opacity-60">
            {intl.formatMessage({ id: "Taklif kodi" })}
          </span>
          <div
            onClick={() => copyToClipboard(item.code)}
            className="flex items-center gap-2 w-fit px-3.5 py-2 bg-slate-50/80 hover:bg-orange-50 border border-slate-100 hover:border-orange-200 rounded-xl cursor-pointer transition-all active:scale-95 group/code"
          >
            <Hash size={14} className="text-orange-400" />
            <span className="text-sm font-mono font-black text-slate-700 tracking-wider">
              {item.code}
            </span>
            <Copy
              size={13}
              className="text-slate-300 group-hover/code:text-orange-400 transition-colors"
            />
          </div>
        </div>

        {/* 3. Role & Status - Compact & Sharp */}
        <div className="flex items-center gap-8 flex-1">
          <div className="flex flex-col">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 opacity-60">
              {intl.formatMessage({ id: "Rol" })}
            </span>
            <span
              className={`text-[11px] font-black tracking-wide px-2.5 py-1 rounded-lg ${item.role === "TEACHER"
                ? "bg-blue-50 text-blue-600 border border-blue-100"
                : "bg-primary/5 text-primary border border-primary/10"
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
              className={`flex items-center gap-1.5 font-black text-[11px] ${item.status === "PENDING" ? "text-amber-500" : "text-emerald-500"}`}
            >
              {item.status === "PENDING" ? (
                <Clock size={12} className="animate-spin-slow" />
              ) : (
                <CheckCircle2 size={12} />
              )}
              {intl.formatMessage({ id: item.status })}
            </div>
          </div>
        </div>

        {/* 4. Vaqt & Dropdown */}
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

          <div className="ml-auto lg:ml-0">
            {item?.status === "PENDING" && item?.target_user ? (
              <ActionDropdown>
                <DropdownItem
                  icon={ShieldCheck}
                  label="Qabul qilish"
                  onClick={() => handleActivate(item?.code)}
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

export default InvitationCard;
