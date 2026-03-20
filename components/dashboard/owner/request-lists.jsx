import { CenterCard, RequestCard } from "@/components/custom/cards";
import { useModal } from "@/context/modal-context";
import fetcher from "@/utils/fetcher";
import { useEffect } from "react";
import Pagination from "@/components/ui/pagination"; // import qilish
import { useRouter } from "next/router";
import useSWR from "swr";
import { useIntl } from "react-intl";
import { EmptyMessage } from "@/components/custom/message";

const RequestLists = () => {
    const router = useRouter();
    const intl = useIntl();
    const { modalClosed } = useModal();

    const currentPage = router.query.page || 1;

    const { data, mutate, isLoading } = useSWR(
        [`owner-contact-requests/`, router.locale],
        (url, locale) =>
            fetcher(`${url}?page=${currentPage}`, { headers: { "Accept-Language": locale } }, {}, true),
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
                    <RequestCard
                        key={center.id}
                        item={center}
                    />
                ))}
            </div>

            {data?.results?.length === 0 && (
                <EmptyMessage
                    titleKey="So'rovlar topilmadi"
                    descriptionKey="Hozircha ro'yxatda hech narsa yo'q"
                    iconKey="default"
                />
            )}

            {data?.count > 0 && <Pagination totalCount={data.count} pageSize={6} />}
        </div>
    );
};

export default RequestLists;
