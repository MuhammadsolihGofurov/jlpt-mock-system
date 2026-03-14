import { useIntl } from "react-intl";
import Seo from "@/components/seo/seo";
import { AuthGuard } from "@/components/guard";
import { PageHeader } from "@/components/layout";
import { AppearanceSettings } from "@/components/dashboard/settings";

function SettingsPage({ info }) {
  const intl = useIntl();

  return (
    <>
      <Seo
        title={intl.formatMessage({ id: "settings_title" })}
        description={intl.formatMessage({ id: "settings_desc" })}
        keywords={intl.formatMessage({ id: "settings_key" })}
      />
      <AuthGuard roles={["OWNER", "CENTER_ADMIN", "TEACHER", "STUDENT"]}>
        <PageHeader
          title="settings_title"
          description="settings_desc"
          badge="Faol"
        />
        <AppearanceSettings />
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

export default SettingsPage;
