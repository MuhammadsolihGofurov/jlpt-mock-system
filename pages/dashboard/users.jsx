import { useIntl } from "react-intl";
import Seo from "@/components/seo/seo";
import { AuthGuard } from "@/components/guard";
import { PageHeader } from "@/components/layout";
import { useModal } from "@/context/modal-context";
import { UserLists } from "@/components/dashboard/admin";

function UsersPage({ info }) {
  const intl = useIntl();
  const { openModal } = useModal();

  return (
    <>
      <Seo
        title={intl.formatMessage({ id: "user_title" })}
        description={intl.formatMessage({ id: "user_desc" })}
        keywords={intl.formatMessage({ id: "user_key" })}
      />
      <AuthGuard roles={["CENTER_ADMIN"]}>
        <PageHeader title="user_title" description="user_desc" badge="Faol" />
        <UserLists />
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

export default UsersPage;
