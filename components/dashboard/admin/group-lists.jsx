import React, { useEffect } from "react";
import { useRouter } from "next/router";
import useSWR from "swr";
import fetcher from "@/utils/fetcher";
import { useModal } from "@/context/modal-context";
import Pagination from "@/components/ui/pagination";
import { EmptyMessage } from "@/components/custom/message";
import { GroupCard } from "@/components/custom/cards";

const GroupLists = () => {
  const router = useRouter();
  const { modalClosed } = useModal();
  const { page = 1, search } = router.query;

  const { data, isLoading, mutate } = useSWR(
    [`groups/`, router.locale, page, search],
    (url, locale, p, q) => {
      const queryParams = new URLSearchParams({
        page: p,
        page_size: 9, // Card ko'rinishida 3 tadan bo'lib chiqishi uchun 9 ta qulay
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

  useEffect(() => {
    if (modalClosed?.refresh) {
      mutate();
    }
  }, [modalClosed, mutate]);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="h-64 bg-white/60 border border-slate-100 rounded-[2.5rem]"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col space-y-6 pb-10">
      {/* Grid Container */}
      {data?.results?.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.results.map((group) => (
            <GroupCard key={group.id} item={group} />
          ))}
        </div>
      ) : (
        <EmptyMessage
          titleKey="Guruhlar topilmadi"
          descriptionKey="Hozircha hech qanday o'quv guruhi yaratilmagan"
          iconKey="groups"
        />
      )}

      {/* Pagination */}
      {data?.count > 0 && (
        <div className="pt-8 border-t border-slate-100">
          <Pagination totalCount={data.count} pageSize={9} />
        </div>
      )}
    </div>
  );
};

export default GroupLists;
