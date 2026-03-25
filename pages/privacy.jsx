import { Seo } from "@/components/seo";
import React from "react";
import { HHeader, HFooter } from "@/components/home";
import { motion } from "framer-motion";
import { useIntl } from "react-intl";

const PrivacyPage = () => {
    const intl = useIntl();

    return (
        <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-orange-100 selection:text-orange-900 overflow-x-hidden">
            <Seo
                title={intl.formatMessage({ id: "privacy.seo_title" })}
                description={intl.formatMessage({ id: "privacy.seo_description" })}
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
                            {intl.formatMessage({ id: "privacy.title_part1" })}{" "}
                            <span className="text-orange-500 underline decoration-orange-200">
                                {intl.formatMessage({ id: "privacy.title_part2" })}
                            </span>
                        </h1>
                        <p className="text-slate-500 mb-12 italic">
                            {intl.formatMessage({ id: "privacy.last_updated" })}
                        </p>

                        <section className="space-y-8 text-slate-700 leading-relaxed text-lg">
                            <div>
                                <h2 className="text-2xl font-semibold text-slate-800 mb-4">
                                    {intl.formatMessage({ id: "privacy.section1_title" })}
                                </h2>
                                <p>{intl.formatMessage({ id: "privacy.section1_text" })}</p>
                            </div>

                            <div>
                                <h2 className="text-2xl font-semibold text-slate-800 mb-4">
                                    {intl.formatMessage({ id: "privacy.section2_title" })}
                                </h2>
                                <ul className="list-disc pl-5 space-y-2 text-slate-600">
                                    <li>{intl.formatMessage({ id: "privacy.data_item1" })}</li>
                                    <li>{intl.formatMessage({ id: "privacy.data_item2" })}</li>
                                    <li>{intl.formatMessage({ id: "privacy.data_item3" })}</li>
                                    <li>{intl.formatMessage({ id: "privacy.data_item4" })}</li>
                                </ul>
                            </div>

                            <div>
                                <h2 className="text-2xl font-semibold text-slate-800 mb-4">
                                    {intl.formatMessage({ id: "privacy.section3_title" })}
                                </h2>
                                <p>{intl.formatMessage({ id: "privacy.section3_text" })}</p>
                            </div>

                            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 mt-12">
                                <h2 className="text-xl font-semibold text-slate-800 mb-2">
                                    {intl.formatMessage({ id: "privacy.contact_title" })}
                                </h2>
                                <p>
                                    {intl.formatMessage({ id: "privacy.contact_text" })}
                                    <strong className="text-orange-600 ml-1">info@mikan.uz</strong>
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

export default PrivacyPage;