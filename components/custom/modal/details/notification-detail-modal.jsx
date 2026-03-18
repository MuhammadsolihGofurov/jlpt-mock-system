import { Bell, ExternalLink, Calendar, CheckCircle2 } from "lucide-react";
import { useModal } from "@/context/modal-context";
import { useIntl } from "react-intl";
import { getNotificationConfig } from "@/components/config/notification-config";
import { formatDateTime } from "@/utils/funcs";
import Link from "next/link";

const NotificationDetailModal = ({ data }) => {
  const { closeModal } = useModal();
  const intl = useIntl();
  const config = getNotificationConfig(data.notification_type);
  const Icon = config.icon;

  return (
    <div className="p-8">
      {/* Header Section */}
      <div className="flex items-center gap-5 mb-8">
        <div className={`${config.bg} ${config.color} p-5 rounded-[2rem] shadow-sm`}>
          <Icon size={32} />
        </div>
        <div>
          <h2 className="text-lg sm:text-2xl font-black text-slate-900 leading-none mb-2">
            {intl.formatMessage({ id: "Bildirishnoma tafsiloti" })}
          </h2>
          <div className="flex items-center gap-3">
            <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${config.bg} ${config.color}`}>
              {data.notification_type.replace(/_/g, " ")}
            </span>
          </div>
        </div>
      </div>

      {/* Message Content */}
      <div className="bg-slate-50 p-6 rounded-[2.5rem] border border-slate-100 mb-8">
        <p className="text-slate-700 text-base sm:text-lg font-bold leading-relaxed">
          {data.message}
        </p>
      </div>

      {/* Meta Info */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
        <div className="flex items-center gap-3 px-5 py-4 bg-white border border-slate-100 rounded-2xl">
          <Calendar size={18} className="text-slate-400" />
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase leading-none mb-1">{intl.formatMessage({ id: "Yuborilgan vaqt" })}</p>
            <p className="text-sm font-bold text-slate-700">{formatDateTime(data.created_at, intl.locale)}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 px-5 py-4 bg-white border border-slate-100 rounded-2xl">
          <CheckCircle2 size={18} className="text-emerald-500" />
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase leading-none mb-1">{intl.formatMessage({ id: "Holat" })}</p>
            <p className="text-sm font-bold text-emerald-600">{intl.formatMessage({ id: "O'qildi" })}</p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3 pt-6 border-t border-slate-100">
        <button
          onClick={() => closeModal("NOTIFY_MODAL")}
          className="px-8 py-4 rounded-2xl font-black text-slate-500 hover:bg-slate-100 transition-all"
        >
          {intl.formatMessage({ id: "Yopish" })}
        </button>

        {/* {data.link && (
          <Link
            href={data.link}
            onClick={() => closeModal("NOTIFY_MODAL")}
            className="bg-slate-900 text-white font-black px-8 py-4 rounded-2xl shadow-xl shadow-slate-200 transition-all active:scale-95 flex items-center gap-2"
          >
            <ExternalLink size={18} />
            {intl.formatMessage({ id: "Havolaga o'tish" })}
          </Link>
        )} */}
      </div>
    </div>
  );
};

export default NotificationDetailModal;