import { useIntl } from "react-intl";
import Seo from "@/components/seo/seo";
import { AuthGuard } from "@/components/guard";
import { PageHeader } from "@/components/layout";
import { useModal } from "@/context/modal-context";
import { UserLists } from "@/components/dashboard/admin";
import { Filter, Search } from "lucide-react";
import { SearchInput } from "@/components/ui";
import GroupLists from "@/components/dashboard/admin/group-lists";

function GroupsPage({ info }) {
  const intl = useIntl();
  const { openModal } = useModal();

  return (
    <>
      <Seo
        title={intl.formatMessage({ id: "groups_title" })}
        description={intl.formatMessage({ id: "groups_desc" })}
        keywords={intl.formatMessage({ id: "groups_key" })}
      />
      <AuthGuard roles={["CENTER_ADMIN"]}>
        <PageHeader
          title="groups_title"
          description="groups_desc"
          badge="Faol"
          buttonLabel="Guruh qo'shish"
          roles={["CENTER_ADMIN"]}
          onButtonClick={() => openModal("GROUP_FORM", {}, "middle")}
          extraActions={
            <>
              <SearchInput />
            </>
          }
        />
        <GroupLists />
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

export default GroupsPage;
