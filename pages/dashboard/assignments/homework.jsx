import { useIntl } from "react-intl";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Seo from "@/components/seo/seo";
import { AuthGuard, withAuthGuard } from "@/components/guard";
import { PageHeader } from "@/components/layout";
import { AlertCircle, X } from "lucide-react";
import { useModal } from "@/context/modal-context";
import {
  AssignmentTabs,
  HomeworkLists,
} from "@/components/dashboard/admin-teacher";
import { SearchInput } from "@/components/ui";
import { examTabs } from "@/types/tabs";

function HomeworkAssignmentsPage({ customLoading }) {
  const intl = useIntl();
  const router = useRouter();
  const { openModal } = useModal();
  const [showTimeUpModal, setShowTimeUpModal] = useState(false);

  useEffect(() => {
    if (router.query.timeup === "1") {
      setShowTimeUpModal(true);
      router.replace("/dashboard/assignments/homework", undefined, { shallow: true });
    }
  }, [router.query.timeup]);

  return (
    <>
      {showTimeUpModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-[2.5rem] p-10 shadow-2xl flex flex-col items-center gap-6 max-w-sm w-full mx-4">
            <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center">
              <AlertCircle className="text-red-500" size={44} strokeWidth={2.5} />
            </div>
            <div className="text-center">
              <h2 className="text-2xl font-black text-slate-900 mb-2">{intl.formatMessage({ id: "Vaqt tugadi!" })}</h2>
              <p className="text-slate-500 text-sm font-medium">{intl.formatMessage({ id: "Berilgan vaqt tugadi. Javoblaringiz avtomatik yuborildi." })}</p>
            </div>
            <button
              onClick={() => setShowTimeUpModal(false)}
              className="w-full py-4 rounded-2xl bg-red-500 hover:bg-red-600 text-white font-black text-base transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              <X size={18} />
              {intl.formatMessage({ id: "Yopish" })}
            </button>
          </div>
        </div>
      )}
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
