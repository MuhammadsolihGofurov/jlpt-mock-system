import React, { useState } from 'react'
import { motion } from "framer-motion";
import { useIntl } from 'react-intl';
import { ArrowRight } from 'lucide-react';
import { useRouter } from 'next/router';

const SakuraPetal = ({ id }) => {
    const [config] = useState({
        left: Math.random() * 100,
        duration: 15 + Math.random() * 20,
        delay: Math.random() * 10,
        size: 10 + Math.random() * 20,
    });

    return (
        <motion.div
            initial={{ y: -20, x: `${config.left}vw`, rotate: 0, opacity: 0 }}
            animate={{
                y: "110vh",
                x: [`${config.left}vw`, `${config.left - 5}vw`, `${config.left + 5}vw`],
                rotate: 360,
                opacity: [0, 0.6, 0.6, 0]
            }}
            transition={{
                duration: config.duration,
                repeat: Infinity,
                delay: config.delay,
                ease: "linear"
            }}
            className="absolute pointer-events-none z-0"
            style={{
                width: config.size,
                height: config.size * 0.8,
                background: "linear-gradient(135deg, #ffd1dc 0%, #ffb7c5 100%)",
                borderRadius: "100% 10% 100% 10%",
                filter: "blur(0.5px)"
            }}
        />
    );
};

export default function HMain() {
    const intl = useIntl();
    const router = useRouter();

    const scrollToContact = () => {
        document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <section className="relative min-h-[90vh] flex items-center pt-32 pb-20 px-6 overflow-hidden bg-white">
            {/* Sakura Animation Layer */}
            <div className="absolute inset-0 pointer-events-none">
                {[...Array(20)].map((_, i) => <SakuraPetal key={i} />)}
            </div>

            <div className="max-w-[1320px] mx-auto px-3 sm:px-6 4xl:px-0 relative z-10 w-full">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    {/* Yuqori Label */}
                    <span className="text-orange-500 font-bold tracking-[0.3em] text-[13px] uppercase block mb-6">
                        {intl.formatMessage({ id: "hero.label" })}
                    </span>

                    {/* Asosiy Sarlavha */}
                    <h1 className="text-5xl md:text-[90px] lg:text-[110px] font-bold tracking-tight leading-[1.1] mb-8 text-slate-900">
                        {intl.formatMessage({ id: "hero.title_p1" })} <br />
                        <span className="text-slate-400 italic font-light">
                            {intl.formatMessage({ id: "hero.title_accent" })}
                        </span>{" "}
                        {intl.formatMessage({ id: "hero.title_p2" })}
                    </h1>

                    {/* Tavsif - Marketing matni */}
                    <p className="text-lg md:text-2xl text-slate-500 max-w-3xl mb-12 leading-relaxed font-light">
                        {intl.formatMessage({ id: "hero.description" })}
                    </p>

                    {/* Action tugmalari */}
                    <div className="flex flex-col sm:flex-row gap-5">
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={scrollToContact}
                            className="h-20 px-10 bg-slate-950 text-white rounded-full font-bold text-lg flex items-center justify-between group min-w-[260px] shadow-xl shadow-slate-200"
                        >
                            {intl.formatMessage({ id: "hero.btn_try" })}
                            <ArrowRight className="group-hover:translate-x-2 transition-transform ml-4" size={22} />
                        </motion.button>

                        <motion.button
                            whileHover={{ scale: 1.02, borderColor: "#f97316" }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => router.push("/login")}
                            className="h-20 px-10 border-2 border-slate-200 rounded-full font-bold text-lg flex items-center justify-center hover:bg-slate-50 transition-all text-slate-700 min-w-[200px]"
                        >
                            {intl.formatMessage({ id: "hero.btn_start" })}
                        </motion.button>
                    </div>

                    {/* Qo'shimcha Trust Factor (Ixtiyoriy) */}
                    <div className="mt-16 pt-8 border-t border-slate-100 flex items-center gap-8 opacity-60">
                        <span className="text-sm font-medium uppercase tracking-widest text-slate-400">
                            {intl.formatMessage({ id: "O'quv markazlari va talabalar tanlovi" })}
                        </span>
                    </div>
                </motion.div>
            </div>
        </section>
    )
}