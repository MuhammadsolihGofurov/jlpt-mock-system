import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import Link from "next/link";
import Image from "next/image";
import {
  Home,
  BookOpen,
  BarChart3,
  User2,
  LogOut,
  ChevronRight,
  Users2,
  Building2,
  Settings,
  ShieldCheck,
  SubscriptIcon,
  CircleDollarSign,
  Bell,
} from "lucide-react";
import { logout } from "@/redux/slice/auth";
import { closeSidebar } from "@/redux/slice/ui";
import { useIntl } from "react-intl";
import { SidebarSkeleton } from "../skeleton";
import { menus } from "./menu-links";
import { authAxios } from "@/utils/axios";
import { useModal } from "@/context/modal-context";

// Roles: OWNER, CENTER_ADMIN, TEACHER, STUDENT
// const tabs = [
//   {
//     label: "Bosh sahifa",
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
//     label: "O'qituvchilar",
//     href: "/dashboard/teachers",
//     icon: Users2,
//     roles: ["CENTER_ADMIN", "OWNER"],
//   },
//   {
//     label: "Testlar",
//     href: "/dashboard/tests",
//     icon: BookOpen,
//     roles: ["TEACHER", "STUDENT", "CENTER_ADMIN"],
//   },
//   {
//     label: "Natijalar",
//     href: "/dashboard/results",
//     icon: BarChart3,
//     roles: ["STUDENT", "TEACHER", "CENTER_ADMIN"],
//   },
//   {
//     label: "Profil",
//     href: "/dashboard/profile",
//     icon: User2,
//     roles: ["OWNER", "CENTER_ADMIN", "TEACHER", "STUDENT"],
//   },
//   {
//     label: "Sozlamalar",
//     href: "/dashboard/settings",
//     icon: Settings,
//     roles: ["OWNER", "CENTER_ADMIN"],
//   },
// ];

const Sidebar = () => {
  const router = useRouter();
  const { openModal } = useModal();
  const intl = useIntl();
  const dispatch = useDispatch();
  const { isSidebarOpen } = useSelector((state) => state.ui);
  const { user, loading } = useSelector((state) => state.auth);

  const role = user?.role;

  // Active mantiqi:
  const checkActive = (href) => {
    if (href === "/dashboard") {
      return router.pathname === "/dashboard";
    }
    return router.pathname.startsWith(href);
  };

  const filteredTabs = menus.filter((tab) => tab.roles.includes(role));

  if (loading) return <SidebarSkeleton />;

  const handleLogout = () => {
    openModal(
      "CONFIRM_MODAL",
      {
        title: "Chiqish",
        body: "Tizimdan chiqmoqchimisiz? Tizimga qayta kirishingiz uchun login sahifasiga o'tishingiz kerak.",
        confirmText: "Ha",
        variant: "danger",
        local: "clear",
        onConfirm: async () => {
          const refresh = localStorage.getItem("refresh");
          return await authAxios.post(`/auth/logout/`, { refresh });
        },
      },
      "small",
    );
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-[60] md:hidden transition-opacity"
          onClick={() => dispatch(closeSidebar())}
        />
      )}

      <aside
        className={`
          fixed left-0 top-0 h-screen w-[260px] bg-white border-r border-gray-100 z-[70] 
          transition-all duration-300 ease-in-out flex flex-col
          ${isSidebarOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"} md:translate-x-0
        `}
      >
        {/* Logo Section */}
        <div className="pl-5 pr-2 py-5 flex items-center justify-between">
          <Link href={"/dashboard"} className="flex items-center gap-1">
            <div className="w-10 sm:w-14">
              <img
                src="/mikan-logo.svg"
                alt="Logo"
                width={60}
                height={60}
                style={{ height: 'auto' }}
              />
            </div>
            <div className='w-14 sm:w-[100px]'>
              <img
                src="/images/mikan-logo-text.svg"
                alt="Logo"
                width={80}
                height={80}
                style={{ height: 'auto' }}
              />
            </div>
          </Link>

          {/* Yangi Notification Icon */}
          <Link
            href="/dashboard/notifications"
            className="relative sm:flex hidden p-2.5 rounded-xl bg-gray-50 text-gray-400 hover:text-orange-500 hover:bg-orange-50 transition-all"
            title={intl.formatMessage({ id: "Bildirishnomalar" })}
          >
            <Bell size={20} className="" />
            <span className="absolute top-2 right-3 w-2 h-2 bg-red-500 text-white text-[10px] font-black rounded-full border-2 border-white flex items-center justify-center"></span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto custom-scrollbar">
          {filteredTabs.map((tab) => {
            const active = checkActive(tab.href);
            const Icon = tab.icon;

            return (
              <Link
                key={tab.href}
                href={tab.href}
                onClick={() => dispatch(closeSidebar())}
                className={`
                  group relative flex items-center justify-between rounded-2xl px-4 py-3.5 transition-all duration-200
                  ${active
                    ? "bg-orange-500 text-white shadow-md shadow-orange-100"
                    : "text-gray-500 hover:bg-orange-50 hover:text-orange-600"
                  }
                `}
              >
                <div className="flex items-center gap-3.5">
                  <Icon
                    size={20}
                    strokeWidth={active ? 2.5 : 2}
                    className={
                      active
                        ? "text-white"
                        : "text-gray-400 group-hover:text-orange-500"
                    }
                  />
                  <span className="text-[15px] font-bold">
                    {intl.formatMessage({ id: tab.label })}
                  </span>
                </div>

                {active && <ChevronRight size={16} className="opacity-70" />}

                {/* Active indicator bar */}
                {active && (
                  <div className="absolute left-0 w-1 h-6 bg-white rounded-r-full" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* User Role Badge & Logout */}
        <div className="p-4 mt-auto space-y-3">
          {user && (
            <div className="mx-2 p-3 bg-gray-50 rounded-2xl border border-gray-100 flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-white border border-gray-200 flex items-center justify-center text-orange-500">
                <ShieldCheck size={20} />
              </div>
              <div className="overflow-hidden">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">
                  {intl.formatMessage({ id: "Roli" })}
                </p>
                <p className="text-[13px] font-black text-gray-800 leading-none mt-1 truncate">
                  {role}
                </p>
              </div>
            </div>
          )}

          <button
            onClick={handleLogout}
            className="group flex w-full items-center gap-3 px-5 py-3.5 rounded-2xl text-gray-500 hover:text-red-600 hover:bg-red-50 transition-all duration-200 font-bold"
          >
            <LogOut
              size={20}
              className="group-hover:rotate-12 transition-transform"
            />
            <span className="text-[15px]">
              {intl.formatMessage({ id: "Chiqish" })}
            </span>
          </button>
        </div>
      </aside >
    </>
  );
};

export default Sidebar;
