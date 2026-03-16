import React, { useState } from "react";
import { useRouter } from "next/router";
import useSWR from "swr";
import fetcher from "@/utils/fetcher";
import { Plus, ChevronRight, Settings, LayoutGrid } from "lucide-react";
import { useModal } from "@/context/modal-context";
import { SectionList } from "@/components/dashboard/admin-teacher";
import GroupAndQuestionArea from "@/components/dashboard/admin-teacher/question-group-area";
import { Seo } from "@/components/seo";
import { AuthGuard } from "@/components/guard";
import { useIntl } from "react-intl";

const MockManagePage = () => {
  const router = useRouter();
  const intl = useIntl();
  const { id: mockId } = router.query;
  const { openModal } = useModal();
  const [activeSection, setActiveSection] = useState(null);

  const { data: mock } = useSWR(
    mockId ? [`/mock-tests/${mockId}/`, router.locale] : null,
    (url, locale) =>
      fetcher(url, { headers: { "Accept-Language": locale } }, {}, true),
  );

  return (
    <>
      <Seo
        title={mock?.title}
        description={mock?.description}
        keywords={"mocks"}
      />
      <AuthGuard roles={["CENTER_ADMIN", "TEACHER"]}>
        <div className="flex flex-col min-h-screen bg-[#F8FAFC]">
          {/* Header */}
          <div className="bg-white border-b border-slate-100 px-8 py-4 flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-orange-50 text-primary rounded-2xl">
                <LayoutGrid size={24} />
              </div>
              <div>
                <h1 className="text-xl font-black text-heading">
                  {mock?.title}
                </h1>
                <p className="text-xs text-muted font-bold uppercase tracking-wider">
                  {mock?.level}
                </p>
              </div>
            </div>
            <button
              onClick={() => router.push("/dashboard/mocks")}
              className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 rounded-xl font-bold transition-all"
            >
              {intl.formatMessage({ id: "Orqaga" })}
            </button>
          </div>

          <div className="flex flex-1 xl:flex-row flex-col overflow-hidden p-6 gap-3 xl:gap-6">
            {/* 1. SECTIONS SIDEBAR */}
            <aside className="w-full xl:w-1/4 bg-white rounded-[2.5rem] border border-slate-100 flex flex-col overflow-hidden shadow-sm">
              <div className="p-6 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
                <span className="font-black text-slate-800 uppercase text-sm tracking-widest">
                  {intl.formatMessage({ id: "Bo'limlar" })}
                </span>
                <button
                  onClick={() =>
                    openModal("SECTION_FORM", { mockId }, "middle")
                  }
                  className="p-2 bg-primary text-white rounded-xl shadow-lg shadow-orange-100 hover:scale-105 transition-all"
                >
                  <Plus size={18} />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-4">
                <SectionList
                  mockId={mockId}
                  sections={mock?.sections}
                  activeSection={activeSection}
                  onSelect={setActiveSection}
                />
              </div>
            </aside>

            {/* 2. GROUPS & QUESTIONS AREA */}
            <main className="flex-1 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-y-auto">
              {activeSection ? (
                <GroupAndQuestionArea section={activeSection} />
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center p-10">
                  <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4 text-slate-300">
                    <ChevronRight size={40} />
                  </div>
                  <h3 className="text-xl font-black text-heading">
                    {intl.formatMessage({ id: "Bo'lim tanlang" })}
                  </h3>
                  <p className="text-muted max-w-xs">
                    {intl.formatMessage({id: `Savollar va guruhlarni ko'rish uchun chap tomondan kerakli
                    bo'limni tanlang`})}
                  </p>
                </div>
              )}
            </main>
          </div>
        </div>
      </AuthGuard>
    </>
  );
};

export default MockManagePage;
