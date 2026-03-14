import React, { useEffect } from "react";
import { useRouter } from "next/router";
import useSWR from "swr";
import fetcher from "@/utils/fetcher";
import { useModal } from "@/context/modal-context";
import Pagination from "@/components/ui/pagination";
import { EmptyMessage } from "@/components/custom/message";
import SearchInput from "@/components/ui/search-input";
import { MaterialCard } from "@/components/custom/cards";

const MaterialLists = () => {
  const router = useRouter();
  const { modalClosed } = useModal();
  const { page = 1, search, file_type, is_public } = router.query;

  const { data, isLoading, mutate } = useSWR(
    [`materials/`, router.locale, page, search, file_type, is_public],
    (url, locale, p, q, file, pub) => {
      const queryParams = new URLSearchParams({
        page: p,
        page_size: 8,
        ...(file_type && { file_type: file }),
        ...(is_public && { is_public: pub }),
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
      mutate(`materials/`);
    }
  }, [modalClosed, mutate]);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-pulse">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="h-60 bg-white/60 border border-slate-100 rounded-[2rem]"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col space-y-6 pb-10">
      {data?.results?.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {data.results.map((material) => (
            <MaterialCard key={material.id} item={material} />
          ))}
        </div>
      ) : (
        <EmptyMessage
          titleKey="Materiallar topilmadi"
          descriptionKey="Hozircha ro'yxatda hech narsa yo'q"
          iconKey="materials"
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

export default MaterialLists;
