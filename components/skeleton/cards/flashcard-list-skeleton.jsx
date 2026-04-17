import React from "react";

const FlashcardDeckSkeleton = () => {
    return (
        <div className="bg-white border border-slate-100 rounded-[2.5rem] p-6 shadow-sm flex flex-col h-full relative overflow-hidden animate-pulse">

            {/* 1. Header Skeleton */}
            <div className="flex justify-between items-start mb-4">
                {/* Icon o'rni */}
                <div className="w-12 h-12 bg-orange-50 rounded-2xl" />
                {/* Dropdown o'rni */}
                <div className="w-8 h-8 bg-slate-50 rounded-lg mt-1" />
            </div>

            {/* 2. Content Skeleton */}
            <div className="flex-grow space-y-3 mb-6">
                {/* Title (Sarlavha) */}
                <div className="h-7 bg-slate-100 rounded-lg w-3/4" />

                {/* Description (Tavsif) - 2 qator */}
                <div className="space-y-2">
                    <div className="h-4 bg-slate-50 rounded w-full" />
                    <div className="h-4 bg-slate-50 rounded w-5/6" />
                </div>

                {/* Badges (Kartalar soni, Guruhlar, Sana) */}
                <div className="flex flex-wrap items-center gap-2 pt-2">
                    {/* Card count badge */}
                    <div className="w-20 h-6 bg-slate-100 rounded-full" />

                    <div className="w-2 h-2 bg-slate-100 rounded-full" />

                    {/* Center/Group badge */}
                    <div className="w-28 h-6 bg-orange-50/50 rounded-full" />

                    <div className="w-2 h-2 bg-slate-100 rounded-full" />

                    {/* Date */}
                    <div className="w-24 h-4 bg-slate-50 rounded" />
                </div>
            </div>

            {/* 3. Action Buttons Skeleton */}
            <div className="grid grid-cols-2 gap-3 pt-5 border-t border-slate-50">
                {/* Yodlash tugmasi */}
                <div className="h-[44px] bg-orange-50/60 rounded-2xl" />
                {/* Mashq tugmasi */}
                <div className="h-[44px] bg-slate-200 rounded-2xl" />
            </div>

            {/* Shimmer (Yaltiroq nur) effekti */}
            <div className="absolute inset-0 -translate-x-full animate-[shimmer_2.5s_infinite] bg-gradient-to-r from-transparent via-white/40 to-transparent" />
        </div>
    );
};

const FlashcardDecksSkeleton = () => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4">
            {[...Array(8)].map((_, i) => (
                <FlashcardDeckSkeleton key={i} />
            ))}
        </div>
    );
};

export default FlashcardDecksSkeleton;