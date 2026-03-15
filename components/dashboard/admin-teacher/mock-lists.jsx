import React, { useEffect } from "react";
import { useRouter } from "next/router";
import useSWR from "swr";
import fetcher from "@/utils/fetcher";
import { useModal } from "@/context/modal-context";
import Pagination from "@/components/ui/pagination";
import { EmptyMessage } from "@/components/custom/message";
import { MockCard } from "@/components/custom/cards";

const MockLists = () => {
  const router = useRouter();
  const { modalClosed } = useModal();
  const { page = 1, search, level, status } = router.query;

  const { data, isLoading, mutate } = useSWR(
    [`mock-tests/`, router.locale, page, search, level, status],
    (url, locale, p, q, lvl, st) => {
      const queryParams = new URLSearchParams({
        page: p,
        page_size: 8,
        ...(lvl && { level: lvl }),
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

  useEffect(() => {
    if (modalClosed?.refresh) {
      mutate();
    }
  }, [modalClosed, mutate]);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-pulse">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="h-64 bg-white/60 border border-slate-100 rounded-[2.25rem]"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col space-y-6 pb-10">
      {data?.results?.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {data.results.map((mock) => (
            <MockCard key={mock.id} item={mock} mutate={mutate} />
          ))}
        </div>
      ) : (
        <EmptyMessage
          titleKey="Mock imtihonlar topilmadi"
          descriptionKey="Hozircha hech qanday test yaratilmagan"
          iconKey="mocks"
        />
      )}

      {data?.count > 0 && (
        <div className="pt-8 border-t border-slate-100">
          <Pagination totalCount={data.count} pageSize={8} />
        </div>
      )}
    </div>
  );
};

export default MockLists;
