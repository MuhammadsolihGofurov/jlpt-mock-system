import React, { useEffect } from "react";
import { useRouter } from "next/router";
import useSWR from "swr";
import fetcher from "@/utils/fetcher";
import { useModal } from "@/context/modal-context";
import Pagination from "@/components/ui/pagination";
import { EmptyMessage } from "@/components/custom/message";
import ExamCard from "@/components/custom/cards/exam-card"; // Yuqorida yasalgan card
import { Plus, Search, Filter } from "lucide-react";
import { useSelector } from "react-redux";

const ExamLists = () => {
  const router = useRouter();
  const { modalClosed, openModal } = useModal();
  const { user } = useSelector((state) => state.auth);

  // URL parametrlari
  const { page = 1, search, status } = router.query;

  const { data, isLoading, mutate } = useSWR(
    [`exam-assignments/`, router.locale, page, search, status],
    (url, locale, p, q, st) => {
      const queryParams = new URLSearchParams({
        page: p,
        page_size: 8,
        ...(st && { status: st }),
        ...(q && { search: q }),
      });
      return fetcher(
        `${url}?${queryParams}`,
        { headers: { "Accept-Language": locale } },
        {},
        true,
      );
    },
  );

  // Modal yopilganda ma'lumotni yangilash
  // useEffect(() => {
  //   if (modalClosed?.refresh) {
  //     mutate();
  //   }
  // }, [modalClosed, mutate]);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-pulse">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="h-80 bg-white/60 border border-slate-100 rounded-[2.5rem]"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col space-y-6 pb-10">
      {/* List Content */}
      {data?.results?.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {data.results.map((exam) => (
            <ExamCard key={exam.id} item={exam} mutate={mutate} />
          ))}
        </div>
      ) : (
        <EmptyMessage
          titleKey="Imtihonlar topilmadi"
          descriptionKey="Sizning qidiruvingiz bo'yicha hech qanday imtihon natija bermadi"
          iconKey="exams"
        />
      )}

      {/* Pagination */}
      {data?.count > 8 && (
        <div className="pt-10 flex justify-center">
          <div className="bg-white p-2 rounded-[2rem] shadow-sm border border-slate-50">
            <Pagination totalCount={data.count} pageSize={8} />
          </div>
        </div>
      )}
    </div>
  );
};

export default ExamLists;
