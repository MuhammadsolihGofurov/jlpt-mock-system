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
} from "lucide-react";

import useSWR from "swr";
import { useSelector } from "react-redux";
import { getAnalyticsUrl } from "./fetcher-analytics";
import StatCard from "./stat-card";
import fetcher from "@/utils/fetcher";
import { useRouter } from "next/router";
import RecentRequests from "./recently-requests";

const AnalyticsContainer = () => {
  const { user, loading: loading } = useSelector((state) => state.auth);
  const router = useRouter();

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

  if (isLoading) return <AnalyticsSkeleton />;

  if (error)
    return (
      <div className="text-red-500 p-4 bg-red-50 rounded-2xl">
        Analitika yuklashda xatolik yuz berdi.
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

const UserAnalytics = ({ data, role }) => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        title={role === "TEACHER" ? "Mening guruhlarim" : "O'rtacha ball"}
        value={role === "TEACHER" ? data?.my_groups_count : data?.average_score}
        icon={role === "TEACHER" ? LayoutGrid : Star}
      />
      <StatCard
        title={role === "TEACHER" ? "O'quvchilarim" : "Tugallangan testlar"}
        value={
          role === "TEACHER"
            ? data?.total_students
            : data?.completed_exams_count
        }
        icon={GraduationCap}
      />
      <StatCard
        title={
          role === "TEACHER"
            ? "Tekshirilishi kerak"
            : "Yaqinlashayotgan muddatlar"
        }
        value={
          role === "TEACHER"
            ? data?.pending_grading_count
            : data?.upcoming_deadlines?.length
        }
        icon={role === "TEACHER" ? ClipboardCheck : Calendar}
      />
    </div>

    {/* Student skill performance visualization */}
    {role === "STUDENT" && data?.skill_performance && (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Chart component here */}
      </div>
    )}
  </div>
);

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
