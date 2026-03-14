import { useIntl } from "react-intl";
import Seo from "@/components/seo/seo";
import { AuthGuard } from "@/components/guard";
import { PageHeader } from "@/components/layout";
import {
  AppearanceSettings,
  ProfileForm,
} from "@/components/dashboard/settings";

function ProfilePage({ info }) {
  const intl = useIntl();

  return (
    <>
      <Seo
        title={intl.formatMessage({ id: "profile_title" })}
        description={intl.formatMessage({ id: "profile_desc" })}
        keywords={intl.formatMessage({ id: "profile_key" })}
      />
      <AuthGuard roles={["OWNER", "CENTER_ADMIN", "TEACHER", "STUDENT"]}>
        <PageHeader
          title="profile_title"
          description="profile_desc"
          badge="Faol"
        />
        <ProfileForm />
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

export default ProfilePage;
