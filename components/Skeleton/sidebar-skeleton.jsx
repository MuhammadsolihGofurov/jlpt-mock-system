const SidebarSkeleton = () => {
  return (
    <aside className="fixed left-0 top-0 h-screen w-[260px] bg-white border-r border-gray-100 z-[70] flex flex-col hidden md:flex">
      {/* Logo Skeleton */}
      <div className="p-8 mb-4">
        <div className="flex items-center gap-3 animate-pulse">
          <div className="w-10 h-10 bg-gray-200 rounded-xl" />
          <div className="h-6 w-24 bg-gray-200 rounded-lg" />
        </div>
      </div>

      {/* Navigation Skeleton */}
      <nav className="flex-1 px-4 space-y-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="flex items-center justify-between px-4 py-3.5 animate-pulse"
          >
            <div className="flex items-center gap-4">
              <div className="w-6 h-6 bg-gray-200 rounded-md" />
              <div className="h-4 w-28 bg-gray-100 rounded-md" />
            </div>
            <div className="w-4 h-4 bg-gray-50 rounded-full" />
          </div>
        ))}
      </nav>

      {/* Bottom Section Skeleton */}
      <div className="p-4 mt-auto">
        <div className="flex w-full items-center gap-3 px-4 py-3 rounded-2xl bg-gray-50 animate-pulse">
          <div className="w-5 h-5 bg-gray-200 rounded-md" />
          <div className="h-4 w-16 bg-gray-200 rounded-md" />
        </div>
      </div>
    </aside>
  );
};

export default SidebarSkeleton;
