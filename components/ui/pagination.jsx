import React from "react";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { useRouter } from "next/router";
import { usePagination } from "@/hooks/usePagination";

const Pagination = ({ totalCount, pageSize = 10, siblingCount = 1 }) => {
  const router = useRouter();
  const currentPage = Number(router.query.page) || 1;

  const totalPageCount = Math.ceil(totalCount / pageSize);

  const paginationRange = usePagination({
    currentPage,
    totalPageCount,
    siblingCount,
  });

  // Agar sahifalar 2 tadan kam bo'lsa, pagination chiqarmaymiz
  if (currentPage === 0 || paginationRange?.length < 2) {
    return null;
  }

  const onPageChange = (page) => {
    router.push(
      {
        query: { ...router.query, page: page },
      },
      undefined,
      { shallow: true },
    ); // shallow: true sahifani to'liq reload qilmaslik uchun
  };

  const onNext = () => onPageChange(currentPage + 1);
  const onPrevious = () => onPageChange(currentPage - 1);

  return (
    <div className="flex items-center justify-center gap-2 mt-10 mb-6">
      {/* Orqaga tugmasi */}
      <button
        disabled={currentPage === 1}
        onClick={onPrevious}
        className="p-2 rounded-xl border border-gray-100 bg-white text-muted hover:text-primary hover:border-orange-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
      >
        <ChevronLeft size={20} />
      </button>

      {/* Sahifalar raqamlari */}
      <div className="flex items-center gap-1.5">
        {paginationRange.map((pageNumber, idx) => {
          if (pageNumber === "...") {
            return (
              <div key={`dots-${idx}`} className="px-3 text-muted">
                <MoreHorizontal size={16} />
              </div>
            );
          }

          const active = pageNumber === currentPage;

          return (
            <button
              key={pageNumber}
              onClick={() => onPageChange(pageNumber)}
              className={`min-w-[40px] h-10 rounded-xl font-bold text-sm transition-all shadow-sm border
                ${
                  active
                    ? "bg-primary border-primary text-white shadow-orange-200"
                    : "bg-white border-gray-100 text-muted hover:border-orange-100 hover:text-primary"
                }`}
            >
              {pageNumber}
            </button>
          );
        })}
      </div>

      {/* Oldinga tugmasi */}
      <button
        disabled={currentPage === totalPageCount}
        onClick={onNext}
        className="p-2 rounded-xl border border-gray-100 bg-white text-muted hover:text-primary hover:border-orange-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
      >
        <ChevronRight size={20} />
      </button>
    </div>
  );
};

export default Pagination;
