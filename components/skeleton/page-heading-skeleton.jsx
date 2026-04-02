import React from "react";

const PageHeaderSkeleton = () => {
  return (
    <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-5 animate-pulse">
      {/* Chap tomon: Sarlavha va Tavsif */}
      <div className="relative w-full flex-1">
        {/* Dekorativ chiziq skeletoni */}
        <div className="absolute -left-5 top-1/2 -translate-y-1/2 w-1.5 h-10 bg-gray-200 rounded-r-full hidden md:block" />

        {/* Sarlavha va Badge */}
        <div className="flex items-center gap-3 mb-3">
          {/* Title skeleton */}
          <div className="h-8 md:h-10 w-48 bg-gray-200 rounded-lg" />
          {/* Badge skeleton */}
          <div className="h-6 w-20 bg-gray-100 rounded-xl" />
        </div>

        {/* Tavsif skeleton */}
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-gray-200" />
          <div className="h-4 w-64 bg-gray-100 rounded-md" />
        </div>
      </div>

      {/* O'ng tomon: Tugmalar */}
      <div className="flex items-center flex-wrap gap-3">
        {/* Qo'shimcha amallar (extraActions) uchun joy */}
        <div className="hidden sm:flex items-center gap-2">
          <div className="h-10 w-10 bg-gray-100 rounded-xl" />
          <div className="h-10 w-10 bg-gray-100 rounded-xl" />
        </div>

        {/* Asosiy tugma skeletoni */}
        <div className="h-[54px] w-40 bg-gray-200 rounded-[1.4rem] shadow-sm" />
      </div>
    </div>
  );
};

export default PageHeaderSkeleton;