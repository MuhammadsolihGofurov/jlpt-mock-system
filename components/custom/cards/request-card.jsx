import React from "react";
import {
    Calendar, Phone, MessageSquare, User,
    Building2, MoreVertical, Edit2, Trash2, Clock,
    CheckCircle2, XCircle, PhoneForwarded
} from "lucide-react";
import { motion } from "framer-motion";
import { formatDateTime } from "@/utils/funcs";
import { useModal } from "@/context/modal-context";
import { authAxios } from "@/utils/axios";
import { useRouter } from "next/router";
import { useIntl } from "react-intl";

const RequestCard = ({ item, onEdit, onDelete }) => {
    const router = useRouter();
    const intl = useIntl();
    // Statuslar uchun ranglar va ikonkalarni aniqlaymiz
    const statusConfig = {
        PENDING: {
            color: "bg-amber-50 text-amber-600 border-amber-100",
            icon: <Clock size={14} />,
            label: "Kutilmoqda"
        },
        CONTACTED: {
            color: "bg-blue-50 text-blue-600 border-blue-100",
            icon: <PhoneForwarded size={14} />,
            label: "Bog'lanildi"
        },
        REJECTED: {
            color: "bg-red-50 text-red-600 border-red-100",
            icon: <XCircle size={14} />,
            label: "Rad etildi"
        },
        RESOLVED: {
            color: "bg-green-50 text-green-600 border-green-100",
            icon: <CheckCircle2 size={14} />,
            label: "Hal qilindi"
        }
    };

    const currentStatus = statusConfig[item.status] || statusConfig.PENDING;
    const isIndividual = item.center_name === "Oddiy foydalanuvchi";

    const formatToExactTime = (dateStr) => {
        const date = new Date(dateStr);

        // UTC vaqtini olish (brauzer vaqtiga qaramasdan)
        const hours = String(date.getUTCHours()).padStart(2, '0');
        const minutes = String(date.getUTCMinutes()).padStart(2, '0');
        const day = String(date.getUTCDate()).padStart(2, '0');
        const month = String(date.getUTCMonth() + 1).padStart(2, '0');
        const year = date.getUTCFullYear();

        return `${day}.${month}.${year} | ${hours}:${minutes}`;
    };

    const { openModal } = useModal();


    const handleDelete = () => {
        openModal(
            "CONFIRM_MODAL",
            {
                title: intl.formatMessage({ id: "So'rovni o'chirish" }),
                body: intl.formatMessage({ id: "Ushbu so'rovni butunlay o'chirib tashlamoqchimisiz? Bu amalni ortga qaytarib bo'lmaydi." }),
                confirmText: intl.formatMessage({ id: "Ha" }),
                variant: "danger",
                onConfirm: async () => await authAxios.delete(`owner-contact-requests//${item.id}/`),
                mutateKey: [`owner-contact-requests/`, router.locale],
            },
            "small",
        );
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="group bg-white border border-slate-100 rounded-[2rem] p-8 hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-300 relative overflow-hidden"
        >
            {/* Status Badge */}
            <div className="flex justify-between items-start mb-6">
                <div className={`flex items-center gap-2 px-4 py-1.5 rounded-full border text-[11px] font-bold uppercase tracking-wider ${currentStatus.color}`}>
                    {currentStatus.icon}
                    {currentStatus.label}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                        onClick={() => openModal("CONTACT_FORM", { request: item }, "middle")}
                        className="p-2 hover:bg-slate-50 text-slate-400 hover:text-orange-500 rounded-lg transition-colors"
                    >
                        <Edit2 size={18} />
                    </button>
                    <button
                        onClick={() => handleDelete(item.id)}
                        className="p-2 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-lg transition-colors"
                    >
                        <Trash2 size={18} />
                    </button>
                </div>
            </div>

            {/* Main Info */}
            <div className="space-y-4">
                <div>
                    <div className="flex items-center gap-2 text-slate-400 mb-1">
                        <User size={14} />
                        <span className="text-[10px] font-bold uppercase tracking-widest">{intl.formatMessage({ id: "Foydalanuvchi" })}</span>
                    </div>
                    <h4 className="text-xl font-bold tracking-tight text-slate-900">{item.full_name}</h4>
                </div>

                <div className="flex flex-wrap gap-4">
                    <div className="flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-xl">
                        <Phone size={14} className="text-slate-400" />
                        <span className="text-sm font-semibold text-slate-600">{item.phone_number}</span>
                    </div>

                    <div className="flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-xl">
                        <Calendar size={14} className="text-slate-400" />
                        <span className="text-sm font-semibold text-slate-600">
                            {formatToExactTime(item.created_at)}
                        </span>
                    </div>
                </div>

                {/* Center Name or Individual Badge */}
                <div className="pt-2">
                    {isIndividual ? (
                        <div className="inline-flex items-center gap-2 bg-orange-50 text-orange-600 px-4 py-2 rounded-xl border border-orange-100">
                            <User size={14} />
                            <span className="text-xs font-bold uppercase tracking-wider">{intl.formatMessage({ id: "Oddiy foydalanuvchi" })}</span>
                        </div>
                    ) : (
                        <div className="inline-flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-xl">
                            <Building2 size={14} className="text-orange-500" />
                            <span className="text-xs font-bold uppercase tracking-wider">{item.center_name}</span>
                        </div>
                    )}
                </div>

                {/* Message Section */}
                {item.message && (
                    <div className="mt-6 pt-6 border-t border-slate-50">
                        <div className="flex items-start gap-3">
                            <MessageSquare size={16} className="text-slate-300 mt-1 shrink-0" />
                            <p className="text-sm text-slate-500 leading-relaxed italic">
                                "{item.message}"
                            </p>
                        </div>
                    </div>
                )}
            </div>

            {/* IP Address subtle info */}
            <div className="mt-6 text-[9px] text-slate-300 font-mono tracking-tighter flex justify-between items-center">
                <span>ID: {item.id.split('-')[0]}...</span>
                <span>IP: {item.ip_address}</span>
            </div>
        </motion.div>
    );
};

export default RequestCard;