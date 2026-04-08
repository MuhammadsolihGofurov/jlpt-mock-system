import { Seo } from "@/components/seo";
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import {
    ArrowRight, MoveUpRight, Globe, Zap, ChevronDown
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useIntl } from "react-intl";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import defaultAxios from "@/utils/axios";
import { HContact, HFeatures, HFooter, HHeader, HMain, HMethod, HResults, HServices } from "@/components/home";

// --- SAKURA PETAL ANIMATION COMPONENT ---


const IndexPage = ({ info }) => {
    const intl = useIntl();
    const router = useRouter();
    const { locale, pathname, asPath, query } = router;

    return (
        <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-orange-100 selection:text-orange-900 overflow-x-hidden">
            <Seo
                title={info?.seo_title || "Mikan — JLPT va Yapon tili imtihonlariga tayyorlov platformasi"}
                description={info?.meta_description || "Yapon tili darajangizni JLPT va IELTS mock testlari orqali innovatsion tahlil qiling. O'quv markazlari va talabalar uchun professional ekotizim."}
                keywords={info?.keywords || "JLPT testlari, yapon tili imtihoni, JLPT N2 tayyorgarlik, IELTS mock test Uzbekistan, Mikan platformasi, yapon tili kurslari, jltp imtihonlari, flash kartlar, jlptga tayyorlanish, mikan uz, mikan, yapon tili"}
            />

            {/* --- 1. MINIMAL NAV --- */}
            <HHeader />

            {/* --- 2. HERO: WITH SAKURA --- */}
            <HMain />

            {/* --- 3. METRICS --- */}
            <HResults />

            {/* --- 4. BENTO FEATURE GRID --- */}
            <HFeatures />

            {/* --- 5. SERVICES LIST --- */}
            <HServices />

            {/* --- 6. METODIKA --- */}
            <HMethod />

            {/* --- 9. CONTACT FORM --- */}
            <HContact />

            {/* --- 10. FOOTER --- */}
            <HFooter />

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