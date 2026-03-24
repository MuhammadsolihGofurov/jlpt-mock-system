import { useIntl } from "react-intl";
import Seo from "@/components/seo/seo";
import { AuthGuard } from "@/components/guard";
import { AnalyticsContainer, MonitoringContainer } from "@/components/custom/analytics";
import { PageHeader } from "@/components/layout";
import { Filter, Search } from "lucide-react";
import { CenterLists } from "@/components/dashboard/owner";
import { useModal } from "@/context/modal-context";

function MonitoringPage({ info }) {
    const intl = useIntl();
    const { openModal } = useModal();

    return (
        <>
            <Seo
                title={intl.formatMessage({ id: "Monitoring" })}
                description={intl.formatMessage({ id: "Monitoring_desc" })}
                keywords={intl.formatMessage({ id: "Monitoring" })}
            />
            <AuthGuard roles={["OWNER"]}>
                <PageHeader
                    title="Monitoring"
                    description="Monitoring_desc"
                    badge="Faol"
                />

                <MonitoringContainer />
            </AuthGuard>
        </>
    );
}

export async function getServerSideProps() {
    try {
        const pageData = {
            seo_title: "Centers",
            meta_description: "Centers description",
            meta_keywords: "mikan login",
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

export default MonitoringPage;
