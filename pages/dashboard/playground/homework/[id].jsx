import React, { useState } from "react";
import { useRouter } from "next/router";
import useSWR, { mutate } from "swr";
import fetcher from "@/utils/fetcher";
import { Seo } from "@/components/seo";
import { AuthGuard } from "@/components/guard";
import { useIntl } from "react-intl";
import {
  BookOpen,
  Award,
  ChevronLeft,
  ShieldCheck,
  ArrowRight,
  Loader2,
  CheckCircle2,
  FileText,
  RotateCcw,
  Info
} from "lucide-react";
import { authAxios } from "@/utils/axios";
import { handleApiError } from "@/utils/handle-error";
import { toast } from "react-toastify";
import { HomeworkPlayground } from "@/components/custom/playground";

const HomeworkPlaygroundPage = () => {
  const router = useRouter();
  const { id: homeworkId } = router.query;
  const intl = useIntl();

  const [activeItemData, setActiveItemData] = useState(null);
  const [loadingItemId, setLoadingItemId] = useState(null);

  const { data: homeworkInfo, isLoading } = useSWR(
    homeworkId ? [`/homework-assignments/${homeworkId}/`, router.locale] : null,
    (url, locale) => fetcher(url, { headers: { "Accept-Language": locale } }, {}, true)
  );

  const handleStartItem = async (item, type) => {
    try {
      setLoadingItemId(item.id);
      const res = await authAxios.post("/submissions/homework-start/", {
        homework_assignment_id: homeworkId,
        item_type: type,
        item_id: item.id
      });

      setActiveItemData({
        ...res.data,
        item_id: item.id
      });
    } catch (error) {
      toast.error(handleApiError(error));
    } finally {
      setLoadingItemId(null);
    }
  };

  const handleFinishItem = async (finalPayload) => {
    const toastId = toast.loading(intl.formatMessage({ id: "Natijalar saqlanmoqda..." }));
    try {
      await authAxios.post("/submissions/submit-homework/", finalPayload);

      toast.update(toastId, {
        render: intl.formatMessage({ id: "Natijalar muvaffaqiyatli saqlandi!" }),
        type: "success",
        isLoading: false,
        autoClose: 2000,
      });

      setActiveItemData(null);
      mutate([`/homework-assignments/${homeworkId}/`, router.locale]);
    } catch (error) {
      toast.update(toastId, {
        render: handleApiError(error),
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
    }
  };

  // UI hisob-kitoblari
  const totalItemsCount = (homeworkInfo?.mock_tests?.length || 0) + (homeworkInfo?.quizzes?.length || 0);
  const totalFinishedItems =
    (homeworkInfo?.mock_tests?.filter(i => i.status === "Completed").length || 0) +
    (homeworkInfo?.quizzes?.filter(i => i.status === "Completed").length || 0);

  if (activeItemData) {
    return (
      <>
        <Seo title={activeItemData.item_data?.title} />
        <HomeworkPlayground
          data={activeItemData}
          onFinish={handleFinishItem}
          onBack={() => setActiveItemData(null)}
        />
      </>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Loader2 className="animate-spin text-primary" size={40} />
      </div>
    )
  }

  return (
    <AuthGuard roles={["STUDENT"]}>
      <Seo title={homeworkInfo?.title || "Homework"} />
      <div className="min-h-screen bg-[#FDFDFF] pb-10 font-sans">
        <nav className="max-w-7xl mx-auto px-6 py-8 flex justify-between items-center">
          <button onClick={() => router.back()} className="flex items-center gap-2 text-slate-400 hover:text-slate-900 transition-all font-bold group">
            <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> {intl.formatMessage({ id: "Orqaga" })}
          </button>
          <div className="flex items-center gap-2">
            <ShieldCheck className="text-emerald-500" size={16} />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">{intl.formatMessage({ id: "Homework System" })}</span>
          </div>
        </nav>

        <main className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Chap tomon: Ma'lumotlar */}
          <div className="lg:col-span-7 space-y-8">
            <div className="space-y-4">
              <h1 className="text-6xl font-black text-slate-900 leading-tight">{homeworkInfo?.title}</h1>
              <p className="text-xl text-slate-500 leading-relaxed max-w-2xl">{homeworkInfo?.description}</p>
            </div>

            <div className="flex flex-wrap gap-4">
              <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm min-w-[180px]">
                <Award className="text-emerald-500 mb-2" size={20} />
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{intl.formatMessage({ id: "Jarayon" })}</p>
                <p className="text-2xl font-black text-slate-900">{totalFinishedItems} / {totalItemsCount}</p>
              </div>
              <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm min-w-[180px]">
                <BookOpen className="text-blue-500 mb-2" size={20} />
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{intl.formatMessage({ id: "Elementlar" })}</p>
                <p className="text-2xl font-black text-slate-900">{totalItemsCount} ta</p>
              </div>
            </div>

            {/* QAYTA ISHLASH HAQIDA BILDIRISHNOMA */}
            <div className="bg-blue-50/50 border border-blue-100 p-6 rounded-[2.5rem] flex items-start gap-4">
              <div className="bg-blue-500 text-white p-2 rounded-xl">
                <RotateCcw size={20} />
              </div>
              <div>
                <h4 className="font-bold text-blue-900">{intl.formatMessage({ id: "Cheksiz urinishlar" })}</h4>
                <p className="text-sm text-blue-700/80 mt-1">{intl.formatMessage({ id: "Ushbu vazifadagi mashqlarni o'zlashtirish darajangizni oshirish uchun istalgancha qayta ishlashingiz mumkin. Har bir urinish natijasi qayd etiladi." })}</p>
              </div>
            </div>
          </div>

          {/* O'ng tomon: Itemlar ro'yxati */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-[3.5rem] p-8 md:p-10 border border-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.04)]">
              <h3 className="text-2xl font-black mb-8 flex items-center justify-between">
                {intl.formatMessage({ id: "Topshiriqlar ro'yxati" })}
                <span className="bg-slate-50 text-slate-400 p-2 rounded-xl"><FileText size={20} /></span>
              </h3>

              <div className="space-y-3">
                {[...(homeworkInfo?.mock_tests || []), ...(homeworkInfo?.quizzes || [])].map((item) => (
                  <div
                    key={item.id}
                    onClick={() => handleStartItem(item, item.level ? "mock_test" : "quiz")}
                    className="group flex items-center justify-between p-5 rounded-[2rem] bg-slate-50/50 border border-transparent hover:border-primary/20 hover:bg-white hover:shadow-xl hover:shadow-slate-200/50 transition-all cursor-pointer"
                  >
                    <div className="flex items-center gap-5">
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-colors ${item.status === "Completed" ? 'bg-emerald-100 text-emerald-600 shadow-inner' : 'bg-white text-slate-300 shadow-sm'}`}>
                        {item.status === "Completed" ? <CheckCircle2 size={24} strokeWidth={2.5} /> : <BookOpen size={24} />}
                      </div>
                      <div>
                        <p className="font-bold text-slate-800 group-hover:text-primary transition-colors line-clamp-1">{item.title}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-md ${item.level ? 'bg-purple-50 text-purple-500' : 'bg-orange-50 text-orange-500'}`}>
                            {item.level ? 'Mock Test' : 'Quiz'}
                          </span>
                          {item.status === "Completed" && (
                            <span className="text-[9px] font-black uppercase text-emerald-500">{intl.formatMessage({ id: "Bajarilgan" })}</span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white text-slate-300 group-hover:bg-primary group-hover:text-white transition-all">
                      {loadingItemId === item.id ? <Loader2 className="animate-spin" size={14} /> : <ArrowRight size={14} />}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 pt-8 border-t border-slate-50 flex items-center gap-3 text-slate-400">
                <Info size={16} />
                <p className="text-xs font-medium">{intl.formatMessage({ id: "Bajarilgan topshiriqlarni ham qayta ishlash mumkin" })}</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </AuthGuard>
  );
};

export default HomeworkPlaygroundPage;