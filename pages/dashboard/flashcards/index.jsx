import { useIntl } from "react-intl";
import Seo from "@/components/seo/seo";
import { AuthGuard } from "@/components/guard";
import { PageHeader } from "@/components/layout";
import { FileText, Filter, GraduationCap, Search } from "lucide-react";
import { useModal } from "@/context/modal-context";
import {
    AssignmentTabs,
    ExamLists,
} from "@/components/dashboard/admin-teacher";
import { SearchInput } from "@/components/ui";
import { FlashcardList } from "@/components/dashboard/student";
import { useRouter } from "next/router";
import useSWR from "swr";

function FlashcardsPage({ info }) {
    const intl = useIntl();
    const router = useRouter();



    return (
        <>
            <Seo
                title={intl.formatMessage({ id: "flashcards_title" })}
                description={intl.formatMessage({ id: "flashcards_desc" })}
                keywords={intl.formatMessage({ id: "flashcards_key" })}
            />
            <AuthGuard roles={["STUDENT", "TEACHER", "CENTER_ADMIN", "OWNER"]}>
                <PageHeader
                    title="flashcards_title"
                    description="flashcards_desc"
                    badge="Faol"
                    buttonLabel="Flash kart qo'shish"
                    roles={["STUDENT", "TEACHER", "CENTER_ADMIN", "OWNER"]}
                    onButtonClick={() => router.push("/dashboard/flashcards/create")}
                    extraActions={
                        <>
                            <SearchInput />
                        </>
                    }
                />
                <FlashcardList />
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

export default FlashcardsPage;
