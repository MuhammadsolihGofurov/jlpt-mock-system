import React, { useEffect } from "react";
import { useRouter } from "next/router";
import useSWR from "swr";
import fetcher from "@/utils/fetcher";
import { useModal } from "@/context/modal-context";
import Pagination from "@/components/ui/pagination";
import { EmptyMessage } from "@/components/custom/message";
import { FolderCard } from "@/components/custom/cards";
import { MaterialsSkeleton } from "@/components/skeleton";

const MaterialFolderLists = ({ customLoading }) => {
    const router = useRouter();
    const { modalClosed } = useModal();
    // const { page = 1 } = router.query;

    const { data, isLoading, mutate } = useSWR(
        [`material-categories/`, router.locale],
        (url, locale) => {
            // const queryParams = new URLSearchParams({
            //     page: p,
            //     page_size: 12,
            // });
            return fetcher(
                `${url}?page=all`,
                { headers: { "Accept-Language": locale } },
                {},
                true
            );
        }
    );

    useEffect(() => {
        if (modalClosed?.refresh) {
            mutate();
        }
    }, [modalClosed, mutate]);

    if (customLoading || isLoading) {
        return <MaterialsSkeleton />;
    }

    return (
        <div className="flex flex-col space-y-8 pb-10">
            {data?.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                    {data?.map((folder) => (
                        <FolderCard key={folder.id} item={folder} />
                    ))}
                </div>
            ) : (
                <EmptyMessage
                    titleKey="Jildlar topilmadi"
                    descriptionKey="Hozircha hech qanday jild yaratilmagan"
                    iconKey="folder"
                />
            )}

            {/* {data?.count > 0 && (
                <div className="pt-8 border-t border-slate-100">
                    <Pagination totalCount={data.count} pageSize={12} />
                </div>
            )} */}
        </div>
    );
};

export default MaterialFolderLists;