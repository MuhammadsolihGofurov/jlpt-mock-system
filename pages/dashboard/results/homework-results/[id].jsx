import React from "react";
import { useIntl } from "react-intl";
import Seo from "@/components/seo/seo";
import { AuthGuard } from "@/components/guard";
import { PageHeader } from "@/components/layout";
import { HomeworkSubmissionList } from "@/components/dashboard/admin-teacher";
import { useRouter } from "next/router";
import { ArrowLeft } from "lucide-react";

function HomeworkSubmissionsPage() {
    const intl = useIntl();
    const router = useRouter();

    return (
        <>
            <Seo
                title={intl.formatMessage({ id: "Homework Natijalari" })}
                description={intl.formatMessage({ id: "Uy vazifasini topshirgan talabalar natijalari" })}
            />
            <AuthGuard roles={["CENTER_ADMIN", "TEACHER"]}>
                <PageHeader
                    title="Homework Natijalari"
                    description={intl.formatMessage({ id: "Uy vazifasi doirasidagi topshiriqlar tahlili" })}
                    buttonLabel={"Orqaga"}
                    onButtonClick={() => router.push("/dashboard/assignments/homework")}
                    roles={["CENTER_ADMIN", "TEACHER"]}
                    icon={<ArrowLeft size={18} strokeWidth={3} />}
                />
                <HomeworkSubmissionList />
            </AuthGuard>
        </>
    );
}

export default HomeworkSubmissionsPage;