import React from "react";

const PageHeaderSkeleton = () => {
  // Orange fon uchun mos ranglar: 
  // bg-orange-100/50 yoki bg-amber-100/40 (iliqroq kulrang/sariq)
  return (
    <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-5 animate-pulse">
      {/* Chap tomon: Sarlavha va Tavsif */}
      <div className="relative w-full flex-1">
        {/* Dekorativ chiziq - biroz to'qroq orange */}
        <div className="absolute -left-5 top-1/2 -translate-y-1/2 w-1.5 h-10 bg-orange-200 rounded-r-full hidden md:block" />

        {/* Sarlavha va Badge */}
        <div className="flex items-center gap-3 mb-3">
          {/* Title - asosiy element bo'lgani uchun biroz to'qroq */}
          <div className="h-8 md:h-10 w-48 bg-orange-200/60 rounded-lg" />
          {/* Badge */}
          <div className="h-6 w-20 bg-orange-100/80 rounded-xl" />
        </div>

        {/* Tavsif */}
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-orange-200/50" />
          <div className="h-4 w-64 bg-orange-100/60 rounded-md" />
        </div>
      </div>

      {/* O'ng tomon: Tugmalar */}
      <div className="flex items-center flex-wrap gap-3">
        <div className="hidden sm:flex items-center gap-2">
          {/* Kichik icon tugmalar */}
          <div className="h-10 w-10 bg-orange-100/70 rounded-xl" />
          <div className="h-10 w-10 bg-orange-100/70 rounded-xl" />
        </div>

        {/* Asosiy tugma - ko'zga tashlanadigan iliq rang */}
        <div className="h-[54px] w-40 bg-orange-200/80 rounded-[1.4rem] shadow-sm" />
      </div>
    </div>
  );
};

export default PageHeaderSkeleton;