import { useIntl } from "react-intl";
import Seo from "@/components/seo/seo";
import { AuthGuard } from "@/components/guard";
import { PageHeader } from "@/components/layout";
import { InvitationLists } from "@/components/dashboard/admin";
import { useModal } from "@/context/modal-context";

function InvitatitionsPage({ info }) {
  const intl = useIntl();
  const { openModal } = useModal();

  return (
    <>
      <Seo
        title={intl.formatMessage({ id: "invite_title" })}
        description={intl.formatMessage({ id: "invite_desc" })}
        keywords={intl.formatMessage({ id: "invite_key" })}
      />
      <AuthGuard roles={["CENTER_ADMIN"]}>
        <PageHeader
          title="invite_title"
          description="invite_desc"
          badge="Faol"
          buttonLabel="Kod qo'shish"
          onButtonClick={() => openModal("INVITE_FORM", {}, "middle")}
        />
        <InvitationLists />
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

export default InvitatitionsPage;
