import { useIntl } from "react-intl";
import Seo from "@/components/seo/seo";
import { AuthGuard } from "@/components/guard";
import { AnalyticsContainer } from "@/components/custom/analytics";
import { PageHeader } from "@/components/layout";
import { Filter, Search } from "lucide-react";
import { CenterLists } from "@/components/dashboard/owner";
import { useModal } from "@/context/modal-context";

function CentersPage({ info }) {
  const intl = useIntl();
  const { openModal } = useModal();

  return (
    <>
      <Seo
        title={intl.formatMessage({ id: "centers_title" })}
        description={intl.formatMessage({ id: "centers_desc" })}
        keywords={intl.formatMessage({ id: "centers_key" })}
      />
      <AuthGuard roles={["OWNER", "CENTER_ADMIN", "TEACHER", "STUDENT"]}>
        <PageHeader
          title="centers_title"
          description="centers_desc"
          badge="Faol"
          buttonLabel="Markaz qo'shish"
          onButtonClick={() => openModal("centerForm", {}, "middle")}
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

        <CenterLists />
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

export default CentersPage;
