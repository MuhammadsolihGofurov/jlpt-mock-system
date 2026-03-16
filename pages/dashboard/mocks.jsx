import { useIntl } from "react-intl";
import Seo from "@/components/seo/seo";
import { AuthGuard } from "@/components/guard";
import { PageHeader } from "@/components/layout";
import { useModal } from "@/context/modal-context";
import { MaterialLists, UserLists } from "@/components/dashboard/admin";
import { BookOpen, FileQuestion, Filter, Search } from "lucide-react";
import { SearchInput } from "@/components/ui";
import GroupLists from "@/components/dashboard/admin/group-lists";
import {
  AssignmentTabs,
  MockLists,
} from "@/components/dashboard/admin-teacher";

function MocksPage({ info }) {
  const intl = useIntl();
  const { openModal } = useModal();

  return (
    <>
      <Seo
        title={intl.formatMessage({ id: "mock_title" })}
        description={intl.formatMessage({ id: "mock_desc" })}
        keywords={intl.formatMessage({ id: "mock_key" })}
      />
      <AuthGuard roles={["CENTER_ADMIN", "TEACHER"]}>
        <PageHeader
          title="mock_title"
          description="mock_desc"
          badge="Faol"
          buttonLabel="Mock qo'shish"
          roles={["CENTER_ADMIN", "TEACHER"]}
          onButtonClick={() => openModal("MOCK_FORM", {}, "middle")}
          extraActions={
            <>
              <SearchInput />
              <button
                onClick={() => openModal("MOCK_FILTER", {}, "middle")}
                className="p-3 bg-white border border-gray-100 rounded-2xl text-muted hover:text-primary hover:border-orange-100 transition-all shadow-sm flex-1"
              >
                <Filter size={20} />
              </button>
            </>
          }
        />
        <AssignmentTabs
          tabs={[
            {
              id: "exam",
              label: "mock_title",
              path: "/dashboard/mocks",
              icon: <BookOpen size={20} />,
            },
            {
              id: "homework",
              label: "Quizlar",
              path: "/dashboard/quiz",
              icon: <FileQuestion size={20} />,
            },
          ]}
        />
        <MockLists />
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

export default MocksPage;
