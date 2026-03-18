import { toggleSidebar } from "@/redux/slice/ui";
import { Menu, Bell, Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";

const MobileHeader = () => {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);

  return (
    <header className="md:hidden sticky top-0 z-[50] flex items-center justify-between px-5 py-3 bg-white/80 backdrop-blur-xl border-b border-gray-100/50">
      {/* Chap tomonda Menu va Logo */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => dispatch(toggleSidebar())}
          className="p-2.5 rounded-2xl bg-gray-50 text-heading hover:bg-orange-50 hover:text-primary transition-all active:scale-90"
        >
          <Menu size={22} strokeWidth={2.5} />
        </button>

        <div className="flex items-center gap-2">
          <div className="bg-primary p-1.5 rounded-lg shadow-sm">
            <Image
              src="/mikan-logo.svg"
              alt="Mikan"
              width={20}
              height={20}
              className="brightness-0 invert"
            />
          </div>
          <span className="text-lg font-black tracking-tight text-heading">
            Mikan<span className="text-primary">.uz</span>
          </span>
        </div>
      </div>

      {/* O'ng tomonda bildirishnomalar yoki Profil */}
      <div className="flex items-center gap-2">
        {/* <button className="p-2.5 rounded-2xl text-muted hover:bg-gray-50 transition-colors">
          <Search size={20} />
        </button> */}
        <Link href={`/dashboard/notifications`} className="relative p-2.5 rounded-2xl text-muted hover:bg-gray-50 transition-colors">
          <Bell size={20} />
          {/* Bildirishnoma nuqtasi */}
          <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-danger rounded-full border-2 border-white"></span>
        </Link>

        {/* Foydalanuvchi avatari (ixtiyoriy) */}
        {user?.avatar && (
          <Link href={`/dashboard/profile`} className="ml-1 h-9 w-9 rounded-xl overflow-hidden border-2 border-orange-100 ring-2 ring-white">
            <Image
              src={user.avatar}
              alt="User"
              width={36}
              height={36}
              className="object-cover"
            />
          </Link>
        )}
      </div>
    </header>
  );
};

export default MobileHeader;
