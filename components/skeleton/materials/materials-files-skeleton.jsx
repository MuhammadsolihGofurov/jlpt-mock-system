import React from "react";

const MaterialCardSkeleton = () => {
  return (
    <div className="bg-white border border-orange-100 p-5 rounded-[2.25rem] shadow-sm flex flex-col h-[320px] animate-pulse">
      <div className="relative flex-1">
        {/* Top Actions Skeleton */}
        <div className="flex justify-between items-start mb-5">
          {/* Icon box */}
          <div className="p-7 bg-orange-100 rounded-2xl w-14 h-14" />

          {/* Badge (Public/Private) */}
          <div className="px-10 py-4 bg-orange-50 rounded-xl border border-orange-100" />
        </div>

        {/* Title & Metadata Skeleton */}
        <div className="space-y-3 mb-6">
          {/* Title line 1 */}
          <div className="h-4 bg-orange-100 rounded-full w-full" />
          {/* Title line 2 */}
          <div className="h-4 bg-orange-100 rounded-full w-2/3" />

          {/* User info section */}
          <div className="flex items-center gap-3 pt-2">
            {/* Avatar */}
            <div className="w-8 h-8 rounded-xl bg-orange-100 border border-orange-100" />
            <div className="space-y-1.5">
              <div className="h-2 w-12 bg-orange-50 rounded" />
              <div className="h-3 w-24 bg-orange-100 rounded" />
            </div>
          </div>
        </div>
      </div>

      {/* Footer Skeleton */}
      <div className="flex items-center justify-between pt-5 border-t border-orange-50">
        {/* Date info */}
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-orange-100 rounded-full" />
          <div className="h-3 w-24 bg-orange-100 rounded" />
        </div>

        {/* Download button */}
        <div className="w-11 h-11 bg-orange-200 rounded-[1.25rem]" />
      </div>
    </div>
  );
};

const MaterialListsSkeleton = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {[...Array(8)].map((_, i) => (
        <MaterialCardSkeleton key={i} />
      ))}
    </div>
  );
};

export default MaterialListsSkeleton;