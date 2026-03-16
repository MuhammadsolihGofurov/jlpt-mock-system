import React from "react";
import { useRouter } from "next/router";
import useSWR from "swr";
import fetcher from "@/utils/fetcher";
import { useModal } from "@/context/modal-context";
import Pagination from "@/components/ui/pagination";
import { EmptyMessage } from "@/components/custom/message";
import HomeworkCard from "@/components/custom/cards/homework-card";
import { Plus } from "lucide-react";
import { useSelector } from "react-redux";

const HomeworkLists = () => {
  const router = useRouter();
  const { openModal } = useModal();
  const { user } = useSelector((state) => state.auth);
  const { page = 1, search } = router.query;

  const { data, isLoading, mutate } = useSWR(
    [`homework-assignments/`, router.locale, page, search],
    (url, locale, p, q) => {
      const queryParams = new URLSearchParams({
        page: p,
        page_size: 8,
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

  const canCreate = user?.role === "CENTER_ADMIN" || user?.role === "TEACHER";

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-pulse">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="h-72 bg-white/60 border border-slate-100 rounded-[2.5rem]"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col space-y-6 pb-10">
      {data?.results?.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {data.results.map((homework) => (
            <HomeworkCard key={homework.id} item={homework} mutate={mutate} />
          ))}
        </div>
      ) : (
        <EmptyMessage
          titleKey="Vazifalar topilmadi"
          descriptionKey="Hozircha hech qanday uy vazifasi belgilanmagan"
          iconKey="homework"
        />
      )}

      {data?.count > 8 && (
        <div className="pt-10 flex justify-center">
          <Pagination totalCount={data.count} pageSize={8} />
        </div>
      )}
    </div>
  );
};

export default HomeworkLists;
