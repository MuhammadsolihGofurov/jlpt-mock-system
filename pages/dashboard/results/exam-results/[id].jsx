import React from "react";
import { useIntl } from "react-intl";
import Seo from "@/components/seo/seo";
import { AuthGuard } from "@/components/guard";
import { PageHeader } from "@/components/layout";
import { SubmissionLists } from "@/components/dashboard/admin-teacher";
import { useRouter } from "next/router";
import { ArrowLeft } from "lucide-react";

function ExamSubmissionsPage() {
  const intl = useIntl();
  const router = useRouter();

  return (
    <>
      <Seo
        title={intl.formatMessage({ id: "Topshirilgan natijalar" })}
        description={intl.formatMessage({ id: "Imtihon topshirgan talabalarning batafsil natijalari ro'yxati" })}
      />
      <AuthGuard roles={["CENTER_ADMIN", "TEACHER"]}>
        <PageHeader
          title="Topshirilgan natijalar"
          description="Imtihon topshirgan talabalarning batafsil natijalari ro'yxati"
          buttonLabel={"Orqaga"}
          onButtonClick={() => router.push("/dashboard/assignments/exam")}
          roles={["CENTER_ADMIN", "TEACHER"]}
          icon={<ArrowLeft size={18} strokeWidth={3}/>}
        />
        <SubmissionLists />
      </AuthGuard>
    </>
  );
}

export default ExamSubmissionsPage;
