import React from "react";

const MockCardSkeleton = () => {
  return (
    <div className="bg-white border border-slate-100 p-5 rounded-[2.25rem] shadow-sm flex flex-col h-full relative overflow-hidden animate-pulse">
      {/* Main Content Skeleton */}
      <div className="mb-4">
        {/* Ikonka skeletoni */}
        <div className="w-12 h-12 rounded-2xl bg-orange-50/50 mb-4" />

        {/* Sarlavha skeletoni (2 qator) */}
        <div className="space-y-2 min-h-[56px]">
          <div className="h-4 bg-slate-100 rounded-full w-full" />
          <div className="h-4 bg-slate-100 rounded-full w-2/3" />
        </div>
      </div>

      {/* Details Skeleton */}
      <div className="space-y-4 flex-1">
        {/* Level va Score qatori */}
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-orange-100/60" />
          <div className="h-3 bg-slate-100 rounded-md w-32" />
        </div>

        {/* Tavsif skeletoni */}
        <div className="space-y-2">
          <div className="h-3 bg-slate-50 rounded-md w-full" />
          <div className="h-3 bg-slate-50 rounded-md w-4/5" />
        </div>
      </div>

      {/* Footer Actions Skeleton */}
      <div className="mt-6 pt-5 border-t border-slate-50 flex items-center justify-between">
        {/* Chap tomondagi link o'rni */}
        <div className="h-3 bg-orange-50 rounded-md w-20" />

        <div className="flex items-center gap-3">
          {/* Status badge skeleton */}
          <div className="h-5 bg-slate-100 rounded-lg w-16" />

          {/* Action button skeleton */}
          <div className="w-11 h-11 bg-orange-100/50 rounded-2xl" />
        </div>
      </div>
    </div>
  );
};

const MockListsSkeleton = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {[...Array(8)].map((_, i) => (
        <MockCardSkeleton key={i} />
      ))}
    </div>
  );
};

export default MockListsSkeleton;