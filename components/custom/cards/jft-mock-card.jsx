import {
    Edit2,
    Trash2,
    Send,
    RotateCcw,
    Award,
    Layers,
    Copy,
    ExternalLink,
} from "lucide-react";
import { authAxios } from "@/utils/axios";
import { useModal } from "@/context/modal-context";
import { useRouter } from "next/router";
import Link from "next/link";
import { useIntl } from "react-intl";
import { useSelector } from "react-redux";

const JftCard = ({ item }) => {
    const { openModal } = useModal();
    const intl = useIntl();
    const router = useRouter();
    const isPublished = item.status === "PUBLISHED";
    const { user } = useSelector(state => state.auth);

    // 1. Publish / Unpublish
    const handleTogglePublish = () => {
        openModal(
            "CONFIRM_MODAL",
            {
                title: isPublished ? "Nashrdan olish" : "Nashr qilish",
                body: isPublished
                    ? "Ushbu mock testni nashrdan olmoqchimisiz? Bunda u o'quvchilarga ko'rinmaydi."
                    : "Ushbu mock testni nashr qilmoqchimisiz? Bunda u barcha o'quvchilar uchun ochiq bo'ladi.",
                confirmText: isPublished ? "Ha, nashrdan olinsin" : "Ha, nashr etilsin",
                variant: isPublished ? "warning" : "primary",
                mutateKey: [`jft-mock-tests/`, router.locale],
                onConfirm: async () => {
                    //   const action = isPublished ? "unpublish" : "publish";
                    return await authAxios.post(`/jft-mock-tests/${item.id}/publish/`);
                },
            },
            "small",
        );
    };

    // 2. Clone (Nusxa ko'chirish)
    const handleClone = () => {
        openModal(
            "CONFIRM_MODAL",
            {
                title: "Mockdan nusxa olish",
                body: `"${item.title}" testidan nusxa ko'chirmoqchimisiz? Bunda barcha savollar yangi testga ko'chiriladi.`,
                confirmText: "Ha, nusxa olinsin",
                variant: "primary",
                mutateKey: [`jft-mock-tests/`, router.locale],
                onConfirm: async () => {
                    return await authAxios.post(`/jft-mock-tests/${item.id}/clone/`);
                },
            },
            "small",
        );
    };

    // 3. Delete
    const handleDelete = () => {
        openModal(
            "CONFIRM_MODAL",
            {
                title: "Mockni o'chirish",
                body: "Ushbu mock testni o'chirib tashlamoqchimisiz? Bunda barcha bog'langan savollar va natijalar ham yo'qolishi mumkin.",
                confirmText: "Ha, o'chirilsin",
                variant: "danger",
                mutateKey: [`jft-mock-tests/`, router.locale],
                onConfirm: async () => {
                    return await authAxios.delete(`/jft-mock-tests/${item.id}/`);
                },
            },
            "small",
        );
    };

    const makedHref = `/dashboard/mock-tests/jft/${item.id}`;

    const isCreator = user?.id === item?.created_by_id;

    return (
        <div className="group bg-white border border-slate-100 p-5 rounded-[2.25rem] shadow-sm hover:shadow-2xl hover:shadow-orange-100/50 transition-all duration-500 flex flex-col h-full relative overflow-hidden text-left">
            {/* Top Floating Actions */}
            <div className="absolute top-4 right-4 flex gap-2 z-10 opacity-0 group-hover:opacity-100 transition-all transform translate-y-[-10px] group-hover:translate-y-0">
                <button
                    onClick={handleClone}
                    title="Nusxa olish"
                    className="p-2 bg-white/90 backdrop-blur-md text-blue-500 rounded-xl border border-slate-100 shadow-sm hover:bg-blue-50 transition-all"
                >
                    <Copy size={16} />
                </button>

                {!isPublished && isCreator && (
                    <>
                        <button
                            onClick={() => openModal("JFT_MOCK_FORM", { mock: item }, "middle")}
                            className="p-2 bg-white/90 backdrop-blur-md text-emerald-500 rounded-xl border border-slate-100 shadow-sm hover:bg-emerald-50 transition-all"
                        >
                            <Edit2 size={16} />
                        </button>
                        <button
                            onClick={handleDelete}
                            className="p-2 bg-white/90 backdrop-blur-md text-red-500 rounded-xl border border-slate-100 shadow-sm hover:bg-red-50 transition-all"
                        >
                            <Trash2 size={16} />
                        </button>
                    </>
                )}
            </div>

            {/* Main Content */}
            <div className="mb-4">
                <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110 duration-300 ${isPublished
                        ? "bg-green-50 text-green-600"
                        : "bg-orange-50 text-orange-600"
                        }`}
                >
                    <Layers size={24} />
                </div>

                <Link href={makedHref}>
                    <h3 className="text-lg font-black text-heading line-clamp-2 min-h-[56px] leading-tight hover:text-primary transition-colors cursor-pointer">
                        {item.title}
                    </h3>
                </Link>
            </div>

            <div className="space-y-3 flex-1">
                <div className="flex items-center gap-2 text-slate-500 font-bold text-xs uppercase tracking-wider">
                    <Award size={14} className="text-orange-400" />
                    <span>{item.level} {intl.formatMessage({ id: "Level" })}</span>
                    <span className="mx-1">•</span>
                    <span>{item.total_score} {intl.formatMessage({ id: "Ball" })}</span>
                </div>

                <p className="text-muted text-sm line-clamp-2">
                    {item.description || intl.formatMessage({ id: "Tavsif berilmagan" })}
                </p>
            </div>

            {/* Footer Actions */}
            <div
                className={`mt-6 pt-5 border-t border-slate-50 flex items-center ${!isPublished && isCreator ? "justify-between" : "justify-end"}`}
            >
                {!isPublished && isCreator && (
                    <Link href={makedHref}>
                        <button className="flex items-center gap-2 text-[11px] font-black text-primary hover:gap-3 transition-all uppercase tracking-widest">
                            {intl.formatMessage({ id: "Savollar" })}{" "}
                            <ExternalLink size={14} />
                        </button>
                    </Link>
                )}
                <div className="flex items-center gap-3">
                    <div
                        className={`px-3 py-1 rounded-lg text-[9px] font-black tracking-widest uppercase ${isPublished
                            ? "bg-green-100 text-green-600"
                            : "bg-slate-100 text-slate-500"
                            }`}
                    >
                        {intl.formatMessage({ id: item.status })}
                    </div>

                    <button
                        onClick={handleTogglePublish}
                        title={isPublished ? "Nashrdan olish" : "Nashr qilish"}
                        className={`p-3 rounded-2xl transition-all active:scale-90 ${isPublished
                            ? "bg-slate-900 text-white hover:bg-slate-800"
                            : "bg-primary text-white hover:bg-primary-dark shadow-lg shadow-orange-100"
                            }`}
                    >
                        {isPublished ? <RotateCcw size={18} /> : <Send size={18} />}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default JftCard;
