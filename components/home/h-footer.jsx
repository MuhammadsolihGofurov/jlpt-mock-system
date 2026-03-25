import React from 'react'
import { useIntl } from 'react-intl'
import { Instagram, Send, Linkedin, Twitter, ArrowUpRight } from 'lucide-react'
import Link from 'next/link';

export default function HFooter() {
    const intl = useIntl();
    const currentYear = new Date().getFullYear();

    const footerLinks = [
        {
            title: intl.formatMessage({ id: "footer.col1_title" }),
            links: [
                { name: intl.formatMessage({ id: "footer.link_home" }), href: "/" },
                { name: intl.formatMessage({ id: "footer.link_about" }), href: "#" },
                { name: intl.formatMessage({ id: "footer.link_features" }), href: "#features" },
            ]
        },
        {
            title: intl.formatMessage({ id: "footer.col2_title" }),
            links: [
                { name: "JLPT Mock Exams", href: "#" },
                { name: "KanjiMaster", href: "#" },
                { name: "Grammar Analyzer", href: "#" },
            ]
        },
        {
            title: intl.formatMessage({ id: "footer.col3_title" }),
            links: [
                { name: intl.formatMessage({ id: "footer.link_contact" }), href: "#contact" },
                { name: intl.formatMessage({ id: "footer.link_privacy" }), href: "/privacy" },
                { name: intl.formatMessage({ id: "footer.link_terms" }), href: "/terms" },
            ]
        }
    ];

    const socials = [
        { icon: Instagram, href: "#", color: "hover:text-pink-500" },
        { icon: Send, href: "#", color: "hover:text-blue-400" },
        { icon: Linkedin, href: "#", color: "hover:text-blue-700" },
        { icon: Twitter, href: "#", color: "hover:text-sky-500" },
    ];

    return (
        <footer className="bg-white border-t border-slate-100 pt-20 pb-10">
            <div className="max-w-[1320px] mx-auto px-3 sm:px-6 4xl:px-0">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 mb-20">

                    {/* Brend va Tavsif */}
                    <div className="lg:col-span-4">
                        <div className="text-3xl font-black tracking-tighter text-slate-900 mb-6 flex items-center gap-2">
                            <div className="w-8 h-8 bg-orange-500 rounded-lg rotate-12" />
                            MIKAN.
                        </div>
                        <p className="text-slate-500 text-lg leading-relaxed mb-8 max-w-sm">
                            {intl.formatMessage({ id: "footer.desc" })}
                        </p>
                        <div className="flex gap-4">
                            {socials.map((social, i) => (
                                <a
                                    key={i}
                                    href={social.href}
                                    className={`w-11 h-11 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 transition-all duration-300 border border-slate-100 ${social.color} hover:bg-white hover:shadow-lg hover:-translate-y-1`}
                                >
                                    <social.icon size={20} strokeWidth={2} />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Linklar Ustunlari */}
                    <div className="lg:col-span-8 grid grid-cols-2 md:grid-cols-3 gap-8">
                        {footerLinks.map((col, i) => (
                            <div key={i}>
                                <h4 className="text-slate-900 font-black text-xs uppercase tracking-[0.2em] mb-8">
                                    {col.title}
                                </h4>
                                <ul className="space-y-5">
                                    {col.links.map((link, j) => (
                                        <li key={j}>
                                            <Link
                                                href={link.href}
                                                className="group text-slate-500 hover:text-orange-500 transition-colors flex items-center gap-1 font-medium"
                                            >
                                                {link.name}
                                                <ArrowUpRight size={14} className="opacity-0 -translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all" />
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Pastki qism: Copyright */}
                <div className="pt-10 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="text-sm font-bold text-slate-400 uppercase tracking-widest">
                        © {currentYear} MIKAN PLATFORM. {intl.formatMessage({ id: "footer.rights" })}
                    </div>

                    {/* Til yoki Qo'shimcha ma'lumot */}
                    <div className="flex items-center gap-8">
                        <span className="flex items-center gap-2 text-xs font-black text-slate-300 uppercase tracking-widest">
                            Built in Uzbekistan 🇺🇿
                        </span>
                    </div>
                </div>
            </div>
        </footer>
    )
}