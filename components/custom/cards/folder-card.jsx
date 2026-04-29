import React from "react";
import { useIntl } from "react-intl";
import { Edit3, Trash2 } from "lucide-react";
import Link from "next/link";
import { useModal } from "@/context/modal-context";
import { useRouter } from "next/router";
import { authAxios } from "@/utils/axios";
import { useSelector } from "react-redux";

const FolderCard = ({ item }) => {
    const intl = useIntl();
    const { openModal } = useModal();
    const router = useRouter();
    const { user } = useSelector(state => state.auth);

    const handleDelete = () => {
        openModal(
            "CONFIRM_MODAL",
            {
                title: intl.formatMessage({ id: "Jildni o'chirish" }),
                body: intl.formatMessage({ id: "Ushbu jildni o'chirib tashlamoqchimisiz?" }),
                confirmText: intl.formatMessage({ id: "Ha, o'chirilsin" }),
                variant: "danger",
                onConfirm: async () => {
                    return await authAxios.delete(`material-categories/${item.id}/`);
                },
                mutateKey: [`material-categories/`, router.locale],
            },
            "small",
        );
    }

    return (
        <div className="group relative cursor-pointer">
            <Link href={`/dashboard/materials/files?category=${item?.id}`} className="flex flex-col items-center justify-center gap-2 p-4 rounded-[24px] transition-all duration-300 hover:bg-white/60 hover:shadow-[0_20px_40px_-15px_rgba(245,166,35,0.15)] border border-transparent hover:border-orange-100">

                <div className="relative w-20 h-16 transition-transform duration-300 group-hover:scale-110">
                    {/* Orqa fon rangi - #F5A623 (Tailwindda bu rangga yaqin orange-500 ishlatildi) */}
                    <div className="absolute inset-0 bg-[#F5A623] rounded-lg shadow-inner overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/30 to-transparent" />
                    </div>

                    {/* Oldi qatlam - biroz ochroq variant */}
                    <div className="absolute bottom-0 left-0 w-full h-[85%] bg-[#ffb84d] rounded-lg shadow-md border-t border-white/40 transition-all duration-300 group-hover:h-[75%]" />

                    {/* Papka qulog'i */}
                    <div className="absolute -top-1.5 left-0 w-8 h-4 bg-[#F5A623] rounded-t-md" />

                    {/* Ichidagi qog'oz */}
                    <div className="absolute top-2 left-1/2 -translate-x-1/2 w-[70%] h-8 bg-white/90 rounded-sm transition-all duration-300 opacity-0 -translate-y-2 group-hover:opacity-100 group-hover:-translate-y-4 shadow-sm" />
                </div>

                <div className="text-center mt-1">
                    <h3 className="text-sm font-semibold text-slate-700 truncate max-w-[160px]">
                        {item.name}
                    </h3>
                    <p className="text-[11px] text-slate-400 font-medium">
                        {item.count || 0} {intl.formatMessage({ id: "materiallar" })}
                    </p>
                </div>
            </Link>

            {/* Pulse indikatori ham asosiy rangda */}
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="w-2 h-2 bg-[#F5A623] rounded-full animate-pulse" />
            </div>

            {
                (user?.role === "CENTER_ADMIN" ||
                    (user?.role === "TEACHER" && user?.id == item?.created_by?.id)) &&
                <div className="top-3 right-3 flex w-full items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0 z-10 pt-2">
                    <button
                        onClick={() => { openModal("CATEGORY_MODAL", { category: item }, "middle") }}
                        className="p-1.5 bg-white shadow-sm border border-slate-100 text-[#F5A623] rounded-lg hover:bg-[#F5A623] hover:text-white transition-colors"
                    >
                        <Edit3 size={14} />
                    </button>
                    <button
                        onClick={() => handleDelete()}
                        className="p-1.5 bg-white shadow-sm border border-slate-100 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-colors"
                    >
                        <Trash2 size={14} />
                    </button>
                </div>
            }
        </div>
    );
};

export default FolderCard;