import { useIntl } from "react-intl";
import Seo from "@/components/seo/seo";
import { AuthGuard, withAuthGuard } from "@/components/guard";
import { PageHeader } from "@/components/layout";
import { FileText, Filter, GraduationCap, Search } from "lucide-react";
import { useModal } from "@/context/modal-context";
import {
  AssignmentTabs,
  HomeworkLists,
} from "@/components/dashboard/admin-teacher";
import { SearchInput } from "@/components/ui";
import { examTabs } from "@/types/tabs";

function HomeworkAssignmentsPage({ customLoading }) {
  const intl = useIntl();
  const { openModal } = useModal();

  return (
    <>
      <Seo
        title={intl.formatMessage({ id: "homework_title" })}
        description={intl.formatMessage({ id: "homework_desc" })}
        keywords={intl.formatMessage({ id: "homework_key" })}
      />
      <PageHeader
        title="homework_title"
        description="homework_desc"
        badge="Faol"
        buttonLabel="Uyga vazifa qo'shish"
        roles={["CENTER_ADMIN", "TEACHER"]}
        onButtonClick={() => openModal("HOMEWORK_FORM", {}, "middle")}
        extraActions={
          <>
            <SearchInput />
          </>
        }
        customLoading={customLoading}
      />
      <AssignmentTabs
        tabs={examTabs}
        customLoading={customLoading}
      />
      <HomeworkLists customLoading={customLoading} />
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

export default withAuthGuard(HomeworkAssignmentsPage, ["CENTER_ADMIN", "TEACHER", "STUDENT"]);
