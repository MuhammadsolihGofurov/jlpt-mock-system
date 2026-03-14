import {
  BarChart3,
  BookOpen,
  Building2,
  CircleDollarSign,
  Home,
  Settings,
  User2,
  UserRoundKey,
  Users2,
} from "lucide-react";

export const menus = [
  {
    label: "Bosh sahifa",
    href: "/dashboard",
    icon: Home,
    roles: ["OWNER", "CENTER_ADMIN", "TEACHER", "STUDENT"],
    is_mobile: true,
  },
  {
    label: "Markazlar",
    href: "/dashboard/centers",
    icon: Building2,
    roles: ["OWNER"],
    is_mobile: true,
  },
  // {
  //   label: "Obunalar",
  //   href: "/dashboard/subscriptions",
  //   icon: CircleDollarSign,
  //   roles: ["OWNER"],
  //   is_mobile: true,
  // },
  {
    label: "Taklif kodlari",
    href: "/dashboard/invitations",
    icon: UserRoundKey,
    roles: ["CENTER_ADMIN"],
  },
  {
    label: "user_title",
    href: "/dashboard/users",
    icon: Users2,
    roles: ["CENTER_ADMIN"],
  },
  {
    label: "Testlar",
    href: "/dashboard/tests",
    icon: BookOpen,
    roles: ["TEACHER", "STUDENT", "CENTER_ADMIN"],
  },
  {
    label: "Natijalar",
    href: "/dashboard/results",
    icon: BarChart3,
    roles: ["STUDENT"],
  },
  {
    label: "Profil",
    href: "/dashboard/profile",
    icon: User2,
    roles: ["OWNER", "CENTER_ADMIN", "TEACHER", "STUDENT"],
  },
  {
    label: "Sozlamalar",
    href: "/dashboard/settings",
    icon: Settings,
    roles: ["OWNER", "CENTER_ADMIN"],
    is_mobile: true,
  },
];
