import { useIntl } from "react-intl";
import Seo from "@/components/seo/seo";
import { AuthGuard } from "@/components/guard";
import { useModal } from "@/context/modal-context";
import { FlashcardPlayground } from "@/components/dashboard/student";
import { useRouter } from "next/router";
import fetcher from "@/utils/fetcher";
import useSWR from "swr";

function FlashcardsEditPage({ info }) {
    const intl = useIntl();
    const router = useRouter();
    const { query } = router;

    const { data: flashcard_data, mutate, isLoading } = useSWR(
        [`flashcard-sets/`, router.locale, query?.id],
        (url, locale, id) => fetcher(`${url}${id}`, { headers: { "Accept-Language": locale } }, {}, true)
    );

    const { data: cards } = useSWR(
        query?.id ? [`flashcards/`, router.locale, query?.id] : null,
        (url, locale, id) => fetcher(`${url}?flashcard_set=${id}&page=all`, { headers: { "Accept-Language": locale } }, {}, true)
    );

    return (
        <>
            <Seo
                title={intl.formatMessage({ id: "flashcards_title" })}
                description={intl.formatMessage({ id: "flashcards_desc" })}
                keywords={intl.formatMessage({ id: "flashcards_key" })}
            />
            <AuthGuard roles={["STUDENT", "TEACHER", "CENTER_ADMIN", "OWNER"]}>
                <FlashcardPlayground flashcard_data={flashcard_data} cards={cards} />
            </AuthGuard>
        </>
    );
}

export async function getServerSideProps() {
    try {
        const pageData = {
            seo_title: "Flashcards",
            meta_description: "Flashcards description",
            meta_keywords: "flashcards login",
        };

        if (!pageData) {
            return { notFound: true };
        }

        return {
            props: {
                info: pageData,
            },
        };
    } catch (error) {
        console.error("Fetch Error:", error);
        return { notFound: true };
    }
}

export default FlashcardsEditPage;
