import React from "react";
import { useRouter } from "next/router";
import { useIntl } from "react-intl";
import Seo from "@/components/seo/seo";
import { withAuthGuard } from "@/components/guard";
import { PageHeader } from "@/components/layout";
import { MyResultExam } from "@/components/dashboard/student/jlpt";
import { ArrowLeft } from "lucide-react";

const MyExamResults = ({ customLoading }) => {
  const router = useRouter();
  const { id: examId } = router.query;

  return (
    <>
      <Seo title={`My Result`} />
      <PageHeader
        title={"Topshirilgan natijalar"}
        description={`Batafsil natijalari ro'yxati`}
        buttonLabel={"Orqaga"}
        roles={["STUDENT"]}
        icon={<ArrowLeft size={18} strokeWidth={2} />}
        onButtonClick={() => router.push("/dashboard/assignments/exam-jlpt")}
        customLoading={customLoading}
      />

      <MyResultExam examId={examId} customLoading={customLoading} />
    </>
  );
};


export default withAuthGuard(MyExamResults, ["STUDENT"]);
