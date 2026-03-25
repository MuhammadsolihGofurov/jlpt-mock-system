import { ChevronDown, Globe } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react'
import { useIntl } from 'react-intl'

export default function HHeader() {
    const intl = useIntl();
    const router = useRouter();
    const { locale, pathname, asPath, query } = router;


    return (
        <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
            <div className="max-w-[1440px] mx-auto px-3 sm:px-6 4xl:px-0 h-20 flex items-center justify-between">
                <Link href={"/"} className="text-2xl font-bold tracking-tighter flex items-center gap-2">
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
                </Link>

                <div className="hidden md:flex gap-10 text-[14px] font-bold uppercase tracking-widest text-slate-500">
                    <a href="#features" className="hover:text-orange-500 transition-colors">{intl.formatMessage({ id: "nav.platform" })}</a>
                    <a href="#services" className="hover:text-orange-500 transition-colors">{intl.formatMessage({ id: "nav.services" })}</a>
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
                        {intl.formatMessage({ id: "login" })}
                    </Link>
                </div>
            </div>
        </nav>
    )
}
