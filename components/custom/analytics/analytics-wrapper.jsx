import {
  Building2,
  Users2,
  LayoutGrid,
  GraduationCap,
  BookOpen,
  ClipboardCheck,
  Star,
  Calendar,
  TrendingUp,
  ArrowUpRight,
  Award,
  Zap,
  Target,
} from "lucide-react";

import useSWR from "swr";
import { useSelector } from "react-redux";
import { getAnalyticsUrl } from "./fetcher-analytics";
import StatCard from "./stat-card";
import fetcher from "@/utils/fetcher";
import { useRouter } from "next/router";
import RecentRequests from "./recently-requests";
import {
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip as ChartTooltip
} from "recharts";
import { useIntl } from "react-intl";
import { EmptyMessage } from "../message";

const AnalyticsContainer = () => {
  const { user, loading: loading } = useSelector((state) => state.auth);
  const router = useRouter();
  const intl = useIntl();

  const role = user?.role;

  const apiUrl = getAnalyticsUrl(role);

  const shouldFetch = !loading && user && role && apiUrl;

  const {
    data: data,
    error,
    isLoading,
  } = useSWR(shouldFetch ? [apiUrl, router.locale] : null, (url, locale) =>
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

  if (loading || isLoading) return <AnalyticsSkeleton />;

  if (!user || !role) return null;

  // if (isLoading) return <AnalyticsSkeleton />;

  if (error)
    return (
      <div className="text-red-500 p-4 bg-red-50 rounded-2xl">
        {intl.formatMessage({ id: "Analitika yuklashda xatolik yuz berdi." })}
      </div>
    );

  // 5. Ma'lumot tayyor
  switch (role) {
    case "OWNER":
    case "CENTER_ADMIN":
      return <AdminAnalytics data={data} role={role} />;
    case "TEACHER":
    case "STUDENT":
      return <UserAnalytics data={data} role={role} />;
    default:
      return null;
  }
};

const AnalyticsSkeleton = () => (
  <div className="animate-pulse grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
    {[1, 2, 3, 4].map((i) => (
      <div key={i} className="h-32 bg-gray-100 rounded-3xl" />
    ))}
  </div>
);

export default AnalyticsContainer;


const UserAnalytics = ({ data, role }) => {
  const intl = useIntl();
  const isAllZero = data?.skill_performance?.every((skill) => skill.average_score === 0);

  // Skill darajasini aniqlash uchun yordamchi funksiya
  const getSkillLevel = (score) => {
    if (score >= 90) return { label: "Master", color: "text-emerald-500", bg: "bg-emerald-50" };
    if (score >= 70) return { label: "Advanced", color: "text-blue-500", bg: "bg-blue-50" };
    if (score >= 40) return { label: "Intermediate", color: "text-orange-500", bg: "bg-orange-50" };
    return { label: "Beginner", color: "text-slate-400", bg: "bg-slate-50" };
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title={role === "TEACHER" ? "Mening guruhlarim" : "O'rtacha ball"}
          value={role === "TEACHER" ? data?.my_groups_count : data?.average_score}
          icon={role === "TEACHER" ? LayoutGrid : Star}
        />
        <StatCard
          title={role === "TEACHER" ? "O'quvchilarim" : "Tugallangan testlar"}
          value={role === "TEACHER" ? data?.total_students : data?.completed_exams_count}
          icon={GraduationCap}
        />
        <StatCard
          title={role === "TEACHER" ? "Tekshirilishi kerak" : "Topshiriqlar"}
          value={role === "TEACHER" ? data?.pending_grading_count : data?.upcoming_deadlines?.length}
          icon={role === "TEACHER" ? ClipboardCheck : Calendar}
        />
        <StatCard
          title="O'sish dinamikasi"
          value={data?.growth_pct || "12%"}
          icon={TrendingUp}
          trend="up"
        />
      </div>

      {role === "STUDENT" && data?.skill_performance && (
        <>
          {isAllZero ? (
            <EmptyMessage
              titleKey="Hali natijalar mavjud emas"
              descriptionKey="Ko'nikmalaringiz tahlilini ko'rish uchun kamida bitta test yeching."
              iconKey="exams"
            />
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
              {/* Radar Chart - Vizual Balans */}
              <div className="lg:col-span-3 bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                  <Target size={120} />
                </div>

                <div className="relative z-10">
                  <h3 className="text-xl font-black text-heading mb-2 flex items-center gap-2">
                    <Zap className="text-primary" size={24} fill="currentColor" />
                    {intl.formatMessage({ id: "Ko'nikmalar balansi" })}
                  </h3>
                  <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-8">
                    {intl.formatMessage({ id: "Sizning kuchli va zaif tomonlaringiz xaritasi" })}
                  </p>
                </div>

                <div className="h-[350px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data.skill_performance}>
                      <PolarGrid stroke="#e2e8f0" strokeDasharray="3 3" />
                      <PolarAngleAxis
                        dataKey="skill_name"
                        tick={{ fill: "#64748b", fontSize: 11, fontWeight: 800 }}
                      />
                      <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                      <Radar
                        name={intl.formatMessage({ id: "Natija" })}
                        dataKey="average_score"
                        stroke="#FF6B00"
                        strokeWidth={3}
                        fill="url(#radarGradient)"
                        fillOpacity={0.6}
                        dot={{ r: 4, fill: "#FF6B00", strokeWidth: 2, stroke: "#fff" }}
                      />
                      <defs>
                        <linearGradient id="radarGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#FF6B00" stopOpacity={0.8} />
                          <stop offset="95%" stopColor="#FF8533" stopOpacity={0.2} />
                        </linearGradient>
                      </defs>
                      <ChartTooltip
                        contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontWeight: 'bold' }}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Skill Details - Interaktiv Kartalar */}
              <div className="lg:col-span-2 space-y-4">
                <div className="bg-slate-900 p-8 rounded-[3rem] text-white relative overflow-hidden">
                  <Award className="absolute -bottom-4 -right-4 text-white/10" size={100} />
                  <h4 className="text-sm font-black uppercase tracking-[0.2em] text-white/50 mb-1">{intl.formatMessage({ id: "Eng yuqori ko'rsatkich" })}</h4>
                  <div className="flex items-end gap-2">
                    <span className="text-4xl font-black italic">
                      {Math.max(...data.skill_performance.map(s => s.average_score))}%
                    </span>
                    <span className="text-primary font-bold text-sm mb-1 uppercase">
                      {data.skill_performance.reduce((prev, current) => (prev.average_score > current.average_score) ? prev : current).skill_name}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  {data.skill_performance.map((skill, index) => {
                    const level = getSkillLevel(skill.average_score);
                    return (
                      <div key={index} className="bg-white p-5 rounded-[2rem] border border-slate-100 shadow-sm hover:border-primary/30 transition-all group">
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-xl ${level.bg} ${level.color}`}>
                              <BookOpen size={18} />
                            </div>
                            <div>
                              <h5 className="font-black text-slate-800 text-sm">{intl.formatMessage({ id: skill.skill_name })}</h5>
                              <span className={`text-[10px] font-black uppercase tracking-tighter ${level.color}`}>
                                {intl.formatMessage({ id: level.label })}
                              </span>
                            </div>
                          </div>
                          <div className="flex flex-col items-end">
                            <span className="text-lg font-black text-slate-900 leading-none">
                              {skill.average_score}%
                            </span>
                            <div className="flex items-center text-[10px] text-emerald-500 font-bold">
                              <ArrowUpRight size={10} /> 2.4%
                            </div>
                          </div>
                        </div>
                        <div className="relative w-full h-2 bg-slate-50 rounded-full overflow-hidden">
                          <div
                            className="absolute top-0 left-0 h-full bg-primary rounded-full transition-all duration-1000 group-hover:brightness-110"
                            style={{ width: `${skill.average_score}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

const AdminAnalytics = ({ data, role }) => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        title={role === "OWNER" ? "Jami markazlar" : "Jami o'quvchilar"}
        value={data?.total_centers || data?.total_students}
        icon={role === "OWNER" ? Building2 : GraduationCap}
      />
      <StatCard
        title={
          role === "OWNER" ? "Jami foydalanuvchilar" : "Jami o'qituvchilar"
        }
        value={data?.total_users || data?.total_teachers}
        icon={Users2}
      />
      <StatCard
        title={role === "OWNER" ? "Aktiv markazlar" : "Jami guruhlar"}
        value={data?.active_centers_count || data?.total_groups}
        icon={LayoutGrid}
      />
      <StatCard
        title="O'sish ko'rsatkichi"
        value={data?.growth_centers_pct || data?.growth_students_pct || "0"}
        icon={TrendingUp}
      />
    </div>

    {data?.recent_contact_requests && (
      <div className="mt-8">
        <RecentRequests requests={data.recent_contact_requests} />
      </div>
    )}
  </div>
);
