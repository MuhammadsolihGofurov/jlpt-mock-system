import { Seo } from "@/components/seo";
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import {
    ArrowRight, MoveUpRight, Globe, Zap, ChevronDown
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useIntl } from "react-intl";
import { toast } from "react-toastify";
import axios from "axios";
import { useRouter } from "next/router";
import Image from "next/image";
import defaultAxios from "@/utils/axios";
import Link from "next/link";

// --- SAKURA PETAL ANIMATION COMPONENT ---
const SakuraPetal = ({ id }) => {
    const [config] = useState({
        left: Math.random() * 100,
        duration: 10 + Math.random() * 15,
        delay: Math.random() * 10,
        size: 12 + Math.random() * 24,
    });

    return (
        <motion.div
            initial={{ y: -20, x: `${config.left}vw`, rotate: 0, opacity: 0 }}
            animate={{
                y: "110vh",
                x: [`${config.left}vw`, `${config.left - 8}vw`, `${config.left + 8}vw`],
                rotate: 360,
                opacity: [0, 0.7, 0.7, 0]
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
                filter: "blur(0.4px)"
            }}
        />
    );
};

const IndexPage = ({ info }) => {
    const intl = useIntl();
    const router = useRouter();
    const { locale, pathname, asPath, query } = router;


    const { register, handleSubmit, watch, reset, formState: { isSubmitting } } = useForm({
        defaultValues: {
            user_type: "individual",
            center_name: ""
        }
    });

    const userType = watch("user_type");

    // Form submission
    const onSubmit = async (data) => {
        const payload = {
            center_name: data.user_type === "center" ? data.center_name : "Oddiy foydalanuvchi",
            full_name: data.full_name,
            phone_number: data.phone_number,
            message: data.message
        };

        try {
            await defaultAxios.post("/contact-requests/", payload);
            toast.success(intl.formatMessage({ id: "contact.success" }));
            reset();
        } catch (error) {
            toast.error(intl.formatMessage({ id: "contact.error" }));
        }
    };

    const scrollToContact = () => {
        document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-orange-100 selection:text-orange-900 overflow-x-hidden">
            <Seo
                title={info?.seo_title || "Mikan — JLPT va Yapon tili imtihonlariga tayyorlov platformasi"}
                description={info?.meta_description || "Yapon tili darajangizni JLPT va IELTS mock testlari orqali innovatsion tahlil qiling. O'quv markazlari va talabalar uchun professional ekotizim."}
                keywords={info?.keywords || "JLPT testlari, yapon tili imtihoni, JLPT N2 tayyorgarlik, IELTS mock test Uzbekistan, Mikan platformasi, yapon tili kurslari"}
            />

            {/* --- 1. MINIMAL NAV --- */}
            <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
                <div className="max-w-7xl mx-auto px-6 h-24 flex items-center justify-between">
                    <div className="text-2xl font-bold tracking-tighter flex items-center gap-2">
                        <div className="bg-orange-500 p-2.5 rounded-[14px] shadow-lg shadow-orange-200">
                            <Image
                                src="/mikan-logo.svg"
                                alt="Mikan"
                                width={28}
                                height={28}
                                className="brightness-0 invert"
                            />
                        </div>
                        <span className="text-2xl font-black tracking-tight text-gray-900">
                            Mikan<span className="text-orange-500">.uz</span>
                        </span>
                    </div>

                    <div className="hidden md:flex gap-10 text-[14px] font-bold uppercase tracking-widest text-slate-500">
                        <a href="#about" className="hover:text-orange-500 transition-colors">{intl.formatMessage({ id: "nav.platform" })}</a>
                        <a href="#features" className="hover:text-orange-500 transition-colors">{intl.formatMessage({ id: "nav.services" })}</a>
                        <a href="#process" className="hover:text-orange-500 transition-colors">{intl.formatMessage({ id: "nav.method" })}</a>
                    </div>

                    <div className="flex items-center gap-6">
                        {/* Language Selector */}
                        <div className="relative group">
                            <button className="flex items-center gap-2 font-bold text-sm uppercase text-slate-600 hover:text-orange-500 transition-colors">
                                <Globe size={18} />
                                {router.locale}
                                <ChevronDown size={14} />
                            </button>
                            <div className="absolute right-0 top-full pt-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                                <div className="bg-white border border-slate-100 shadow-2xl rounded-2xl p-2 min-w-[100px]">
                                    {['uz', 'ru', 'en', 'jp'].map((lang) => (
                                        <button
                                            key={lang}
                                            onClick={() => router.push({ pathname, query }, asPath, { locale: lang })}
                                            className="w-full text-left px-4 py-2 rounded-xl text-xs font-bold uppercase hover:bg-slate-50 text-slate-500 hover:text-orange-500"
                                        >
                                            {lang}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <Link href={"/login"} className="bg-slate-950 text-white px-8 py-3 rounded-full text-sm font-bold hover:bg-orange-600 transition-all">
                            {intl.formatMessage({ id: "nav.login" })}
                        </Link>
                    </div>
                </div>
            </nav>

            {/* --- 2. HERO: WITH SAKURA --- */}
            <section className="relative pt-60 pb-32 px-6 overflow-hidden">
                {/* Sakura Animation Layer */}
                <div className="absolute inset-0 pointer-events-none">
                    {[...Array(15)].map((_, i) => <SakuraPetal key={i} />)}
                </div>

                <div className="max-w-7xl mx-auto relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="max-w-7xl"
                    >
                        <span className="text-orange-500 font-bold tracking-[0.4em] text-[13px] uppercase block mb-8">
                            {intl.formatMessage({ id: "hero.label" })}
                        </span>
                        <h1 className="text-7xl md:text-[105px] font-bold tracking-tight leading-[1] mb-12">
                            {intl.formatMessage({ id: "hero.title_p1" })} <br />
                            <span className="text-slate-400 italic font-light">{intl.formatMessage({ id: "hero.title_accent" })}</span> {intl.formatMessage({ id: "hero.title_p2" })}
                        </h1>
                        <p className="text-2xl text-slate-500 max-w-2xl mb-16 leading-relaxed font-light">
                            {intl.formatMessage({ id: "hero.description" })}
                        </p>
                        <div className="flex flex-col sm:flex-row gap-6">
                            <button className="h-20 px-12 bg-slate-950 text-white rounded-full font-bold text-lg flex items-center justify-between group min-w-[280px] shadow-2xl shadow-slate-200">
                                {intl.formatMessage({ id: "hero.btn_start" })} <ArrowRight className="group-hover:translate-x-2 transition-transform" size={24} />
                            </button>
                            <button
                                onClick={scrollToContact}
                                className="h-20 px-12 border-2 border-slate-200 rounded-full font-bold text-lg flex items-center justify-center hover:bg-slate-50 hover:border-orange-500 transition-all"
                            >
                                {intl.formatMessage({ id: "hero.btn_try" })}
                            </button>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* --- 3. METRICS --- */}
            <section className="py-24 border-y border-slate-100 bg-slate-50/50">
                <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-12">
                    {[
                        { label: intl.formatMessage({ id: "stats.students" }), value: "12,000+" },
                        { label: intl.formatMessage({ id: "stats.success" }), value: "85%" },
                        { label: intl.formatMessage({ id: "stats.questions" }), value: "5,000+" },
                        { label: intl.formatMessage({ id: "stats.partners" }), value: "40+" }
                    ].map((stat, i) => (
                        <div key={i}>
                            <div className="text-4xl font-bold mb-1">{stat.value}</div>
                            <div className="text-[12px] uppercase tracking-widest text-slate-400 font-bold">{stat.label}</div>
                        </div>
                    ))}
                </div>
            </section>

            {/* --- 4. BENTO FEATURE GRID --- */}
            <section id="features" className="py-32 px-6 max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 h-full">
                    <div className="md:col-span-8 bg-slate-900 rounded-[3rem] p-16 text-white relative overflow-hidden min-h-[450px]">
                        <div className="relative z-10 max-w-sm">
                            <h3 className="text-4xl font-bold mb-6">{intl.formatMessage({ id: "feat.dashboard_title" })}</h3>
                            <p className="text-slate-400 text-lg leading-relaxed">{intl.formatMessage({ id: "feat.dashboard_desc" })}</p>
                        </div>
                        <div className="absolute bottom-0 right-0 w-2/3 h-2/3 bg-orange-500/10 blur-[120px]" />
                    </div>
                    <div className="md:col-span-4 bg-slate-100 rounded-[3rem] p-12 flex flex-col justify-between">
                        <Zap className="text-orange-500" size={40} />
                        <div>
                            <h3 className="text-3xl font-bold mb-4">{intl.formatMessage({ id: "feat.result_title" })}</h3>
                            <p className="text-slate-500 text-base">{intl.formatMessage({ id: "feat.result_desc" })}</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- 5. SERVICES LIST --- */}
            <section className="py-32 bg-white px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="flex justify-between items-end mb-20">
                        <h2 className="text-6xl font-bold tracking-tight">{intl.formatMessage({ id: "services.title" })}</h2>
                        <a href="#" className="text-orange-500 font-bold text-sm tracking-widest uppercase border-b-2 border-orange-500 pb-1">{intl.formatMessage({ id: "common.view_all" })}</a>
                    </div>
                    <div className="divide-y divide-slate-100">
                        {['JLPT Mock Exams', 'Kanjimaster Training', 'Listening Intensive', 'Grammar Analyzer'].map((item, i) => (
                            <div key={i} className="py-12 flex items-center justify-between group cursor-pointer hover:px-8 transition-all">
                                <h4 className="text-4xl font-light text-slate-400 group-hover:text-slate-950 transition-colors">0{i + 1}. {item}</h4>
                                <div className="w-16 h-16 border border-slate-200 rounded-full flex items-center justify-center group-hover:bg-orange-500 group-hover:border-orange-500 group-hover:text-white transition-all">
                                    <MoveUpRight size={24} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* --- 6. METODIKA --- */}
            <section id="process" className="py-32 bg-slate-950 text-white rounded-[5rem] mx-4 px-6 overflow-hidden">
                <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-24 items-center">
                    <div>
                        <h2 className="text-6xl font-bold mb-12 leading-tight">
                            {intl.formatMessage({ id: "method.title_p1" })} <span className="text-orange-500 italic">{intl.formatMessage({ id: "method.title_accent" })}</span> {intl.formatMessage({ id: "method.title_p2" })}
                        </h2>
                        <div className="space-y-10">
                            {[
                                { t: intl.formatMessage({ id: "method.s1_t" }), d: intl.formatMessage({ id: "method.s1_d" }) },
                                { t: intl.formatMessage({ id: "method.s2_t" }), d: intl.formatMessage({ id: "method.s2_d" }) },
                                { t: intl.formatMessage({ id: "method.s3_t" }), d: intl.formatMessage({ id: "method.s3_d" }) }
                            ].map((step, i) => (
                                <div key={i} className="flex gap-8">
                                    <div className="text-orange-500 font-bold text-xl">0{i + 1}</div>
                                    <div>
                                        <h5 className="text-xl font-bold mb-2">{step.t}</h5>
                                        <p className="text-slate-400 text-lg leading-relaxed">{step.d}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="relative aspect-square border border-white/10 rounded-full flex items-center justify-center">
                        <div className="w-3/4 h-3/4 border border-white/10 rounded-full animate-spin-slow flex items-center justify-center text-orange-500">
                            <Globe size={60} />
                        </div>
                    </div>
                </div>
            </section>

            {/* --- 9. CONTACT FORM --- */}
            <section id="contact" className="py-40 px-6 max-w-7xl mx-auto">
                <div className="grid md:grid-cols-2 gap-24">
                    <div>
                        <h2 className="text-6xl font-bold mb-8 leading-tight">{intl.formatMessage({ id: "contact.title" })}</h2>
                        <p className="text-xl text-slate-500 mb-16">{intl.formatMessage({ id: "contact.desc" })}</p>
                        <div className="space-y-6">
                            <p className="text-sm font-bold tracking-widest uppercase text-slate-400 italic">{intl.formatMessage({ id: "contact.info_label" })}</p>
                            <p className="text-3xl font-bold">+998 90 000 00 00</p>
                            <p className="text-3xl font-bold">info@mikan.uz</p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-10 bg-slate-50 p-16 rounded-[3rem] shadow-sm border border-slate-100">
                        {/* Radio Selection */}
                        <div className="flex bg-white p-2 rounded-2xl border border-slate-200">
                            <label className={`flex-1 text-center py-4 rounded-xl cursor-pointer font-bold text-sm transition-all ${userType === 'individual' ? 'bg-orange-500 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}>
                                <input type="radio" value="individual" {...register("user_type")} className="hidden" />
                                {intl.formatMessage({ id: "contact.type_user" })}
                            </label>
                            <label className={`flex-1 text-center py-4 rounded-xl cursor-pointer font-bold text-sm transition-all ${userType === 'center' ? 'bg-orange-500 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}>
                                <input type="radio" value="center" {...register("user_type")} className="hidden" />
                                {intl.formatMessage({ id: "contact.type_center" })}
                            </label>
                        </div>

                        <div className="space-y-8">
                            <AnimatePresence>
                                {userType === 'center' && (
                                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
                                        <input
                                            {...register("center_name", { required: userType === 'center' })}
                                            className="w-full bg-transparent border-b-2 border-slate-200 py-4 focus:outline-none focus:border-orange-500 transition-colors font-bold text-xl placeholder:text-slate-300"
                                            placeholder={intl.formatMessage({ id: "contact.ph_center" })}
                                        />
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <input {...register("full_name", { required: true })} className="w-full bg-transparent border-b-2 border-slate-200 py-4 focus:outline-none focus:border-orange-500 transition-colors font-bold text-xl placeholder:text-slate-300" placeholder={intl.formatMessage({ id: "contact.ph_name" })} />
                            <input {...register("phone_number", { required: true })} className="w-full bg-transparent border-b-2 border-slate-200 py-4 focus:outline-none focus:border-orange-500 transition-colors font-bold text-xl placeholder:text-slate-300" placeholder={intl.formatMessage({ id: "contact.ph_phone" })} />
                            <textarea {...register("message")} className="w-full bg-transparent border-b-2 border-slate-200 py-4 focus:outline-none focus:border-orange-500 transition-colors font-bold text-xl placeholder:text-slate-300 min-h-[120px]" placeholder={intl.formatMessage({ id: "contact.ph_msg" })} />
                        </div>

                        <button disabled={isSubmitting} className="w-full h-20 bg-slate-950 text-white rounded-full font-bold hover:bg-orange-600 transition-all uppercase tracking-[0.2em] text-sm shadow-xl shadow-slate-200">
                            {isSubmitting ? "..." : intl.formatMessage({ id: "contact.btn_send" })}
                        </button>
                    </form>
                </div>
            </section>

            {/* --- 10. FOOTER --- */}
            <footer className="py-24 border-t border-slate-100 px-6">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-10">
                    <div className="text-3xl font-bold tracking-tighter italic">MIKAN.</div>
                    <div className="flex gap-12 text-[12px] font-bold uppercase tracking-[0.3em] text-slate-400">
                        <a href="#" className="hover:text-orange-500 transition-colors">Instagram</a>
                        <a href="#" className="hover:text-orange-500 transition-colors">Telegram</a>
                        <a href="#" className="hover:text-orange-500 transition-colors">LinkedIn</a>
                    </div>
                    <div className="text-[12px] text-slate-400 font-medium">© 2026 MIKAN PLATFORM. ALL RIGHTS RESERVED.</div>
                </div>
            </footer>

            <style jsx global>{`
                html { scroll-behavior: smooth; }
                @keyframes spin-slow {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                .animate-spin-slow {
                    animation: spin-slow 30s linear infinite;
                }
                body {
                    -webkit-font-smoothing: antialiased;
                }
            `}</style>
        </div>
    );
};

export default IndexPage;