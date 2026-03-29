import React from "react";
import { Layers, Calendar, ChevronRight, MoreVertical } from "lucide-react";
import { motion } from "framer-motion";

const FlashcardDeckCard = ({ deck, onEdit, onDelete, onClick }) => {
    return (
        <motion.div
            whileHover={{ y: -5 }}
            className="group relative bg-white border border-slate-100 rounded-[2rem] p-6 shadow-sm hover:shadow-xl hover:shadow-orange-500/5 transition-all cursor-pointer"
            onClick={() => onClick?.(deck.id)}
        >
            <div className="flex justify-between items-start mb-6">
                <div className="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center text-orange-500 group-hover:bg-orange-500 group-hover:text-white transition-colors">
                    <Layers size={24} />
                </div>
                <button
                    onClick={(e) => { e.stopPropagation(); /* Menu ochish */ }}
                    className="p-2 hover:bg-slate-50 rounded-full text-slate-400"
                >
                    <MoreVertical size={20} />
                </button>
            </div>

            <div className="space-y-2 mb-6">
                <h3 className="text-xl font-bold text-slate-900 group-hover:text-orange-600 transition-colors line-clamp-1">
                    {deck.title}
                </h3>
                <p className="text-sm text-slate-500 line-clamp-2 leading-relaxed h-10">
                    {deck.description || "Tavsif berilmagan"}
                </p>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                <div className="flex items-center gap-4">
                    <div className="flex flex-col">
                        <span className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">Kartalar</span>
                        <span className="text-sm font-black text-slate-700">{deck.cards_count} ta</span>
                    </div>
                    <div className="h-8 w-[1px] bg-slate-100" />
                    <div className="flex flex-col">
                        <span className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">Sana</span>
                        <span className="text-sm font-medium text-slate-500">
                            {new Date(deck.created_at).toLocaleDateString()}
                        </span>
                    </div>
                </div>

                <div className="w-8 h-8 rounded-full bg-slate-950 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <ChevronRight size={18} />
                </div>
            </div>
        </motion.div>
    );
};

export default FlashcardDeckCard;