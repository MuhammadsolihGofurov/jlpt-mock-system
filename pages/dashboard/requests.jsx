import { useIntl } from "react-intl";
import Seo from "@/components/seo/seo";
import { AuthGuard } from "@/components/guard";
import { AnalyticsContainer } from "@/components/custom/analytics";
import { PageHeader } from "@/components/layout";
import { Filter, Search } from "lucide-react";
import { CenterLists, RequestLists } from "@/components/dashboard/owner";
import { useModal } from "@/context/modal-context";

function Requests({ info }) {
    const intl = useIntl();
    const { openModal } = useModal();

    return (
        <>
            <Seo
                title={intl.formatMessage({ id: "So'rovlar" })}
                description={intl.formatMessage({ id: "So'rovlar" })}
                keywords={intl.formatMessage({ id: "So'rovlar" })}
            />
            <AuthGuard roles={["OWNER"]}>
                <PageHeader
                    title="So'rovlar"
                    description="Ushbu sahifada siz asosiy sahifadan kelgan so'rovlarni ko'ra olishingiz mumkin."
                    badge="Faol"
                //   extraActions={
                //     <>
                //       <button className="p-3 bg-white border border-gray-100 rounded-2xl text-muted hover:text-primary hover:border-orange-100 transition-all shadow-sm">
                //         <Search size={20} />
                //       </button>
                //       <button className="p-3 bg-white border border-gray-100 rounded-2xl text-muted hover:text-primary hover:border-orange-100 transition-all shadow-sm">
                //         <Filter size={20} />
                //       </button>
                //     </>
                //   }
                />

                <RequestLists />
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

export default Requests;
