import React from "react";

const InvitationCardSkeleton = () => {
  return (
    <div className="relative bg-white border border-slate-100 rounded-[1.25rem] p-4 overflow-hidden animate-pulse">
      <div className="flex flex-col lg:flex-row lg:items-center gap-4 lg:gap-10">
        
        {/* 1. Foydalanuvchi qismi Skeleton */}
        <div className="flex items-center gap-4 flex-[1.5] min-w-0">
          <div className="relative shrink-0">
            {/* Avatar o'rni */}
            <div className="w-12 h-12 rounded-2xl bg-slate-100 border border-slate-50" />
            {/* Status nuqtasi */}
            <div className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-white bg-slate-200" />
          </div>

          <div className="flex flex-col gap-2 w-full max-w-[150px]">
            {/* Ism familiya */}
            <div className="h-4 bg-slate-100 rounded w-full" />
            {/* Email */}
            <div className="h-3 bg-slate-50 rounded w-2/3" />
          </div>
        </div>

        {/* 2. Taklif kodi Skeleton */}
        <div className="flex flex-col flex-1 gap-2">
          <div className="h-2 bg-slate-50 rounded w-16" />
          <div className="h-9 bg-orange-50/50 border border-orange-100/50 rounded-xl w-28" />
        </div>

        {/* 3. Rol va Holat Skeleton */}
        <div className="flex items-center gap-8 flex-1">
          {/* Rol */}
          <div className="flex flex-col gap-2">
            <div className="h-2 bg-slate-50 rounded w-8" />
            <div className="h-6 bg-slate-100 rounded-lg w-16" />
          </div>
          {/* Holat */}
          <div className="flex flex-col gap-2">
            <div className="h-2 bg-slate-50 rounded w-10" />
            <div className="h-4 bg-slate-100 rounded w-20" />
          </div>
        </div>

        {/* 4. Vaqt va Dropdown Skeleton */}
        <div className="flex items-center gap-4 lg:gap-8 flex-1 lg:justify-end border-t lg:border-none pt-3 lg:pt-0 mt-2 lg:mt-0">
          <div className="flex flex-col lg:items-end gap-2">
            <div className="h-2 bg-slate-50 rounded w-12" />
            <div className="flex items-center gap-2">
              <div className="h-4 bg-slate-100 rounded w-16" />
              <div className="h-5 bg-slate-50 rounded-md w-12" />
            </div>
          </div>

          {/* Action Button o'rni */}
          <div className="ml-auto lg:ml-0 w-8 h-8 bg-slate-50 rounded-lg" />
        </div>
      </div>

      {/* Shimmer (Yaltiroq nur) effekti */}
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/40 to-transparent" />
    </div>
  );
};

const InviteListSkeleton = () => {
    return (
        <div className="grid grid-cols-1 gap-2">
            {[...Array(8)].map((_, i) => (
                <InvitationCardSkeleton key={i} />
            ))}
        </div>
    );
};


export default InviteListSkeleton;