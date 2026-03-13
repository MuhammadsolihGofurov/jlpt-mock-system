import { useIntl } from "react-intl";
import Seo from "@/components/seo/seo";
import { AuthGuard } from "@/components/guard";
import { AnalyticsContainer } from "@/components/custom/analytics";
import { PageHeader } from "@/components/layout";

function Dashboard({ info }) {
  const intl = useIntl();

  return (
    <>
      <Seo
        title={intl.formatMessage({ id: "dash_title" })}
        description={intl.formatMessage({ id: "dash_desc" })}
        keywords={intl.formatMessage({ id: "dash_key" })}
      />
      <AuthGuard roles={["OWNER", "CENTER_ADMIN", "TEACHER", "STUDENT"]}>
        <PageHeader
          title={"Xush kelibsiz!"}
          description={"dash_desc"}
          badge="Faol"
        />
        <AnalyticsContainer />
      </AuthGuard>
    </>
  );
}

export async function getServerSideProps() {
  try {
    const pageData = {
      seo_title: "Kirish",
      meta_description: "Kirish description",
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

export default Dashboard;
