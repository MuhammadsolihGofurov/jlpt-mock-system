import { useIntl } from "react-intl";
import Seo from "@/components/seo/seo";
import { AuthGuard, withAuthGuard } from "@/components/guard";
import { PageHeader } from "@/components/layout";
import { FileText, Filter, GraduationCap, Search } from "lucide-react";
import { useModal } from "@/context/modal-context";
import {
  AssignmentTabs,
  ExamLists,
} from "@/components/dashboard/admin-teacher";
import { SearchInput } from "@/components/ui";
import { examTypes } from "@/types/exam-types";
import { examTabs } from "@/types/tabs";

function ExamAssignmentsPage({ customLoading }) {
  const intl = useIntl();
  const { openModal } = useModal();

  const currentExamType = examTypes["jlpt"];

  return (
    <>
      <Seo
        title={intl.formatMessage({ id: "JLPT imtihoni" })}
        description={intl.formatMessage({ id: "exams_desc" })}
        keywords={intl.formatMessage({ id: "exams_key" })}
      />
      <PageHeader
        title="JLPT imtihoni"
        description="exams_desc"
        badge="Faol"
        buttonLabel="Imtihon qo'shish"
        roles={["CENTER_ADMIN", "TEACHER"]}
        onButtonClick={() => openModal("EXAM_FORM", { exam_type: currentExamType?.exam, currentExamType }, "middle")}
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
        customLoading={customLoading}
      />
      <AssignmentTabs
        tabs={examTabs}
        customLoading={customLoading}
      />
      <ExamLists
        path={currentExamType?.assignment}
        currentExamType={currentExamType}
        exam_type={currentExamType?.exam}
        customLoading={customLoading} />
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

export default withAuthGuard(ExamAssignmentsPage, ["CENTER_ADMIN", "TEACHER", "STUDENT"]);
