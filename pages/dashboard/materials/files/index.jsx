import { useIntl } from "react-intl";
import Seo from "@/components/seo/seo";
import { AuthGuard, withAuthGuard } from "@/components/guard";
import { PageHeader } from "@/components/layout";
import { useModal } from "@/context/modal-context";
import { MaterialLists, UserLists } from "@/components/dashboard/admin";
import { ChevronLeft, FileText, Filter, GraduationCap, Search } from "lucide-react";
import { SearchInput } from "@/components/ui";
import GroupLists from "@/components/dashboard/admin/group-lists";
import { AssignmentTabs } from "@/components/dashboard/admin-teacher";
import useSWR from "swr";
import fetcher from "@/utils/fetcher";
import { useRouter } from "next/router";

function MaterialsPage({ customLoading }) {
  const intl = useIntl();
  const router = useRouter();
  const { openModal } = useModal();

  return (
    <>
      <Seo
        title={intl.formatMessage({ id: "materials_title" })}
        description={intl.formatMessage({ id: "materials_desc" })}
        keywords={intl.formatMessage({ id: "materials_key" })}
      />
      <PageHeader
        title="materials_title"
        description="materials_desc"
        badge="Faol"
        buttonLabel="Material qo'shish"
        roles={["CENTER_ADMIN", "TEACHER"]}
        onButtonClick={() => openModal("MATERIAL_FORM", {}, "middle")}
        extraActions={
          <>
            <SearchInput />
            <button
              onClick={() => openModal("MATERIAL_FILTER", {}, "middle")}
              className="p-3 bg-white border border-gray-100 rounded-2xl text-muted hover:text-primary hover:border-orange-100 transition-all shadow-sm flex-1"
            >
              <Filter size={20} />
            </button>
          </>
        }
        customLoading={customLoading}
      />
      <div className="">
        <button onClick={() => { router.push("/dashboard/materials/folders") }} className="pl-4 pr-5 py-3 flex items-center justify-center rounded-full bg-gray/10 backdrop-blur-xl gap-1 border border-gray/20 text-sm text-black">
          <ChevronLeft size={14} /> {intl.formatMessage({ id: "Orqaga" })}
        </button>
      </div>
      <MaterialLists customLoading={customLoading}/>
    </>
  );
}

export async function getServerSideProps() {
  try {
    const pageData = {
      seo_title: "Xush kelibsiz!",
      meta_description: "description",
      meta_keywords: "mikan",
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

export default withAuthGuard(MaterialsPage, ["CENTER_ADMIN", "TEACHER", "STUDENT"]);
