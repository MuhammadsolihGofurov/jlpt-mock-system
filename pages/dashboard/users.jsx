import { useIntl } from "react-intl";
import Seo from "@/components/seo/seo";
import { AuthGuard, withAuthGuard } from "@/components/guard";
import { PageHeader } from "@/components/layout";
import { useModal } from "@/context/modal-context";
import { UserLists } from "@/components/dashboard/admin";
import { Filter, Search } from "lucide-react";
import { SearchInput } from "@/components/ui";

function UsersPage({ customLoading }) {
  const intl = useIntl();
  const { openModal } = useModal();

  return (
    <>
      <Seo
        title={intl.formatMessage({ id: "user_title" })}
        description={intl.formatMessage({ id: "user_desc" })}
        keywords={intl.formatMessage({ id: "user_key" })}
      />
      <PageHeader
        title="user_title"
        description="user_desc"
        badge="Faol"
        roles={["CENTER_ADMIN"]}
        extraActions={
          <>
            <SearchInput />
            <button
              onClick={() => openModal("USER_FILTER", {}, "middle")}
              className="p-3 bg-white border border-gray-100 rounded-2xl text-muted hover:text-primary hover:border-orange-100 transition-all shadow-sm flex-1"
            >
              <Filter size={20} />
            </button>
          </>
        }
        customLoading={customLoading}
      />
      <UserLists customLoading={customLoading}/>
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

export default withAuthGuard(UsersPage, ["CENTER_ADMIN"]);
