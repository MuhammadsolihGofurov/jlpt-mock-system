import { useIntl } from "react-intl";
import Seo from "@/components/seo/seo";
import { AuthGuard } from "@/components/guard";
import { PageHeader } from "@/components/layout";
import { useModal } from "@/context/modal-context";
import { MaterialFolderLists, MaterialLists, UserLists } from "@/components/dashboard/admin";
import { FileText, Filter, GraduationCap, Search } from "lucide-react";
import { SearchInput } from "@/components/ui";
import GroupLists from "@/components/dashboard/admin/group-lists";
import { AssignmentTabs } from "@/components/dashboard/admin-teacher";
import useSWR from "swr";
import fetcher from "@/utils/fetcher";
import { useRouter } from "next/router";

function FoldersPage({ info }) {
    const intl = useIntl();
    const router = useRouter();
    const { openModal } = useModal();

    return (
        <>
            <Seo
                title={intl.formatMessage({ id: "Jildlar" })}
                description={intl.formatMessage({ id: "folders_description" })}
                keywords={intl.formatMessage({ id: "materials_key" })}
            />
            <AuthGuard roles={["CENTER_ADMIN", "TEACHER", "STUDENT"]}>
                <PageHeader
                    title="Jildlar"
                    description="folders_description"
                    badge="Faol"
                    buttonLabel="Kategoriya qo'shish"
                    roles={["CENTER_ADMIN", "TEACHER"]}
                    onButtonClick={() => openModal("CATEGORY_MODAL", {}, "middle")}
                />
                <MaterialFolderLists />
            </AuthGuard>
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

export default FoldersPage;
