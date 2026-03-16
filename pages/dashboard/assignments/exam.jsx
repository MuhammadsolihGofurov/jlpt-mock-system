import { useIntl } from "react-intl";
import Seo from "@/components/seo/seo";
import { AuthGuard } from "@/components/guard";
import { PageHeader } from "@/components/layout";
import { Filter, Search } from "lucide-react";
import { useModal } from "@/context/modal-context";
import {
  AssignmentTabs,
  ExamLists,
} from "@/components/dashboard/admin-teacher";
import { SearchInput } from "@/components/ui";

function ExamAssignmentsPage({ info }) {
  const intl = useIntl();
  const { openModal } = useModal();

  return (
    <>
      <Seo
        title={intl.formatMessage({ id: "exams_title" })}
        description={intl.formatMessage({ id: "exams_desc" })}
        keywords={intl.formatMessage({ id: "exams_key" })}
      />
      <AuthGuard roles={["CENTER_ADMIN", "TEACHER", "STUDENT"]}>
        <PageHeader
          title="exams_title"
          description="exams_desc"
          badge="Faol"
          buttonLabel="Imtihon qo'shish"
          roles={["CENTER_ADMIN", "TEACHER"]}
          onButtonClick={() => openModal("EXAM_FORM", {}, "middle")}
          extraActions={
            <>
              <SearchInput />
              <button
                onClick={() => openModal("EXAM_FILTER", {}, "middle")}
                className="p-3 bg-white border border-gray-100 rounded-2xl text-muted hover:text-primary hover:border-orange-100 transition-all shadow-sm flex-1"
              >
                <Filter size={20} />
              </button>
            </>
          }
        />
        <AssignmentTabs />
        <ExamLists />
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

export default ExamAssignmentsPage;
