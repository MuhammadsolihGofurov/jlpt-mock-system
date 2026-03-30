import React, { useEffect } from "react";
import { useRouter } from "next/router";
import useSWR from "swr";
import { useIntl } from "react-intl";
import { Plus } from "lucide-react";

import fetcher from "@/utils/fetcher";
import { useModal } from "@/context/modal-context";
import Pagination from "@/components/ui/pagination";
import { EmptyMessage } from "@/components/custom/message";
import { FlashcardDeckCard } from "@/components/custom/cards";

const FlashcardList = () => {
    const router = useRouter();
    const intl = useIntl();
    const { openModal, modalClosed } = useModal();

    const currentPage = router.query.page || 1;
    const searchTerms = router.query.search || "";

    const { data, mutate, isLoading } = useSWR(
        [`flashcard-sets/`, router.locale, currentPage, searchTerms],
        (url, locale, page, search) => fetcher(`${url}?page=${page}&page_size=6&search=${search}`, { headers: { "Accept-Language": locale } }, {}, true)
    );

    useEffect(() => {
        if (modalClosed?.refresh) {
            mutate();
        }
    }, [modalClosed, mutate]);

    const handleCardClick = (id) => {
        router.push(`/dashboard/flashcards/practise/${id}`);
    };

    if (isLoading) {
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 opacity-50">
                {[...Array(6)].map((_, i) => (
                    <div key={i} className="h-64 bg-slate-100 rounded-[2rem] animate-pulse" />
                ))}
            </div>
        );
    }

    return (
        <div className="flex flex-col min-h-full space-y-8">
            {/* Grid List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
                {data?.results?.map((deck) => (
                    <FlashcardDeckCard
                        key={deck.id}
                        deck={deck}
                        onClick={handleCardClick}
                        onEdit={(id) => openModal("EDIT_FLASHCARD_DECK", { id })}
                        onDelete={(id) => openModal("DELETE_FLASHCARD_DECK", { id })}
                    />
                ))}
            </div>

            {/* Empty State */}
            {data?.results?.length === 0 && (
                <EmptyMessage
                    titleKey="Flashcardlar topilmadi"
                    descriptionKey="Sizda hali hech qanday o'quv kartalari mavjud emas."
                    iconKey="default"
                />
            )}

            {/* Pagination */}
            {data?.count > 0 && (
                <div className="border-t border-slate-100">
                    <Pagination totalCount={data.count} pageSize={6} />
                </div>
            )}
        </div>
    );
};

export default FlashcardList;