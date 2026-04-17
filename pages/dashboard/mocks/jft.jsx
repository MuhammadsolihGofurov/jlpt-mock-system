import { useIntl } from "react-intl";
import Seo from "@/components/seo/seo";
import { AuthGuard, withAuthGuard } from "@/components/guard";
import { PageHeader } from "@/components/layout";
import { useModal } from "@/context/modal-context";
import { MaterialLists, UserLists } from "@/components/dashboard/admin";
import { Book, BookOpen, FileQuestion, Filter, Search } from "lucide-react";
import { SearchInput } from "@/components/ui";
import GroupLists from "@/components/dashboard/admin/group-lists";
import {
    AssignmentTabs,
    JFTlist,
} from "@/components/dashboard/admin-teacher";
import { mockTabs } from "@/types/tabs";

function JFTPage({ customLoading }) {
    const intl = useIntl();
    const { openModal } = useModal();

    return (
        <>
            <Seo
                title={intl.formatMessage({ id: "JFT" })}
                description={intl.formatMessage({ id: "jft_desc" })}
                keywords={intl.formatMessage({ id: "jft_key" })}
            />
            <PageHeader
                title="JFT"
                description="jft_desc"
                badge="Faol"
                buttonLabel="JFT qo'shish"
                roles={["CENTER_ADMIN", "TEACHER"]}
                onButtonClick={() => openModal("JFT_MOCK_FORM", {}, "middle")}
                extraActions={
                    <>
                        <SearchInput />
                    </>
                }
                customLoading={customLoading}
            />
            <AssignmentTabs
                tabs={mockTabs}
                customLoading={customLoading}
            />
            <JFTlist customLoading={customLoading} />
        </>
    );
}

export async function getServerSideProps() {
    try {
        const pageData = {
            seo_title: "Xush kelibsiz!",
            meta_description: "description",
            meta_keywords: "mikan",
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

export default withAuthGuard(JFTPage, ["CENTER_ADMIN", "TEACHER"]);
