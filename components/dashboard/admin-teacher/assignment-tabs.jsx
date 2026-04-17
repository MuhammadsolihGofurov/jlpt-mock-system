import Link from "next/link";
import { useRouter } from "next/router";
import { FileText, GraduationCap } from "lucide-react"; // Ikonkalar uchun
import { useIntl } from "react-intl";

const AssignmentTabs = ({ tabs = [], query_name = false, customLoading }) => {
  const router = useRouter();
  const intl = useIntl();

  const checkActive = (tab) => {
    if (query_name) {
      return String(router.query[query_name]) === String(tab.id);
    }

    const currentPath = router.asPath.split('?')[0];

    const normalize = (p) => p?.replace(/\/+$/, "") || "";

    return normalize(currentPath) === normalize(tab.path);
  };

  if (customLoading) {
    return <AssignmentTabsSkeleton />
  }

  return (
    <div className="flex items-center flex-wrap gap-2 p-1.5 bg-gray-100/50 rounded-[22px] w-fit border border-gray-100">
      {tabs.map((tab) => {
        const active = checkActive(tab);
        // Href manzilini shakllantirish
        const href = tab.path ? tab.path : { query: { ...router.query, [query_name]: tab.id } };

        return (
          <Link
            key={tab.id}
            href={href}
            shallow={!!query_name}
            className={`
              flex items-center gap-2.5 px-6 py-3 rounded-[18px] font-bold text-sm transition-all duration-300
              ${active
                ? "bg-white text-primary shadow-sm shadow-orange-100 scale-[1.02]"
                : "text-muted hover:text-heading hover:bg-gray-50"
              }
            `}
          >
            {
              tab.icon && <span className={active ? "text-primary" : "text-gray-400"}>
                {tab.icon}
              </span>
            }
            {tab.label ? intl.formatMessage({ id: tab.label }) || tab.label : tab.name}
          </Link>
        );
      })}
    </div>
  );
};

export default AssignmentTabs;


// skeleton
export const AssignmentTabsSkeleton = ({ count = 3 }) => {
  return (
    <div className="flex items-center flex-wrap gap-2 p-1.5 bg-gray-100/30 rounded-[22px] w-fit border border-gray-100 animate-pulse">
      {[...Array(count)].map((_, i) => (
        <div
          key={i}
          className={`
            flex items-center gap-2.5 px-6 py-3 rounded-[18px] min-w-[140px]
            ${i === 0
              ? "bg-white shadow-sm shadow-orange-50 border border-orange-100/50"
              : "bg-gray-50/50"}
          `}
        >
          {/* Icon skeleton - och orange rangda */}
          <div className="w-5 h-5 rounded-md bg-orange-100/60" />

          {/* Text skeleton */}
          <div className={`h-4 rounded-md ${i === 0 ? "bg-orange-200/50 w-20" : "bg-gray-200/60 w-24"}`} />
        </div>
      ))}
    </div>
  );
};

