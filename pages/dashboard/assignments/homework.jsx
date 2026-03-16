import { useIntl } from "react-intl";
import Seo from "@/components/seo/seo";
import { AuthGuard } from "@/components/guard";
import { PageHeader } from "@/components/layout";
import { FileText, Filter, GraduationCap, Search } from "lucide-react";
import { useModal } from "@/context/modal-context";
import {
  AssignmentTabs,
  HomeworkLists,
} from "@/components/dashboard/admin-teacher";
import { SearchInput } from "@/components/ui";

function HomeworkAssignmentsPage({ info }) {
  const intl = useIntl();
  const { openModal } = useModal();

  return (
    <>
      <Seo
        title={intl.formatMessage({ id: "homework_title" })}
        description={intl.formatMessage({ id: "homework_desc" })}
        keywords={intl.formatMessage({ id: "homework_key" })}
      />
      <AuthGuard roles={["CENTER_ADMIN", "TEACHER"]}>
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
        />
        <AssignmentTabs
          tabs={[
            {
              id: "exam",
              label: "Imtihonlar",
              path: "/dashboard/assignments/exam",
              icon: <GraduationCap size={20} />,
            },
            {
              id: "homework",
              label: "Vazifalar",
              path: "/dashboard/assignments/homework",
              icon: <FileText size={20} />,
            },
          ]}
        />
        <HomeworkLists />
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

export default HomeworkAssignmentsPage;
