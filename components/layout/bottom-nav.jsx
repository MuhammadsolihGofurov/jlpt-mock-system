import Link from "next/link";
import { useRouter } from "next/router";
import {
  Home,
  BookOpen,
  BarChart3,
  User2,
  Building2,
  CircleDollarSign,
} from "lucide-react";
import { useSelector } from "react-redux";
import { menus } from "./menu-links";
import { useIntl } from "react-intl";

// const tabs = [
//   {
//     label: "Asosiy",
//     href: "/dashboard",
//     icon: Home,
//     roles: ["OWNER", "CENTER_ADMIN", "TEACHER", "STUDENT"],
//   },
//   {
//     label: "Markazlar",
//     href: "/dashboard/centers",
//     icon: Building2,
//     roles: ["OWNER"],
//   },
//   {
//     label: "Obunalar",
//     href: "/dashboard/subscriptions",
//     icon: CircleDollarSign,
//     roles: ["OWNER"],
//   },
//   {
//     label: "Testlar",
//     href: "/dashboard/tests",
//     icon: BookOpen,
//     roles: ["CENTER_ADMIN", "TEACHER", "STUDENT"],
//   },
//   {
//     label: "Natijalar",
//     href: "/dashboard/results",
//     icon: BarChart3,
//     roles: ["CENTER_ADMIN", "TEACHER", "STUDENT"],
//   },
//   {
//     label: "Profil",
//     href: "/dashboard/profile",
//     icon: User2,
//     roles: ["OWNER", "CENTER_ADMIN", "TEACHER", "STUDENT"],
//   },
// ];

const BottomNav = () => {
  const router = useRouter();
  const intl = useIntl();
  const { user } = useSelector((state) => state.auth);
  const role = user?.role;

  const isActive = (href) =>
    href === "/dashboard"
      ? router.pathname === "/dashboard"
      : router.pathname.startsWith(href);

  // Rolga qarab linklarni filtrlash (Sidebar bilan bir xil mantiq)
  const filteredTabs = menus.filter(
    (tab) => tab.roles.includes(role) && tab.is_mobile,
  );

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden px-2 pb-2 pt-2">
      {/* Glassmorphism Container */}
      <div className="mx-auto max-w-[500px] bg-white/80 backdrop-blur-xl border border-gray-100 shadow-[0_-8px_30px_rgb(0,0,0,0.04)] rounded-[2rem] px-2 py-2">
        <div className="flex items-center justify-around relative">
          {filteredTabs.map((tab) => {
            const active = isActive(tab.href);
            const Icon = tab.icon;

            return (
              <Link
                key={tab.href}
                href={tab.href}
                className="relative flex flex-col items-center py-1 group"
              >
                {/* Active Indicator Dot */}
                {active && (
                  <div className="absolute -top-1 w-1 h-1 bg-primary rounded-full" />
                )}

                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-2xl transition-all duration-300 ${
                    active
                      ? "bg-primary text-white shadow-lg shadow-orange-200 -translate-y-1"
                      : "text-muted hover:text-primary"
                  }`}
                >
                  <Icon size={20} strokeWidth={2} />
                </div>

                <span
                  className={`text-[10px] mt-1 font-bold transition-colors duration-300 ${
                    active ? "text-heading" : "text-muted"
                  }`}
                >
                  {intl.formatMessage({ id: tab.label })}
                </span>

                {/* Hover Background (for touch feedback) */}
                <div className="absolute inset-0 bg-gray-50 opacity-0 group-active:opacity-100 rounded-2xl -z-10 transition-opacity" />
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default BottomNav;
