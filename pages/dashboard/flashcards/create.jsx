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
import { FlashcardList, FlashcardPlayground } from "@/components/dashboard/student";

function FlashCardsCreatePage({ info }) {
    const intl = useIntl();
    const { openModal } = useModal();

    return (
        <>
            <Seo
                title={intl.formatMessage({ id: "flashcards_title" })}
                description={intl.formatMessage({ id: "flashcards_desc" })}
                keywords={intl.formatMessage({ id: "flashcards_key" })}
            />
            <AuthGuard roles={["STUDENT"]}>
                <FlashcardPlayground />
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

export default FlashCardsCreatePage;
