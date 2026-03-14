import { useModal } from "@/context/modal-context";
import fetcher from "@/utils/fetcher";
import { useEffect } from "react";
import Pagination from "@/components/ui/pagination";
import { useRouter } from "next/router";
import useSWR from "swr";
import { useIntl } from "react-intl";
import { Users } from "lucide-react";
import { UserCard } from "@/components/custom/cards/user-card";

const UserLists = () => {
  const router = useRouter();
  const intl = useIntl();
  const { modalClosed } = useModal();

  const currentPage = router.query.page || 1;

  const { data, mutate, isLoading } = useSWR(
    [`users/`, router.locale, currentPage],
    (url, locale, p) =>
      fetcher(`${url}`, { headers: { "Accept-Language": locale } }, {}, true),
  );

  useEffect(() => {
    if (modalClosed?.refresh) {
      mutate();
    }
  }, [modalClosed, mutate]);

  if (isLoading) {
    return (
      <div className="flex flex-col gap-3 animate-pulse">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="h-20 bg-white border border-slate-100 rounded-[1.25rem]"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-full space-y-6 pb-10">
      {/* List container */}
      <div className="grid grid-cols-1 gap-3">
        {data?.results?.map((user) => (
          <UserCard
            key={user.id}
            item={user}
            onDelete={(id) => console.log("Delete User:", id)}
          />
        ))}
        <UserCard
          item={{
            id: 0,
            email: "user@example.com",
            first_name: "string",
            last_name: "string",
            avatar: "string",
            role: "OWNER",
            center: 0,
            center_avatar: "string",
            is_approved: true,
            created_at: "2026-03-14T17:47:59.384Z",
          }}
          onDelete={(id) => console.log("Delete User:", id)}
        />
      </div>

      {/* Empty State */}
      {data?.results?.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 bg-white/40 backdrop-blur-sm rounded-[2.5rem] border-2 border-dashed border-slate-100">
          <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 mb-4">
            <Users size={32} />
          </div>
          <h3 className="text-lg font-black text-heading">Userlar topilmadi</h3>
          <p className="text-muted text-sm font-medium mt-1">
            Hozircha ro'yxatda hech kim yo'q.
          </p>
        </div>
      )}

      {/* Pagination */}
      {data?.count > 0 && (
        <div className="pt-4 border-t border-slate-50">
          <Pagination totalCount={data.count} pageSize={10} />
        </div>
      )}
    </div>
  );
};

export default UserLists;
