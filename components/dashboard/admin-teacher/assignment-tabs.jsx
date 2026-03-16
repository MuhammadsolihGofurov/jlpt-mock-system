import Link from "next/link";
import { useRouter } from "next/router";
import { FileText, GraduationCap } from "lucide-react"; // Ikonkalar uchun
import { useIntl } from "react-intl";

const AssignmentTabs = () => {
  const router = useRouter();
  const intl = useIntl();

  const isActive = (path) => router.pathname.includes(path);

  const tabs = [
    {
      id: "exam",
      label: "Imtihonlar",
      path: "/dashboard/assignments/exam",
      icon: <GraduationCap size={20} />,
    },
    {
      id: "homework",
      label: "Vazifalar",
      path: "/dashboard/assignments/homework",
      icon: <FileText size={20} />,
    },
  ];

  return (
    <div className="flex items-center gap-2 p-1.5 bg-gray-100/50 rounded-[22px] w-fit border border-gray-100">
      {tabs.map((tab) => {
        const active = isActive(tab.path);

        return (
          <Link
            key={tab.id}
            href={tab.path}
            className={`
              flex items-center gap-2.5 px-6 py-3 rounded-[18px] font-bold text-sm transition-all duration-300
              ${
                active
                  ? "bg-white text-primary shadow-sm shadow-orange-100 scale-[1.02]"
                  : "text-muted hover:text-heading hover:bg-gray-50"
              }
            `}
          >
            <span className={active ? "text-primary" : "text-gray-400"}>
              {tab.icon}
            </span>
            {intl.formatMessage({ id: tab.label }) || tab.label}
          </Link>
        );
      })}
    </div>
  );
};

export default AssignmentTabs;
