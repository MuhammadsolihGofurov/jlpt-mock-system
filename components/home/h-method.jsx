import { Globe, CheckCircle2, ArrowRight } from 'lucide-react';
import React from 'react'
import { useIntl } from 'react-intl'
import { motion } from 'framer-motion'

export default function HMethod() {
    const intl = useIntl();

    const steps = [
        {
            t: intl.formatMessage({ id: "method.s1_t" }),
            d: intl.formatMessage({ id: "method.s1_d" })
        },
        {
            t: intl.formatMessage({ id: "method.s2_t" }),
            d: intl.formatMessage({ id: "method.s2_d" })
        },
        {
            t: intl.formatMessage({ id: "method.s3_t" }),
            d: intl.formatMessage({ id: "method.s3_d" })
        }
    ];

    return (
        <section id="process" className="py-5 sm:py-20 bg-white overflow-hidden">
            <div className="max-w-[1320px] mx-auto px-3 sm:px-6 4xl:px-0">
                <div className="bg-slate-950 text-white rounded-2xl sm:rounded-[3rem] md:rounded-[5rem] p-8 md:p-20 relative overflow-hidden">

                    {/* Orqa fon bezagi */}
                    <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-orange-500/10 to-transparent pointer-events-none" />

                    <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center relative z-10">

                        {/* Chap tomon: Matnlar */}
                        <div>
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                            >
                                <span className="text-orange-500 font-bold tracking-widest text-sm uppercase mb-6 block">
                                    {intl.formatMessage({ id: "Qanday ishlaymiz?" })}
                                </span>
                                <h2 className="text-4xl md:text-6xl font-bold mb-12 leading-[1.1]">
                                    {intl.formatMessage({ id: "method.title_p1" })}{" "}
                                    <span className="text-orange-500 italic font-light">
                                        {intl.formatMessage({ id: "method.title_accent" })}
                                    </span>{" "}
                                    {intl.formatMessage({ id: "method.title_p2" })}
                                </h2>
                            </motion.div>

                            <div className="space-y-8">
                                {steps.map((step, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, x: -30 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: i * 0.2 }}
                                        className="flex gap-6 group"
                                    >
                                        <div className="flex-shrink-0 w-12 h-12 rounded-full border border-white/20 flex items-center justify-center text-orange-500 font-bold group-hover:bg-orange-500 group-hover:text-white group-hover:border-orange-500 transition-all duration-300">
                                            0{i + 1}
                                        </div>
                                        <div className="pt-2">
                                            <h5 className="text-xl md:text-2xl font-bold mb-3 flex items-center gap-3 text-slate-100">
                                                {step.t}
                                                <CheckCircle2 size={18} className="text-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                                            </h5>
                                            <p className="text-slate-400 text-base md:text-lg leading-relaxed max-w-md font-light">
                                                {step.d}
                                            </p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>

                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                className="mt-14 flex items-center gap-4 bg-white text-slate-950 px-8 py-4 rounded-full font-bold transition-all"
                            >
                                Hoziroq sinab ko'rish <ArrowRight size={20} />
                            </motion.button>
                        </div>

                        {/* O'ng tomon: Vizual effekt */}
                        <div className="relative flex items-center justify-center">
                            {/* Orbitalar */}
                            <div className="relative w-full aspect-square max-w-[500px] border border-white/5 rounded-full flex items-center justify-center animate-pulse">
                                <div className="absolute w-[80%] h-[80%] border border-white/10 rounded-full animate-spin-slow" />
                                <div className="absolute w-[60%] h-[60%] border border-white/5 rounded-full" />

                                {/* Markaziy element */}
                                <motion.div
                                    animate={{
                                        y: [0, -20, 0],
                                    }}
                                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                    className="relative z-10 w-40 h-40 md:w-56 md:h-56 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center shadow-[0_0_80px_rgba(249,115,22,0.3)]"
                                >
                                    <Globe size={80} className="text-white opacity-90" />

                                    {/* Floating Badges */}
                                    <div className="absolute -top-4 -right-4 bg-white text-slate-950 px-4 py-2 rounded-xl font-black text-xs shadow-xl animate-bounce">
                                        JLPT N1
                                    </div>
                                    <div className="absolute -bottom-4 -left-4 bg-emerald-500 text-white px-4 py-2 rounded-xl font-black text-xs shadow-xl">
                                        AI ANALYZER
                                    </div>
                                </motion.div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </section>
    )
}