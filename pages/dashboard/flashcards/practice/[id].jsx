import { useIntl } from "react-intl";
import Seo from "@/components/seo/seo";
import { AuthGuard } from "@/components/guard";
import { FlashcardPractice } from "@/components/dashboard/student";
import { useRouter } from "next/router";

function FlashcardPracticePage({ info }) {
    const intl = useIntl();
    const router = useRouter();
    const { query } = router;
    const setId = query?.id;

    return (
        <>
            <Seo
                title={intl.formatMessage({ id: "flashcards_title" })}
                description={intl.formatMessage({ id: "flashcards_desc" })}
                keywords={intl.formatMessage({ id: "flashcards_key" })}
            />
            <AuthGuard roles={["STUDENT"]}>
                <div className="container mx-auto py-12 px-6">
                    {setId ? (
                        <FlashcardPractice setId={setId} />
                    ) : (
                        <div className="text-center text-slate-400">{intl.formatMessage({ id: "Yuklanmoqda..." })}</div>
                    )}
                </div>
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

export default FlashcardPracticePage;
