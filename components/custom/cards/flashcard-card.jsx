import React from "react";
import { Layers, Edit2, Trash2, BookOpen, Brain, Globe, Download } from "lucide-react";
import { motion } from "framer-motion";
import { ActionDropdown } from "@/components/ui";
import { useRouter } from "next/router";
import { useModal } from "@/context/modal-context";
import { authAxios } from "@/utils/axios";
import { DropdownItem } from "@/components/ui/action-dropdown";
import { formatDate, formatDateTime } from "@/utils/funcs";
import { useIntl } from "react-intl";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { generateFlashcardDocx, generateFlashcardPdf } from "@/utils/flashcard-import-export";
import { handleApiError } from "@/utils/handle-error";

const FlashcardDeckCard = ({ deck }) => {
    const router = useRouter();
    const { openModal } = useModal();
    const intl = useIntl();
    const { user } = useSelector(state => state.auth);
    const userRole = user?.role;

    const handleDelete = (id) => {
        openModal(
            "CONFIRM_MODAL",
            {
                title: "Flash kart o'chirish",
                body: "Ushbu flash kartni o'chirib tashlamoqchimisiz? Bunda barcha bog'langan ma'lumotlar ham yo'qolishi mumkin.",
                confirmText: "Ha, o'chirilsin",
                variant: "danger",
                mutateKey: [`flashcard-sets/`, router.locale],
                onConfirm: async () => {
                    return await authAxios.delete(`/flashcard-sets/${id}/`);
                },
            },
            "small",
        );
    }

    const handleDownload = async (id, title) => {
        const toastId = toast.loading("Fayl tayyorlanmoqda, iltimos kuting...");

        try {
            // 2. API dan ma'lumotlarni olish
            // Eslatma: setId o'rniga siz ko'rsatgan UUID ishlatildi
            const response = await authAxios.get(
                `/flashcard-sets/${id}/study/?mode=SEQUENTIAL`
            );

            const cards = response.data?.cards;

            if (!cards || cards.length === 0) {
                toast.update(toastId, {
                    render: "Kardlar topilmadi!",
                    type: "error",
                    isLoading: false,
                    autoClose: 3000,
                });
                return;
            }

            await generateFlashcardPdf(cards, title);

            toast.update(toastId, {
                render: "Fayl muvaffaqiyatli yuklab olindi! 🎉",
                type: "success",
                isLoading: false,
                autoClose: 3000,
            });

        } catch (err) {
            handleApiError(err);

            toast.update(toastId, {
                render: err || "Faylni yuklashda xatolik yuz berdi.",
                type: "error",
                isLoading: false,
                autoClose: 3000,
            });

        }
    };

    const handlePractice = () => {
        openModal("PRACTICE_MODAL", { id: deck?.id }, "middle");
    }

    // Markazlar ro'yxatini shakllantirish
    const centers = deck.visible_centers || [];
    const hasCenters = centers.length > 0;
    const allCentersNames = centers.map(c => c.name).join(", ");

    // Guruh ro'yxatini shakllantirish
    const groups = deck.assigned_groups || [];
    const hasGroups = groups.length > 0;
    const allGroupsNames = groups.map(g => g.name).join(", ");

    // owner
    const isOwner = deck.owner_user_id === user?.id;

    return (
        <motion.div
            whileHover={{ y: -5 }}
            className="group relative bg-white border border-slate-100 rounded-[2.5rem] p-6 shadow-sm hover:shadow-2xl hover:shadow-orange-500/10 transition-all cursor-pointer flex flex-col h-full"
            onClick={() => router.push(`/dashboard/flashcards/study/${deck.id}`)}
        >
            {/* 1. Header & Actions */}
            <div className="flex justify-between items-start mb-4" onClick={e => e.stopPropagation()}>
                <div className="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center text-orange-500 group-hover:bg-orange-500 group-hover:text-white transition-all duration-300">
                    <Layers size={24} />
                </div>
                <ActionDropdown>
                    <DropdownItem
                        icon={Download}
                        label="Yuklab olish"
                        variant="blue"
                        onClick={() => handleDownload(deck.id, deck.title)}
                    />
                    {isOwner && (
                        <>
                            <DropdownItem
                                icon={Edit2}
                                label="Tahrirlash"
                                variant="blue"
                                onClick={() => router.push(`/dashboard/flashcards/edit/${deck.id}`)}
                            />
                            <div className="h-[1px] bg-gray-100 mx-2 my-1" />
                            <DropdownItem
                                icon={Trash2}
                                label="O'chirish"
                                variant="danger"
                                onClick={() => handleDelete(deck?.id)}
                            />
                        </>
                    )}
                </ActionDropdown>
            </div>

            {/* 2. Content */}
            <div className="flex-grow space-y-2 mb-6">
                <h3 className="text-xl font-black text-slate-800 group-hover:text-orange-600 transition-colors line-clamp-1">
                    {deck.title}
                </h3>
                <p className="text-sm text-slate-500 line-clamp-2 leading-relaxed min-h-[40px]">
                    {deck.description || intl.formatMessage({ id: "Tavsif berilmagan" })}
                </p>

                <div className="flex flex-wrap items-center gap-2 pt-2">
                    {/* Kartalar soni */}
                    <span className="px-3 py-1 bg-slate-100 rounded-full text-[10px] font-black text-slate-500 uppercase tracking-widest">
                        {deck.cards_count} {intl.formatMessage({ id: deck.cards_count === 1 ? "kart" : "kartlar" })}
                    </span>

                    {/* Markazlar Nomlari bilan */}
                    {hasCenters && (userRole === "OWNER") && (
                        <>
                            <span className="text-[10px] text-slate-300 font-bold">•</span>
                            <div
                                title={allCentersNames}
                                className="flex items-center gap-1.5 px-3 py-1 bg-blue-50 rounded-full text-[10px] font-black text-blue-600 uppercase tracking-widest border border-blue-100"
                            >
                                <Globe size={10} className="shrink-0" />
                                <span className="max-w-[150px] truncate">
                                    {centers[0].name}
                                    {centers.length > 1 && ` +${centers.length - 1}`}
                                </span>
                            </div>
                        </>
                    )}

                    {/* Guruhlar Nomlari bilan */}
                    {hasGroups && (userRole === "CENTER_ADMIN" || userRole === "TEACHER") && (
                        <>
                            <span className="text-[10px] text-slate-300 font-bold">•</span>
                            <div
                                title={allGroupsNames}
                                className="flex items-center gap-1.5 px-3 py-1 bg-green-50 rounded-full text-[10px] font-black text-green-600 uppercase tracking-widest border border-green-100"
                            >
                                <Globe size={10} className="shrink-0" />
                                <span className="max-w-[150px] truncate">
                                    {groups[0].name}
                                    {groups.length > 1 && ` +${groups.length - 1}`}
                                </span>
                            </div>
                        </>
                    )}

                    <span className="text-[10px] text-slate-300 font-bold">•</span>
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                        {formatDate(deck.created_at)?.full} {formatDate(deck.created_at)?.time}
                    </span>
                </div>
            </div>

            {/* 3. Action Buttons Section */}
            <div className="grid grid-cols-2 gap-3 pt-5 border-t border-slate-50" onClick={e => e.stopPropagation()}>
                <button
                    onClick={() => router.push(`/dashboard/flashcards/study/${deck.id}`)}
                    className="flex items-center justify-center gap-2 py-3 bg-orange-50 text-orange-600 rounded-2xl font-bold text-xs hover:bg-orange-500 hover:text-white transition-all active:scale-95"
                >
                    <BookOpen size={16} /> {intl.formatMessage({ id: "Yodlash" })}
                </button>

                <button
                    onClick={handlePractice}
                    className="flex items-center justify-center gap-2 py-3 bg-[#1e293b] text-white rounded-2xl font-bold text-xs hover:bg-black transition-all active:scale-95 shadow-lg shadow-slate-100"
                >
                    <Brain size={16} /> {intl.formatMessage({ id: "Mashq" })}
                </button>
            </div>
        </motion.div>
    );
};

export default FlashcardDeckCard;