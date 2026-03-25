import { Seo } from "@/components/seo";
import React from "react";
import { HHeader, HFooter } from "@/components/home";
import { motion } from "framer-motion";
import { useIntl } from "react-intl";

const TermsPage = () => {
    const intl = useIntl();

    return (
        <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-orange-100 selection:text-orange-900 overflow-x-hidden">
            <Seo
                title={intl.formatMessage({ id: "terms.seo_title" })}
                description={intl.formatMessage({ id: "terms.seo_description" })}
            />

            <HHeader />

            <main className="pt-32 pb-20 px-6">
                <div className="max-w-4xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <h1 className="text-4xl md:text-5xl font-bold mb-8 text-slate-900">
                            {intl.formatMessage({ id: "terms.title_part1" })}{" "}
                            <span className="text-orange-500 underline decoration-orange-200">
                                {intl.formatMessage({ id: "terms.title_part2" })}
                            </span>
                        </h1>
                        <p className="text-slate-500 mb-12 italic">
                            {intl.formatMessage({ id: "terms.last_updated" })}
                        </p>

                        <section className="space-y-8 text-slate-700 leading-relaxed text-lg">
                            <div>
                                <h2 className="text-2xl font-semibold text-slate-800 mb-4">
                                    {intl.formatMessage({ id: "terms.section1_title" })}
                                </h2>
                                <p>{intl.formatMessage({ id: "terms.section1_text" })}</p>
                            </div>

                            <div>
                                <h2 className="text-2xl font-semibold text-slate-800 mb-4">
                                    {intl.formatMessage({ id: "terms.section2_title" })}
                                </h2>
                                <p>{intl.formatMessage({ id: "terms.section2_text" })}</p>
                            </div>

                            <div>
                                <h2 className="text-2xl font-semibold text-slate-800 mb-4">
                                    {intl.formatMessage({ id: "terms.section3_title" })}
                                </h2>
                                <ul className="list-disc pl-5 space-y-2 text-slate-600">
                                    <li>{intl.formatMessage({ id: "terms.rule_item1" })}</li>
                                    <li>{intl.formatMessage({ id: "terms.rule_item2" })}</li>
                                    <li>{intl.formatMessage({ id: "terms.rule_item3" })}</li>
                                </ul>
                            </div>

                            <div className="p-6 border-l-4 border-orange-500 bg-orange-50 rounded-r-2xl">
                                <p className="text-sm font-bold uppercase tracking-widest text-orange-600 mb-2">
                                    {intl.formatMessage({ id: "terms.note_label" })}
                                </p>
                                <p className="text-slate-800 font-medium">
                                    {intl.formatMessage({ id: "terms.note_text" })}
                                </p>
                            </div>
                        </section>
                    </motion.div>
                </div>
            </main>

            <HFooter />
        </div>
    );
};

export default TermsPage;