import React from 'react'
import { useIntl } from 'react-intl'
import { motion } from 'framer-motion'
import { Users, Target, BookOpen, School } from 'lucide-react'

export default function HResults() {
    const intl = useIntl();

    const stats = [
        {
            id: "students",
            value: "500+",
            icon: Users,
            color: "text-blue-500",
            bg: "bg-blue-50"
        },
        {
            id: "success",
            value: "85%",
            icon: Target,
            color: "text-orange-500",
            bg: "bg-orange-50"
        },
        {
            id: "questions",
            value: "2,000+",
            icon: BookOpen,
            color: "text-emerald-500",
            bg: "bg-emerald-50"
        },
        {
            id: "partners",
            value: "3+",
            icon: School,
            color: "text-purple-500",
            bg: "bg-purple-50"
        }
    ];

    return (
        <section className="py-5 sm:py-24 bg-white relative overflow-hidden">
            {/* Fon bezagi */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />

            <div className="max-w-[1320px] mx-auto px-3 sm:px-6 4xl:px-0">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
                    {stats.map((stat, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1, duration: 0.5 }}
                            className="flex flex-col items-center text-center lg:items-start lg:text-left group"
                        >
                            {/* Ikonka bloki */}
                            <div className={`w-14 h-14 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                                <stat.icon size={28} strokeWidth={2.5} />
                            </div>

                            {/* Raqam */}
                            <div className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-2 tracking-tight">
                                {stat.value}
                            </div>

                            {/* Tavsif */}
                            <div className="text-[13px] uppercase tracking-[0.15em] text-slate-400 font-bold leading-tight">
                                {intl.formatMessage({ id: `stats.${stat.id}` })}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-slate-100 to-transparent" />
        </section>
    )
}