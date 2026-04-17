import { useIntl } from "react-intl";
import Seo from "@/components/seo/seo";
import { AuthGuard, withAuthGuard } from "@/components/guard";
import { PageHeader } from "@/components/layout";
import { InvitationLists } from "@/components/dashboard/admin";
import { useModal } from "@/context/modal-context";

function InvitatitionsPage({ customLoading }) {
  const intl = useIntl();
  const { openModal } = useModal();

  return (
    <>
      <Seo
        title={intl.formatMessage({ id: "invite_title" })}
        description={intl.formatMessage({ id: "invite_desc" })}
        keywords={intl.formatMessage({ id: "invite_key" })}
      />
      <PageHeader
        title="invite_title"
        description="invite_desc"
        badge="Faol"
        roles={["CENTER_ADMIN"]}
        buttonLabel="Kod qo'shish"
        onButtonClick={() => openModal("INVITE_FORM", {}, "middle")}
        customLoading={customLoading}
      />
      <InvitationLists customLoading={customLoading} />
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

export default withAuthGuard(InvitatitionsPage, ["CENTER_ADMIN"]);
