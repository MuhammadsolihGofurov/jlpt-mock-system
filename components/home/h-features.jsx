import React from 'react'
import { useIntl } from 'react-intl'
import { motion } from 'framer-motion'
import { Zap, BarChart3, Target, ShieldCheck, Cpu } from 'lucide-react'

export default function HFeatures() {
    const intl = useIntl();

    return (
        <section id="features" className="py-5 sm:py-20 bg-white">
            <div className="max-w-[1320px] mx-auto px-3 sm:px-6 4xl:px-0">
                {/* Sarlavha qismi */}
                <div className="mb-10 flex flex-col gap-8 border-b border-slate-100 sm:pb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-4xl md:text-6xl font-bold tracking-tighter text-slate-900 leading-none"
                    >
                        <div dangerouslySetInnerHTML={{ __html: intl.formatMessage({ id: "Why us?" }) }} />
                    </motion.div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-6">

                    {/* 1. Asosiy blok - Dashboard (Large) */}
                    <motion.div
                        whileHover={{ y: -5 }}
                        className="md:col-span-8 bg-slate-900 rounded-[2.5rem] p-8 md:p-16 text-white relative overflow-hidden min-h-[500px] flex flex-col justify-end group"
                    >
                        <div className="absolute top-12 left-12 w-16 h-16 bg-orange-500 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-500/20 mb-8">
                            <BarChart3 size={32} />
                        </div>

                        <div className="relative z-10 max-w-xl">
                            <h3 className="text-3xl md:text-4xl font-bold mb-6 leading-tight">
                                {intl.formatMessage({ id: "feat.dashboard_title" })}
                            </h3>
                            <p className="text-slate-400 text-lg md:text-xl leading-relaxed font-light">
                                {intl.formatMessage({ id: "feat.dashboard_desc" })}
                            </p>
                        </div>

                        {/* Grafik bezagi (Abstract shape) */}
                        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-orange-500/10 to-transparent pointer-events-none" />
                        <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-orange-500/20 blur-[120px] rounded-full group-hover:bg-orange-500/30 transition-colors duration-500" />
                    </motion.div>

                    {/* 2. O'ng taraf - Instant Result (Small) */}
                    <motion.div
                        whileHover={{ y: -5 }}
                        className="md:col-span-4 bg-orange-50 rounded-[2.5rem] p-10 flex flex-col justify-between border border-orange-100 group"
                    >
                        <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm text-orange-500 group-hover:rotate-12 transition-transform">
                            <Zap size={28} fill="currentColor" />
                        </div>
                        <div>
                            <h3 className="text-2xl font-bold mb-4 text-slate-900">
                                {intl.formatMessage({ id: "feat.result_title" })}
                            </h3>
                            <p className="text-slate-600 text-lg leading-relaxed">
                                {intl.formatMessage({ id: "feat.result_desc" })}
                            </p>
                        </div>
                    </motion.div>

                    {/* 3. Pastki chap - AI/Smart System (Small) */}
                    <motion.div
                        whileHover={{ y: -5 }}
                        className="md:col-span-4 bg-slate-100 rounded-[2.5rem] p-10 flex flex-col justify-between border border-slate-200 group"
                    >
                        <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm text-slate-900 group-hover:scale-110 transition-transform">
                            <Cpu size={28} />
                        </div>
                        <div>
                            <h3 className="text-2xl font-bold mb-4 text-slate-900">
                                {intl.formatMessage({ id: "feat.ai_title" })}
                            </h3>
                            <p className="text-slate-500 text-lg leading-relaxed">
                                {intl.formatMessage({ id: "feat.ai_desc" })}
                            </p>
                        </div>
                    </motion.div>

                    {/* 4. Pastki o'ng - Natijaga yo'naltirilganlik (Medium/Wide) */}
                    <motion.div
                        whileHover={{ y: -5 }}
                        className="md:col-span-8 bg-blue-600 rounded-[2.5rem] p-10 md:p-12 text-white relative overflow-hidden flex flex-col md:flex-row items-center gap-8 group"
                    >
                        <div className="flex-1">
                            <h3 className="text-3xl font-bold mb-4">{intl.formatMessage({ id: "Target: N1-N5" })}</h3>
                            <p className="text-blue-100 text-lg leading-relaxed font-light">
                                {intl.formatMessage({ id: "Platformamiz har qanday darajadagi talaba uchun individual tayyorgarlik rejasini taqdim etadi. O'zingizga mos tezlikda o'rganing." })}
                            </p>
                        </div>
                        <div className="w-32 h-32 md:w-40 md:h-40 bg-blue-500 rounded-full flex items-center justify-center border-4 border-blue-400/50 group-hover:scale-105 transition-transform duration-500">
                            <Target size={60} className="text-white" />
                        </div>
                    </motion.div>

                </div>
            </div>
        </section>
    )
}