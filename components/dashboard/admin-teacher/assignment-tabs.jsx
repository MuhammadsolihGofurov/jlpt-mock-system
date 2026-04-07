import Link from "next/link";
import { useRouter } from "next/router";
import { FileText, GraduationCap } from "lucide-react"; // Ikonkalar uchun
import { useIntl } from "react-intl";

const AssignmentTabs = ({ tabs = [], query_name = false }) => {
  const router = useRouter();
  const intl = useIntl();

  const checkActive = (tab) => {
    if (query_name) {
      return String(router.query[query_name]) === String(tab.id);
    }
    return router.pathname.includes(tab.path);
  };

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
