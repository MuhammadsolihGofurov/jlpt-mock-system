import { useIntl } from "react-intl";
import Seo from "@/components/seo/seo";
import { AuthGuard, withAuthGuard } from "@/components/guard";
import { PageHeader } from "@/components/layout";
import { useModal } from "@/context/modal-context";
import { MaterialLists, UserLists } from "@/components/dashboard/admin";
import { Book, BookOpen, FileQuestion, Filter, Search } from "lucide-react";
import { SearchInput } from "@/components/ui";
import GroupLists from "@/components/dashboard/admin/group-lists";
import {
  AssignmentTabs,
  MockLists,
  QuizLists,
} from "@/components/dashboard/admin-teacher";
import { mockTabs } from "@/types/tabs";

function QuizPage({ customLoading }) {
  const intl = useIntl();
  const { openModal } = useModal();

  return (
    <>
      <Seo
        title={intl.formatMessage({ id: "Quizlar" })}
        description={intl.formatMessage({ id: "quiz_desc" })}
        keywords={intl.formatMessage({ id: "mock_key" })}
      />
      <PageHeader
        title="Quizlar"
        description="mock_desc"
        badge="Faol"
        buttonLabel="Quiz qo'shish"
        roles={["CENTER_ADMIN", "TEACHER"]}
        onButtonClick={() => openModal("QUIZ_FORM", {}, "video")}
        extraActions={
          <>
            <SearchInput />
            <button
              onClick={() => openModal("QUIZ_FILTER", {}, "middle")}
              className="p-3 bg-white border border-gray-100 rounded-2xl text-muted hover:text-primary hover:border-orange-100 transition-all shadow-sm flex-1"
            >
              <Filter size={20} />
            </button>
          </>
        }
        customLoading={customLoading}
      />
      <AssignmentTabs
        tabs={mockTabs}
        customLoading={customLoading}
      />
      <QuizLists customLoading={customLoading} />
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

export default withAuthGuard(QuizPage, ["CENTER_ADMIN", "TEACHER"]);
