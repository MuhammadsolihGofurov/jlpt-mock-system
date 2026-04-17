import React from "react";
import { useIntl } from "react-intl";
import Seo from "@/components/seo/seo";
import { AuthGuard, withAuthGuard } from "@/components/guard";
import { PageHeader } from "@/components/layout";
import { useRouter } from "next/router";
import { ArrowLeft } from "lucide-react";
import { JFTSubmissionLists } from "@/components/dashboard/admin-teacher/jft";

function ExamSubmissionsPage({ customLoading }) {
  const intl = useIntl();
  const router = useRouter();

  return (
    <>
      <Seo
        title={intl.formatMessage({ id: "Topshirilgan natijalar" })}
        description={intl.formatMessage({ id: "Imtihon topshirgan talabalarning batafsil natijalari ro'yxati" })}
      />
      <PageHeader
        title="Topshirilgan natijalar"
        description="Imtihon topshirgan talabalarning batafsil natijalari ro'yxati"
        buttonLabel={"Orqaga"}
        onButtonClick={() => router.push("/dashboard/assignments/exam-jft")}
        roles={["CENTER_ADMIN", "TEACHER"]}
        icon={<ArrowLeft size={18} strokeWidth={3} />}
        customLoading={customLoading}
      />
      <JFTSubmissionLists customLoading={customLoading} />
    </>
  );
}

export default withAuthGuard(ExamSubmissionsPage, ["CENTER_ADMIN", "TEACHER"]);
