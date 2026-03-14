import { useIntl } from "react-intl";
import Seo from "@/components/seo/seo";
import { AuthGuard } from "@/components/guard";
import { AnalyticsContainer } from "@/components/custom/analytics";
import { PageHeader } from "@/components/layout";
import { Filter, Search } from "lucide-react";
import { CenterLists } from "@/components/dashboard/owner";
import { useModal } from "@/context/modal-context";

function SubscriptionPage({ info }) {
  const intl = useIntl();
  const { openModal } = useModal();

  return (
    <>
      <Seo
        title={intl.formatMessage({ id: "subs_title" })}
        description={intl.formatMessage({ id: "subs_desc" })}
        keywords={intl.formatMessage({ id: "subs_key" })}
      />
      <AuthGuard roles={["OWNER"]}>
        <PageHeader
          title="subs_title"
          description="subs_desc"
          badge="Faol"
          buttonLabel="Obuna qo'shish"
          onButtonClick={() => openModal("SUBSCRIPTION_FORM", {}, "middle")}
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

export default SubscriptionPage;
