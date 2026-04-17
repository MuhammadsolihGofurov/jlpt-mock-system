import React from "react";

const FolderSkeleton = () => {
    return (
        <div className="flex flex-col items-center justify-center gap-2 p-4 animate-pulse">
            {/* Papka shakli simulyatsiyasi */}
            <div className="relative w-20 h-16">
                {/* Papka qulog'i */}
                <div className="absolute -top-1.5 left-0 w-8 h-4 bg-orange-100/50 rounded-t-md" />

                {/* Orqa qatlam */}
                <div className="absolute inset-0 bg-orange-50/60 rounded-lg" />

                {/* Oldi qatlam */}
                <div className="absolute bottom-0 left-0 w-full h-[85%] bg-orange-100/40 rounded-lg border-t border-white/20" />
            </div>

            {/* Matnlar simulyatsiyasi */}
            <div className="flex flex-col items-center space-y-2 mt-1 w-full">
                {/* Sarlavha (Name) */}
                <div className="h-3 w-24 bg-slate-100 rounded-md" />
                {/* Miqdori (Count) */}
                <div className="h-2 w-16 bg-slate-50 rounded-md" />
            </div>
        </div>
    );
};

const MaterialsSkeleton = () => {
    return (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {[...Array(12)].map((_, i) => (
                <FolderSkeleton key={i} />
            ))}
        </div>
    );
};

export default MaterialsSkeleton;