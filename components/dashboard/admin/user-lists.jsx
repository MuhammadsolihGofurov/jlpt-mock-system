import { useModal } from "@/context/modal-context";
import fetcher from "@/utils/fetcher";
import { useEffect } from "react";
import Pagination from "@/components/ui/pagination";
import { useRouter } from "next/router";
import useSWR, { mutate } from "swr";
import { UserCard } from "@/components/custom/cards/user-card";
import { EmptyMessage } from "@/components/custom/message";

const UserLists = () => {
  const router = useRouter();
  const { modalClosed } = useModal();
  const { role, is_active, is_approved, page = 1, search } = router.query;

  const { data, isLoading } = useSWR(
    [`users/`, router.locale, page, search, role, is_active, is_approved],
    (url, locale, p, q, r, active, approved) => {
      const queryParams = new URLSearchParams({
        page: p,
        ...(q && { search: q }),
        ...(r && { role: r }),
        ...(active && { is_active: active }),
        ...(approved && { is_approved: approved }),
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
      mutate([
        `users/`,
        router.locale,
        page,
        search,
        role,
        is_active,
        is_approved,
      ]);
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
      </div>

      {/* Empty State */}
      {!data ||
        (data?.results?.length === 0 && (
          <EmptyMessage
            titleKey="Foydalanuvchilar topilmadi"
            descriptionKey="Hozircha ro'yxatda hech kim yo'q"
            iconKey="users"
          />
        ))}

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
