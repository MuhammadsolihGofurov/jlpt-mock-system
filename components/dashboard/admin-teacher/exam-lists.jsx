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
import { ExamListSkeleton } from "@/components/skeleton";

const ExamLists = ({ path, currentExamType, exam_type, customLoading }) => {
  const router = useRouter();
  const { modalClosed, openModal } = useModal();
  const { user } = useSelector((state) => state.auth);

  // URL parametrlari
  const { page = 1, search, status } = router.query;

  const { data, isLoading, mutate } = useSWR(
    [`${path}`, router.locale, page, search, status],
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

  if (isLoading || customLoading) {
    return <ExamListSkeleton />;
  }

  return (
    <div className="flex flex-col space-y-6 pb-10">
      {/* List Content */}
      {data?.results?.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {data.results.map((exam) => (
            <ExamCard key={exam.id} item={exam} mutate={mutate} currentExamType={currentExamType} exam_type={exam_type} />
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
          <Pagination totalCount={data.count} pageSize={8} />
        </div>
      )}
    </div>
  );
};

export default ExamLists;
