import { useIntl } from "react-intl";
import Seo from "@/components/seo/seo";
import { AuthGuard } from "@/components/guard";
import { FlashcardStudy } from "@/components/dashboard/student";
import { useRouter } from "next/router";
import fetcher from "@/utils/fetcher";
import useSWR from "swr";
import { useState } from "react";

function FlashcardSetsPage({ info }) {
    const intl = useIntl();
    const router = useRouter();
    const { query } = router;
    const [studyMode, setStudyMode] = useState("SEQUENTIAL");

    const { data: studyData, mutate, isLoading } = useSWR(
        query?.id ? [`flashcard-sets/`, router.locale, query.id, studyMode] : null,
        (url, locale, id, mode) => fetcher(`${url}${id}/study/?mode=${mode}`, { headers: { "Accept-Language": locale } }, {}, true)
    );

    const handleModeChange = (newMode) => {
        setStudyMode(newMode);
        mutate();
    };

    return (
        <>
            <Seo title={intl.formatMessage({ id: "Study Mode" })} />
            <AuthGuard roles={["STUDENT"]}>
                <div className="min-h-screen bg-[#f8fafc] py-12 px-6">
                    <div className="max-w-6xl mx-auto">

                        {/* Header Section */}
                        <div className="mb-10 flex items-center flex-wrap gap-5 justify-between">
                            <div>
                                <h1 className="text-3xl font-black text-slate-800">{intl.formatMessage({ id: "Study Mode" })}</h1>
                                <p className="text-slate-500">{intl.formatMessage({ id: "Kartochkalarni yodlash orqali bilimingizni oshiring" })}</p>
                            </div>
                            <button
                                onClick={() => router.push("/dashboard/flashcards")}
                                className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 rounded-xl font-bold transition-all"
                            >
                                {intl.formatMessage({ id: "Orqaga" })}
                            </button>
                        </div>

                        {/* Study Component */}
                        {isLoading ? (
                            <div className="h-[500px] flex items-center justify-center bg-white rounded-[2.5rem] animate-pulse border-2 border-slate-50">
                                <div className="text-slate-300 font-bold">{intl.formatMessage({ id: "Yuklanmoqda..." })}</div>
                            </div>
                        ) : studyData?.cards?.length > 0 ? (
                            <FlashcardStudy
                                cards={studyData.cards}
                                mode={studyMode}
                                onModeChange={handleModeChange}
                            />
                        ) : (
                            <div className="text-center py-20 bg-white rounded-[2.5rem] border-2 border-dashed">
                                <p className="text-slate-400">{intl.formatMessage({ id: "Hozircha kartalar mavjud emas." })}</p>
                            </div>
                        )}

                    </div>
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

export default FlashcardSetsPage;
