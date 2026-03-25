import React from 'react';
import { useIntl } from 'react-intl';
import { motion } from 'framer-motion';
import {
    MoveUpRight, BookOpen, Headphones, PenTool,
    LayoutDashboard, Users, MessageSquare, Gamepad2, Layers
} from 'lucide-react';
import { useModal } from '@/context/modal-context';

export default function HServices() {
    const intl = useIntl();
    const { openModal } = useModal();

    const handleOpenModal = (item) => {
        if (item.id === 7) return; // Oxirgi card uchun modal ochilmaydi
        openModal("SERVICE_MODAL", { data: item }, "middle");
    };

    const serviceItems = [
        { id: 1, title: intl.formatMessage({ id: "services.item1.title" }), desc: intl.formatMessage({ id: "services.item1.desc" }), full_desc: intl.formatMessage({ id: "services.item1.full_desc" }), icon: LayoutDashboard, tag: "Exam Engine" },
        { id: 2, title: intl.formatMessage({ id: "services.item2.title" }), desc: intl.formatMessage({ id: "services.item2.desc" }), full_desc: intl.formatMessage({ id: "services.item2.full_desc" }), icon: PenTool, tag: "AI Flashcards" },
        { id: 3, title: intl.formatMessage({ id: "services.item3.title" }), desc: intl.formatMessage({ id: "services.item3.desc" }), full_desc: intl.formatMessage({ id: "services.item3.full_desc" }), icon: Users, tag: "Networking" },
        { id: 4, title: intl.formatMessage({ id: "services.item4.title" }), desc: intl.formatMessage({ id: "services.item4.desc" }), full_desc: intl.formatMessage({ id: "services.item4.full_desc" }), icon: MessageSquare, tag: "AI Sensei" },
        { id: 5, title: intl.formatMessage({ id: "services.item5.title" }), desc: intl.formatMessage({ id: "services.item5.desc" }), full_desc: intl.formatMessage({ id: "services.item5.full_desc" }), icon: Gamepad2, tag: "Gamification" },
        { id: 6, title: intl.formatMessage({ id: "services.item6.title" }), desc: intl.formatMessage({ id: "services.item6.desc" }), full_desc: intl.formatMessage({ id: "services.item6.full_desc" }), icon: Layers, tag: "Roadmap" },
        { id: 7, title: intl.formatMessage({ id: "services.item7.title" }), desc: intl.formatMessage({ id: "services.item7.desc" }), isBlurred: true, icon: Layers, tag: "Coming Soon" }
    ];

    return (
        <section className="py-5 sm:py-20 bg-white overflow-hidden" id='services'>
            <div className="max-w-[1320px] mx-auto px-3 sm:px-6 4xl:px-0">

                {/* Yangilangan Sarlavha Qismi */}
                <div className="sm:mb-10 flex flex-col gap-8 border-b border-slate-100 pb-5 sm:pb-16">
                    <motion.h2
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-4xl md:text-6xl font-bold tracking-tighter text-slate-900 leading-none"
                    >
                        {intl.formatMessage({ id: "services.title_main" })}
                        <span className="text-orange-500">{intl.formatMessage({ id: "services.title_accent" })}</span>
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
                        className="max-w-lg text-slate-400 font-medium text-lg leading-snug"
                    >
                        {intl.formatMessage({ id: "services.title_desc" })}
                    </motion.p>
                </div>

                {/* Xizmatlar Ro'yxati */}
                <div className="grid grid-cols-1 divide-y divide-slate-100">
                    {serviceItems.map((item, i) => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            onClick={() => handleOpenModal(item)}
                            className={`group relative py-12 md:py-16 flex flex-col md:flex-row md:items-center justify-between cursor-pointer transition-all duration-500 px-4 md:px-8
                                ${item.isBlurred ? 'opacity-10 blur-md pointer-events-none grayscale' : 'hover:bg-slate-50'}`}
                        >
                            <div className="flex items-center gap-8 md:gap-16 relative z-10">
                                <span className="text-sm font-black text-slate-200 group-hover:text-orange-500 transition-colors duration-300 w-8">
                                    0{i + 1}
                                </span>

                                <div className="flex flex-col">
                                    <div className="flex items-center gap-4 mb-2">
                                        <h4 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tighter transition-all duration-500 group-hover:translate-x-3">
                                            {item.title}
                                        </h4>
                                    </div>
                                    <p className="text-slate-400 text-lg max-w-2xl font-medium transition-all duration-500 group-hover:translate-x-3 group-hover:text-slate-600">
                                        {item.desc}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-6 mt-6 md:mt-0 relative z-10 self-end md:self-center">
                                <span className="hidden lg:block text-[10px] font-black uppercase tracking-[0.2em] px-5 py-2 bg-slate-100 rounded-full text-slate-500 group-hover:bg-orange-500 group-hover:text-white transition-all duration-300">
                                    {item.tag}
                                </span>

                                {!item.isBlurred && (
                                    <div className="w-16 h-16 md:w-24 md:h-24 border border-slate-200 rounded-full flex items-center justify-center group-hover:bg-slate-950 group-hover:border-slate-950 group-hover:text-white transition-all duration-500 group-hover:rotate-45">
                                        <MoveUpRight size={32} strokeWidth={1.5} />
                                    </div>
                                )}
                            </div>

                            {/* Fon bezagi */}
                            <div className="absolute left-0 top-0 w-0 h-full bg-orange-500 group-hover:w-2 transition-all duration-500" />
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}