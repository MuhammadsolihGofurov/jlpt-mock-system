import React from "react";
import { useRouter } from "next/router";
import useSWR from "swr";
import fetcher from "@/utils/fetcher";
import { useIntl } from "react-intl";
import Seo from "@/components/seo/seo";
import { AuthGuard, withAuthGuard } from "@/components/guard";
import { PageHeader } from "@/components/layout";
import { useModal } from "@/context/modal-context";
import {
  Type,
  BookOpen,
  Headphones,
  Clock,
  Target,
  Trophy,
  ArrowRight,
  Activity,
  ChevronRight,
  ArrowLeft,
  Download
} from "lucide-react";
import { MyResultExam } from "@/components/dashboard/student/jft";


const MyJftExamResultPage = ({ customLoading }) => {
  const router = useRouter();
  const intl = useIntl();
  const { id: examId } = router.query

  return (
    <>
      <Seo title={`My Result`} />
      <PageHeader
        title={"Topshirilgan natijalar"}
        description={`Batafsil natijalari ro'yxati`}
        buttonLabel={"Orqaga"}
        roles={["STUDENT"]}
        icon={<ArrowLeft size={18} strokeWidth={2} />}
        onButtonClick={() => router.push("/dashboard/assignments/exam-jft")}
        customLoading={customLoading}
      />

      <MyResultExam examId={examId} customLoading={customLoading} />
    </>
  );
};




export default withAuthGuard(MyJftExamResultPage, ["STUDENT"]);
