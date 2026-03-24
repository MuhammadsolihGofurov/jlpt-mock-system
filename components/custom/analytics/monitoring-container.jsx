import React, { useMemo } from "react";
import useSWR from "swr";
import { useRouter } from "next/router";
import {
    Server, Database, HardDrive, Activity,
    Box, Users, Cpu, Thermometer
} from "lucide-react";
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid,
    Tooltip, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area
} from "recharts";
import fetcher from "@/utils/fetcher";
import { useIntl } from "react-intl";

// Yordamchi ranglar
const COLORS = ["#f97316", "#0ea5e9", "#22c55e", "#a855f7", "#64748b"];

const MonitoringContainer = () => {
    const router = useRouter();
    const intl = useIntl();

    // Barcha API so'rovlarini parallel yuboramiz
    const {
        data: system,
    } = useSWR([`/monitoring/system/`, router.locale], (url, locale) =>
        fetcher(
            url,
            {
                headers: {
                    "Accept-Language": locale,
                },
            },
            {},
            true,
        ),
    );
    const {
        data: docker,
    } = useSWR([`/monitoring/docker/`, router.locale], (url, locale) =>
        fetcher(
            url,
            {
                headers: {
                    "Accept-Language": locale,
                },
            },
            {},
            true,
        ),
    );
    const {
        data: tenants,
    } = useSWR([`/monitoring/tenants-overview/`, router.locale], (url, locale) =>
        fetcher(
            url,
            {
                headers: {
                    "Accept-Language": locale,
                },
            },
            {},
            true,
        ),
    );
    const {
        data: postgres,
    } = useSWR([`/monitoring/postgres/`, router.locale], (url, locale) =>
        fetcher(
            url,
            {
                headers: {
                    "Accept-Language": locale,
                },
            },
            {},
            true,
        ),
    );

    // Ma'lumotlarni grafiklar uchun tayyorlash (useMemo rerenderlarni oldini oladi)
    const tenantChartData = useMemo(() => {
        if (!tenants?.tenants) return [];
        return tenants.tenants.map(t => ({
            name: t.center_name,
            db: parseFloat(t.db_size),
            s3: parseFloat(t.s3_size),
            users: t.user_count
        }));
    }, [tenants]);

    const memoryData = useMemo(() => {
        if (!system?.memory) return [];
        return [
            { name: "Used", value: parseFloat(system.memory.used) },
            { name: "Available", value: parseFloat(system.memory.available) }
        ];
    }, [system]);

    return (
        <div className="p-4 space-y-6 bg-slate-50/50 min-h-screen">
            {/* 1-QATOR: ASOSIY KPI'LAR */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                    title="CPU Load"
                    value={system?.cpu_percent || "0%"}
                    desc={`Avg: ${system?.load_average?.["1_min"]}`}
                    icon={<Cpu className="text-orange-500" />}
                />
                <StatCard
                    title="Memory"
                    value={system?.memory?.percent_used || "0%"}
                    desc={`${system?.memory?.used} / ${system?.memory?.total}`}
                    icon={<Activity className="text-blue-500" />}
                />
                <StatCard
                    title="Postgres Connections"
                    value={postgres?.active_connections || 0}
                    desc={`Cache Hit: ${postgres?.cache_hit_ratio_percent}`}
                    icon={<Database className="text-emerald-500" />}
                />
                <StatCard
                    title="Root Disk"
                    value={system?.disk_root?.percent_used || "0%"}
                    desc={`${system?.disk_root?.used} used`}
                    icon={<HardDrive className="text-purple-500" />}
                />
            </div>

            <div className="grid grid-cols-1 gap-6">
                {/* TENANTS RESURS TAHLILI */}
                <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                    <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                        <Users size={20} className="text-orange-500" /> {intl.formatMessage({ id: "Markazlar Resurs Analitikasi" })} (MB)
                    </h3>
                    <div className="h-[350px] w-full">
                        <ResponsiveContainer>
                            <BarChart data={tenantChartData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} fontSize={12} />
                                <YAxis axisLine={false} tickLine={false} fontSize={12} />
                                <Tooltip
                                    cursor={{ fill: '#f8fafc' }}
                                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                />
                                <Bar dataKey="db" name="Database (MB)" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
                                <Bar dataKey="s3" name="S3 Storage (MB)" fill="#f97316" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* MEMORY PIE CHART */}
                <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                    <h3 className="text-lg font-bold mb-6">Operativ Xotira</h3>
                    <div className="h-[250px] w-full">
                        <ResponsiveContainer>
                            <PieChart>
                                <Pie data={memoryData} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                                    {memoryData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="mt-4 space-y-2">
                        <div className="flex justify-between text-sm">
                            <span className="text-slate-500">Jami:</span>
                            <span className="font-bold">{system?.memory?.total}</span>
                        </div>
                        <div className="flex justify-between text-sm text-blue-500">
                            <span>Bo'sh:</span>
                            <span className="font-bold">{system?.memory?.available}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* DOCKER CONTAINERS TABLE */}
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-50 flex justify-between items-center">
                    <h3 className="text-lg font-bold flex items-center gap-2">
                        <Box size={20} className="text-blue-500" /> {intl.formatMessage({ id: "Docker Konteynerlar" })}
                    </h3>
                    <span className="text-xs font-mono text-slate-400">{docker?._docker_bin}</span>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50 text-[11px] uppercase tracking-wider text-slate-500">
                                <th className="px-6 py-4">{intl.formatMessage({ id: "Konteyner" })}</th>
                                <th className="px-6 py-4">{intl.formatMessage({ id: "Holat" })}</th>
                                <th className="px-6 py-4">{intl.formatMessage({ id: "CPU" })} %</th>
                                <th className="px-6 py-4">{intl.formatMessage({ id: "Memory usage" })}</th>
                                <th className="px-6 py-4">{intl.formatMessage({ id: "Uptime" })}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {docker?.containers?.map((container, idx) => (
                                <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="px-6 py-4 font-bold text-slate-700">{container.name}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${container.status === 'running' ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'}`}>
                                            {container.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm font-mono">{container.cpu_percent}</td>
                                    <td className="px-6 py-4 text-sm text-slate-500">{container.mem_usage}</td>
                                    <td className="px-6 py-4 text-sm text-slate-400 italic">{container.uptime}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

// Kichik yordamchi komponentlar (Rerender bo'lmasligi uchun React.memo ishlatish mumkin)
const StatCard = React.memo(({ title, value, desc, icon }) => (
    <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-slate-50 rounded-2xl">{icon}</div>
        </div>
        <div>
            <p className="text-sm font-medium text-slate-400 mb-1">{title}</p>
            <h4 className="text-2xl font-black text-slate-900">{value}</h4>
            <p className="text-[11px] text-slate-400 mt-2 font-mono uppercase">{desc}</p>
        </div>
    </div>
));

StatCard.displayName = "StatCard";

export default MonitoringContainer;