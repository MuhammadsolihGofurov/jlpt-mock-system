import React, { useState } from "react";
import useSWR, { mutate } from "swr";
import { useIntl } from "react-intl";
import { Check, BellOff, Bell, ArrowRight, Circle } from "lucide-react";
import fetcher from "@/utils/fetcher";
import { authAxios } from "@/utils/axios";
import { getNotificationConfig } from "@/components/config/notification-config";
import { formatDateTime } from "@/utils/funcs";
import { useRouter } from "next/router";
import { useModal } from "@/context/modal-context";
import { AuthGuard } from "@/components/guard";
import { EmptyMessage } from "@/components/custom/message";
import { Pagination } from "@/components/ui";
import { Seo } from "@/components/seo";

const NotificationsPage = () => {
    const intl = useIntl();
    const router = useRouter();
    const { openModal } = useModal();
    const [filter, setFilter] = useState("all");
    const { page = 1 } = router.query;

    const { data: notifications, isLoading } = useSWR(
        [`notifications/`, router.locale, filter, page],
        (url, locale, fi, p) =>
            fetcher(`${url}?page=${p}${fi === "unread" ? "&is_read=false" : ""}&page_size=8`, { headers: { "Accept-Language": locale } }, {}, true),
    );

    const handleOpenDetail = (item) => {
        openModal("NOTIFY_MODAL", { data: item }, "middle");
        if (!item.is_read) {
            authAxios.patch(`notifications/${item.id}/`, { is_read: true })
                .then(() => mutate([`notifications/`, router.locale, filter, page]));
        }
    };

    return (
        <>
            <Seo
                title={`${intl.formatMessage({ id: "Inbox" })}`}
                description={`${intl.formatMessage({ id: "Inbox" })} ${notifications?.count} ta`}
                keywords={`${intl.formatMessage({ id: "Inbox" })} ${notifications?.count} ta`}
            />
            <AuthGuard roles={["CENTER_ADMIN", "OWNER", "STUDENT", "TEACHER"]}>
                <div className="pt-5 sm:py-10 sm:px-4">
                    {/* Ultra-modern Header */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-slate-200 pb-8 mb-8 gap-6">
                        <div>
                            <h1 className="text-3xl lg:text-5xl font-black text-slate-900 tracking-tighter flex items-center gap-4">
                                {intl.formatMessage({ id: "Inbox" })}
                                {notifications?.count > 0 && (
                                    <span className="text-xl font-medium text-slate-400">
                                        {notifications.count}
                                    </span>
                                )}
                            </h1>
                            <p className="text-slate-400 font-medium mt-2">{intl.formatMessage({ id: "Xabarlar va bildirishnomalar oqimi" })}</p>
                        </div>

                        <div className="flex items-center gap-4 bg-slate-100 p-1 rounded-2xl">
                            <button
                                onClick={() => setFilter("all")}
                                className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${filter === 'all' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
                            >
                                {intl.formatMessage({ id: "Barchasi" })}
                            </button>
                            <button
                                onClick={() => setFilter("unread")}
                                className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${filter === 'unread' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
                            >
                                {intl.formatMessage({ id: "O'qilmaganlar" })}
                            </button>
                        </div>
                    </div>

                    {/* List Section */}
                    <div className="divide-y divide-slate-100">
                        {isLoading ? (
                            [1, 2, 3, 4, 5].map(i => (
                                <div key={i} className="py-8 flex gap-6 animate-pulse">
                                    <div className="w-12 h-12 bg-slate-100 rounded-full" />
                                    <div className="flex-1 space-y-3">
                                        <div className="h-4 bg-slate-100 w-1/4 rounded" />
                                        <div className="h-6 bg-slate-100 w-3/4 rounded" />
                                    </div>
                                </div>
                            ))
                        ) : notifications?.results?.length > 0 ? (
                            notifications.results.map((item) => {
                                const config = getNotificationConfig(item.notification_type);
                                const Icon = config.icon;

                                return (
                                    <div
                                        key={item.id}
                                        onClick={() => handleOpenDetail(item)}
                                        className="group py-2 sm:py-6 flex items-start md:items-center gap-6 cursor-pointer hover:bg-slate-50/50 px-4 -mx-4 rounded-3xl transition-all duration-300"
                                    >
                                        {/* Status Dot */}
                                        <div className="mt-2 md:mt-0">
                                            {!item.is_read ? (
                                                <div className="w-3 h-3 bg-primary rounded-full shadow-[0_0_10px_rgba(255,102,0,0.5)]" />
                                            ) : (
                                                <div className="w-3 h-3 bg-slate-200 rounded-full" />
                                            )}
                                        </div>

                                        {/* Icon Container (Minimal) */}
                                        <div className={`hidden sm:flex p-3 rounded-2xl ${config.bg} ${config.color} bg-opacity-10`}>
                                            <Icon size={22} />
                                        </div>

                                        {/* Message Info */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-3 mb-1">
                                                <span className={`text-[11px] font-black uppercase tracking-widest ${config.color}`}>
                                                    {intl.formatMessage({ id: config.label })}
                                                </span>
                                                <span className="hidden md:block w-1 h-1 bg-slate-300 rounded-full" />
                                                <span className="text-xs font-medium text-slate-400">
                                                    {formatDateTime(item.created_at, intl.locale)}
                                                </span>
                                            </div>
                                            <h3 className={`text-sm sm:text-lg transition-all ${item.is_read ? 'text-slate-400 font-medium' : 'text-slate-900 font-bold group-hover:text-primary'}`}>
                                                {item.message}
                                            </h3>
                                        </div>

                                        {/* Hover Action */}
                                        <div className="opacity-0 group-hover:opacity-100 transition-all hidden md:block">
                                            <div className="bg-slate-900 text-white p-3 rounded-full shadow-lg">
                                                <ArrowRight size={18} />
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <EmptyMessage
                                titleKey="Hammasi joyida!"
                                descriptionKey="Hozircha sizda hech qanday yangi xabar yo'q."
                                iconKey="exams"
                            />
                        )}
                    </div>

                    {notifications?.count > 8 && (
                        <div className="pt-10 flex justify-center">
                            <Pagination totalCount={notifications.count} pageSize={8} />
                        </div>
                    )}

                    {/* Float Action Button for Mark All */}
                    {!isLoading && notifications?.results?.some(n => !n.is_read) && (
                        <div className="fixed bottom-10 right-10">
                            <button
                                onClick={(e) => { e.stopPropagation(); markAllAsRead(); }}
                                className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-black shadow-2xl flex items-center gap-3 hover:bg-primary transition-all active:scale-95"
                            >
                                <Check size={20} />
                                {intl.formatMessage({ id: "Hammasini o'qildi qilish" })}
                            </button>
                        </div>
                    )}
                </div>
            </AuthGuard>
        </>
    );
};

export default NotificationsPage;