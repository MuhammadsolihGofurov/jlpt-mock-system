import { CenterCard } from "@/components/custom/cards";
import { useModal } from "@/context/modal-context";
import fetcher from "@/utils/fetcher";
import { useEffect } from "react";
import Pagination from "@/components/ui/pagination"; // import qilish
import { useRouter } from "next/router";
import useSWR from "swr";
import { useIntl } from "react-intl";

const CenterLists = () => {
  const router = useRouter();
  const intl = useIntl();
  const { modalClosed } = useModal();

  const currentPage = router.query.page || 1;

  const { data, mutate, isLoading } = useSWR(
    [`owner-centers/?page=${currentPage}`, router.locale],
    (url, locale) =>
      fetcher(url, { headers: { "Accept-Language": locale } }, {}, true),
  );

  useEffect(() => {
    if (modalClosed?.refresh) {
      mutate();
    }
  }, [modalClosed, mutate]);

  return (
    <div className="flex flex-col min-h-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
        {data?.results?.map((center) => (
          <CenterCard
            key={center.id}
            center={center}
            onEdit={(id) => console.log("Edit:", id)}
            onDelete={(id) => console.log("Delete:", id)}
          />
        ))}
      </div>

      {data?.results?.length === 0 && (
        <div className="text-center py-20 bg-gray-50 rounded-[2rem] border-2 border-dashed border-gray-100">
          <p className="text-muted font-bold">
            {intl.formatMessage({ id: "Hech qanday markaz topilmadi." })}
          </p>
        </div>
      )}

      {data?.count > 0 && <Pagination totalCount={data.count} pageSize={6} />}
    </div>
  );
};

export default CenterLists;
