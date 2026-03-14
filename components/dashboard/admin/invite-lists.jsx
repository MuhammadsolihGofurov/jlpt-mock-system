import { useModal } from "@/context/modal-context";
import fetcher from "@/utils/fetcher";
import { useEffect } from "react";
import Pagination from "@/components/ui/pagination";
import { useRouter } from "next/router";
import useSWR from "swr";
import { useIntl } from "react-intl";
import { UserPlus } from "lucide-react";
import { InvitationCard } from "@/components/custom/cards";

const InvitationLists = () => {
  const router = useRouter();
  const intl = useIntl();
  const { modalClosed } = useModal();

  const currentPage = router.query.page || 1;

  // API pathingizga moslashtiring
  const { data, mutate, isLoading } = useSWR(
    [`centers/invitations/list/`, router.locale, currentPage],
    (url, locale, p) =>
      fetcher(
        `${url}?page_size=6&page=${p}`,
        { headers: { "Accept-Language": locale } },
        {},
        true,
      ),
  );

  useEffect(() => {
    if (modalClosed?.refresh) {
      mutate();
    }
  }, [modalClosed, mutate]);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="h-64 bg-white/50 rounded-[2rem] border border-orange-50"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-full space-y-8 pb-10">
      {/* Grid container */}
      <div className="grid grid-cols-1 gap-3">
        {data?.results?.map((item) => (
          <InvitationCard
            key={item.id}
            item={item}
            onEdit={(id) => console.log("Edit:", id)}
            onDelete={(id) => console.log("Delete:", id)}
          />
        ))}
      </div>

      {/* Empty State */}
      {data?.results?.length === 0 && (
        <div className="flex flex-col items-center justify-center py-24 bg-white/40 backdrop-blur-sm rounded-[3rem] border-2 border-dashed border-orange-100">
          <div className="w-20 h-20 bg-orange-50 rounded-full flex items-center justify-center text-primary mb-4">
            <UserPlus size={40} />
          </div>
          <h3 className="text-xl font-black text-heading">
            Ma'lumot topilmadi
          </h3>
          <p className="text-muted font-medium mt-1">
            Hozircha hech qanday taklifnomalar yo'q.
          </p>
        </div>
      )}

      {/* Pagination Container */}
      {data?.count > 0 && <Pagination totalCount={data.count} pageSize={6} />}
    </div>
  );
};

export default InvitationLists;
