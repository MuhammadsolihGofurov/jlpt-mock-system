import Link from "next/link";
import { useRouter } from "next/router";
import Image from "next/image";

const tabs = [
   {
      label: "Home",
      href: "/",
      icon: (
         <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0a1 1 0 01-1-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 01-1 1m-2 0h2" />
         </svg>
      ),
   },
   {
      label: "Tests",
      href: "/tests",
      icon: (
         <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
         </svg>
      ),
   },
   {
      label: "Results",
      href: "/results",
      icon: (
         <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
         </svg>
      ),
   },
   {
      label: "Profile",
      href: "/profile",
      icon: (
         <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
         </svg>
      ),
   },
];

const Sidebar = () => {
   const router = useRouter();

   const isActive = (href) => {
      if (href === "/") return router.pathname === "/";
      return router.pathname.startsWith(href);
   };

   return (
      <aside className="hidden md:flex fixed left-0 top-0 h-screen w-[240px] flex-col border-r border-gray-200 bg-white z-50">
         {/* Logo */}
         <div className="flex items-center gap-2 px-6 py-6">
            <Image src="/mikan-logo.svg" alt="Mikan" width={36} height={36} />
            <span className="text-xl font-bold text-gray-800">Mikan.uz</span>
         </div>

         {/* Nav Items */}
         <nav className="flex flex-col gap-1 px-3 mt-2">
            {tabs.map((tab) => {
               const active = isActive(tab.href);
               return (
                  <Link
                     key={tab.href}
                     href={tab.href}
                     className={`flex items-center gap-3 rounded-xl px-4 py-3 no-underline transition-colors ${
                        active
                           ? "bg-primary-50 text-primary font-bold"
                           : "text-gray-500 hover:bg-gray-50 font-medium"
                     }`}
                  >
                     <span className={`flex h-8 w-8 items-center justify-center ${active ? "text-primary" : "text-gray-400"}`}>
                        {tab.icon}
                     </span>
                     <span className="text-sm">{tab.label}</span>
                  </Link>
               );
            })}
         </nav>
      </aside>
   );
};

export default Sidebar;
