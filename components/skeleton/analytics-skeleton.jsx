import React from "react";

const AnalyticsSkeleton = () => {
    return (
        <div className="space-y-6 animate-pulse">
            {/* 1. Stat Cards Skeleton */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-32 bg-orange-50/50 border border-orange-100/50 rounded-[2rem] p-6 relative overflow-hidden">
                        <div className="flex justify-between items-start">
                            <div className="space-y-3">
                                <div className="h-4 w-24 bg-orange-100/80 rounded-md" />
                                <div className="h-8 w-16 bg-orange-200/60 rounded-lg" />
                            </div>
                            <div className="h-12 w-12 bg-orange-100/80 rounded-2xl" />
                        </div>
                    </div>
                ))}
            </div>

            {/* 2. Charts and Details Section Skeleton */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

                {/* Radar Chart Skeleton (lg:col-span-3) */}
                <div className="lg:col-span-3 bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm min-h-[450px] flex flex-col">
                    <div className="space-y-2 mb-8">
                        <div className="h-7 w-48 bg-slate-100 rounded-lg" />
                        <div className="h-3 w-64 bg-slate-50 rounded-md" />
                    </div>

                    <div className="flex-1 flex items-center justify-center">
                        {/* Doirasimon Radar shakli imitatsiyasi */}
                        <div className="relative w-64 h-64">
                            <div className="absolute inset-0 border-4 border-dashed border-slate-50 rounded-full scale-100" />
                            <div className="absolute inset-0 border-2 border-dashed border-slate-100 rounded-full scale-75" />
                            <div className="absolute inset-0 border border-dashed border-slate-100 rounded-full scale-50" />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-full h-full bg-orange-50/30 rounded-full clip-path-polygon"
                                    style={{ clipPath: 'polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)' }} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Skill Details Skeleton (lg:col-span-2) */}
                <div className="lg:col-span-2 space-y-4">
                    {/* Top Performance Card */}
                    <div className="h-32 bg-slate-800 p-8 rounded-[3rem] relative overflow-hidden">
                        <div className="h-3 w-32 bg-slate-700 rounded mb-2" />
                        <div className="flex items-end gap-3">
                            <div className="h-10 w-20 bg-slate-700 rounded-lg" />
                            <div className="h-5 w-24 bg-orange-500/30 rounded-md" />
                        </div>
                    </div>

                    {/* Individual Skill Cards */}
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="bg-white p-5 rounded-[2rem] border border-slate-100 shadow-sm space-y-4">
                            <div className="flex justify-between items-start">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 bg-slate-100 rounded-xl" />
                                    <div className="space-y-2">
                                        <div className="h-4 w-24 bg-slate-100 rounded" />
                                        <div className="h-3 w-16 bg-slate-50 rounded" />
                                    </div>
                                </div>
                                <div className="flex flex-col items-end gap-1">
                                    <div className="h-5 w-10 bg-slate-100 rounded" />
                                    <div className="h-3 w-8 bg-emerald-50 rounded" />
                                </div>
                            </div>
                            {/* Progress Bar */}
                            <div className="w-full h-2 bg-slate-50 rounded-full">
                                <div className="h-full bg-orange-100/50 rounded-full w-2/3" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* 3. Recent Requests/Table Skeleton (Optional for Admin) */}
            <div className="h-64 bg-white rounded-[2rem] border border-slate-100 p-6 space-y-4">
                <div className="h-6 w-40 bg-slate-100 rounded-md mb-6" />
                {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center justify-between py-3 border-b border-slate-50 last:border-0">
                        <div className="flex gap-3">
                            <div className="h-10 w-10 bg-slate-100 rounded-full" />
                            <div className="space-y-2">
                                <div className="h-4 w-32 bg-slate-100 rounded" />
                                <div className="h-3 w-24 bg-slate-50 rounded" />
                            </div>
                        </div>
                        <div className="h-8 w-20 bg-slate-100 rounded-lg" />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AnalyticsSkeleton;