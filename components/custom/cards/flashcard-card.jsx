import React from "react";
import { Layers, ChevronRight, Edit2, Trash2, BookOpen, Brain } from "lucide-react";
import { motion } from "framer-motion";
import { ActionDropdown } from "@/components/ui";
import { useRouter } from "next/router";
import { useModal } from "@/context/modal-context";
import { authAxios } from "@/utils/axios";
import { DropdownItem } from "@/components/ui/action-dropdown";
import { formatDateTime } from "@/utils/funcs";

const FlashcardDeckCard = ({ deck }) => {
    const router = useRouter();
    const { openModal } = useModal();

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

    const handlePractice = () => {
        openModal("PRACTICE_MODAL", { id: deck?.id }, "middle");
    }
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
                </ActionDropdown>
            </div>

            {/* 2. Content */}
            <div className="flex-grow space-y-2 mb-6">
                <h3 className="text-xl font-black text-slate-800 group-hover:text-orange-600 transition-colors line-clamp-1">
                    {deck.title}
                </h3>
                <p className="text-sm text-slate-500 line-clamp-2 leading-relaxed min-h-[40px]">
                    {deck.description || "Tavsif berilmagan"}
                </p>
                <div className="flex items-center gap-2 pt-2">
                    <span className="px-3 py-1 bg-slate-100 rounded-full text-[10px] font-black text-slate-500 uppercase tracking-widest">
                        {deck.cards_count} kartalar
                    </span>
                    <span className="text-[10px] text-slate-300 font-bold">•</span>
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                        {formatDateTime(deck.created_at)}
                    </span>
                </div>
            </div>

            {/* 3. Action Buttons Section */}
            <div className="grid grid-cols-2 gap-3 pt-5 border-t border-slate-50" onClick={e => e.stopPropagation()}>
                {/* Study Button */}
                <button
                    onClick={() => router.push(`/dashboard/flashcards/study/${deck.id}`)}
                    className="flex items-center justify-center gap-2 py-3 bg-orange-50 text-orange-600 rounded-2xl font-bold text-xs hover:bg-orange-500 hover:text-white transition-all active:scale-95"
                >
                    <BookOpen size={16} /> Yodlash
                </button>

                {/* Practice Button */}
                <button
                    onClick={handlePractice}
                    className="flex items-center justify-center gap-2 py-3 bg-[#1e293b] text-white rounded-2xl font-bold text-xs hover:bg-black transition-all active:scale-95 shadow-lg shadow-slate-100"
                >
                    <Brain size={16} /> Mashq
                </button>
            </div>
        </motion.div>
    );
};

export default FlashcardDeckCard;