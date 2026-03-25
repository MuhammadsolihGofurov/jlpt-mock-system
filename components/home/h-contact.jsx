import defaultAxios from '@/utils/axios';
import { AnimatePresence, motion } from 'framer-motion';
import React from 'react'
import { useForm } from 'react-hook-form';
import { useIntl } from 'react-intl';
import { toast } from 'react-toastify';
import { Phone, Mail, MapPin, Send, Loader2 } from 'lucide-react';
import { handleApiError } from '@/utils/handle-error';

export default function HContact() {
    const intl = useIntl();
    const { register, handleSubmit, watch, reset, formState: { isSubmitting } } = useForm({
        defaultValues: {
            user_type: "user",
            center_name: ""
        }
    });

    const userType = watch("user_type");

    const onSubmit = async (data) => {
        const payload = {
            center_name: data.user_type === "center" ? data.center_name : "Individual",
            full_name: data.full_name,
            phone_number: data.phone_number,
            message: data.message
        };

        try {
            await defaultAxios.post("/contact-requests/", payload);
            toast.success(intl.formatMessage({ id: "contact.success" }));
            reset();
        } catch (error) {
            const msg = handleApiError(error);

            toast.error(msg);
        }
    };

    return (
        <section id="contact" className="pt-5 sm:pt-20 bg-white">
            <div className="max-w-[1320px] mx-auto px-3 sm:px-6 4xl:px-0">
                <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-start">

                    {/* Chap taraf: Ma'lumotlar */}
                    <div className="lg:sticky lg:top-24">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                        >
                            <h2 className="text-5xl md:text-7xl font-bold mb-8 tracking-tighter text-slate-900 leading-[1.1]">
                                {intl.formatMessage({ id: "contact.title" })}
                            </h2>
                            <p className="text-xl text-slate-500 mb-12 max-w-md leading-relaxed">
                                {intl.formatMessage({ id: "contact.desc" })}
                            </p>

                            <div className="grid gap-6">
                                {[
                                    { icon: Phone, label: "Telefon", value: "+998 94 755 14 44", color: "bg-blue-50 text-blue-600", url: "tel:" },
                                    { icon: Mail, label: "Email", value: "info@mikan.uz", color: "bg-orange-50 text-orange-600", url: "mailto:" },
                                    { icon: MapPin, label: "Manzil", value: "Toshkent, Alixon To'ra Sog'uniy ko'chasi, 44-uy.", color: "bg-emerald-50 text-emerald-600", url: "#" }
                                ].map((item, i) => (
                                    <div key={i} className="flex items-center gap-5 p-4 rounded-2xl border border-slate-50 hover:border-slate-200 transition-colors">
                                        <div className={`w-12 h-12 ${item.color} rounded-xl flex items-center justify-center`}>
                                            <item.icon size={22} />
                                        </div>
                                        <div>
                                            <p className="text-[10px] uppercase font-black tracking-widest text-slate-400 mb-0.5">{
                                                intl.formatMessage({ id: item.label })}</p>
                                            <a href={`${item?.url}${item?.value}`} className="text-lg hover:text-orange-500 font-bold text-slate-900">{item.value}</a>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    </div>

                    {/* O'ng taraf: Forma */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="relative"
                    >
                        <div className="absolute inset-0 bg-orange-500/5 blur-[120px] -z-10 rounded-full" />

                        <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-8 md:p-12 rounded-[2.5rem] border border-slate-100 shadow-2xl shadow-slate-200/50">

                            {/* User Type Switcher */}
                            <div className="flex bg-slate-50 p-1.5 rounded-2xl mb-10 border border-slate-100">
                                {['user', 'center'].map((type) => (
                                    <label key={type} className={`flex-1 relative py-4 rounded-xl cursor-pointer transition-all duration-300 ${userType === type ? 'bg-white shadow-sm' : ''}`}>
                                        <input type="radio" value={type} {...register("user_type")} className="hidden" />
                                        <span className={`block text-center text-sm font-black uppercase tracking-wider ${userType === type ? 'text-orange-600' : 'text-slate-400'}`}>
                                            {intl.formatMessage({ id: `contact.type_${type}` })}
                                        </span>
                                    </label>
                                ))}
                            </div>

                            <div className="space-y-6">
                                <AnimatePresence mode="wait">
                                    {userType === 'center' && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            className="relative"
                                        >
                                            <input
                                                {...register("center_name", { required: userType === 'center' })}
                                                className="w-full px-6 py-5 bg-slate-50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:bg-white border border-transparent focus:border-orange-500 transition-all font-bold text-slate-900 placeholder:text-slate-400"
                                                placeholder={intl.formatMessage({ id: "contact.ph_center" })}
                                            />
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                <input
                                    {...register("full_name", { required: true })}
                                    className="w-full px-6 py-5 bg-slate-50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:bg-white border border-transparent focus:border-orange-500 transition-all font-bold text-slate-900 placeholder:text-slate-400"
                                    placeholder={intl.formatMessage({ id: "contact.ph_name" })}
                                />

                                <input
                                    {...register("phone_number", { required: true })}
                                    className="w-full px-6 py-5 bg-slate-50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:bg-white border border-transparent focus:border-orange-500 transition-all font-bold text-slate-900 placeholder:text-slate-400"
                                    placeholder={intl.formatMessage({ id: "contact.ph_phone" })}
                                />

                                <textarea
                                    {...register("message")}
                                    className="w-full px-6 py-5 bg-slate-50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:bg-white border border-transparent focus:border-orange-500 transition-all font-bold text-slate-900 placeholder:text-slate-400 min-h-[150px] resize-none"
                                    placeholder={intl.formatMessage({ id: "contact.ph_msg" })}
                                />
                            </div>

                            <button
                                disabled={isSubmitting}
                                className="w-full mt-10 h-18 py-5 bg-slate-950 text-white rounded-2xl font-black hover:bg-orange-600 transition-all uppercase tracking-[0.2em] text-sm shadow-xl shadow-slate-950/10 flex items-center justify-center gap-3 active:scale-[0.98] disabled:opacity-70"
                            >
                                {isSubmitting ? (
                                    <Loader2 className="animate-spin" size={20} />
                                ) : (
                                    <>
                                        {intl.formatMessage({ id: "contact.btn_send" })}
                                        <Send size={18} />
                                    </>
                                )}
                            </button>
                        </form>
                    </motion.div>
                </div>
            </div>
        </section>
    )
}