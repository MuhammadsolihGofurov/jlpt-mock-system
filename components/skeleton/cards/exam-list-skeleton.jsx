const ExamCardSkeleton = () => {
    return (
        <div className="bg-white border border-slate-100 p-6 rounded-[2.5rem] shadow-sm flex flex-col h-full relative overflow-hidden animate-pulse">

            {/* Badge Skeleton */}
            <div className="flex justify-between items-start mb-6">
                <div className="w-24 h-7 bg-orange-50 rounded-2xl" />
                <div className="flex gap-2">
                    <div className="w-9 h-9 bg-slate-50 rounded-xl" />
                    <div className="w-9 h-9 bg-slate-50 rounded-xl" />
                </div>
            </div>

            {/* Title & Info Skeleton */}
            <div className="flex-1">
                {/* Sarlavha (Title) */}
                <div className="space-y-2 mb-6">
                    <div className="h-6 bg-orange-100/50 rounded-lg w-3/4" />
                    <div className="h-6 bg-orange-100/50 rounded-lg w-1/2" />
                </div>

                {/* Date & Groups */}
                <div className="space-y-4 mb-6">
                    {/* Calendar row */}
                    <div className="flex items-center gap-3">
                        <div className="w-4 h-4 bg-orange-200 rounded" />
                        <div className="h-4 bg-slate-100 rounded w-40" />
                    </div>

                    {/* Groups row */}
                    <div className="flex items-center gap-3">
                        <div className="w-4 h-4 bg-blue-200 rounded" />
                        <div className="flex gap-1">
                            <div className="w-12 h-5 bg-slate-100 rounded-md" />
                            <div className="w-16 h-5 bg-slate-100 rounded-md" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Control Buttons Skeleton (Admin/Teacher qismi) */}
            <div className="grid grid-cols-2 gap-2 mb-4">
                <div className="h-11 bg-orange-50/50 rounded-2xl" />
                <div className="h-11 bg-slate-100 rounded-2xl" />
            </div>

            {/* Main Action Button Skeleton */}
            <div className="w-full h-[52px] bg-orange-100/40 rounded-[1.5rem]" />

            {/* Skeleton uchun yaltiroq effekt (Shimmer) */}
            <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/40 to-transparent" />
        </div>
    );
};

const ExamListSkeleton = () => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
                <ExamCardSkeleton key={i} />
            ))}
        </div>
    );
};

export default ExamListSkeleton;