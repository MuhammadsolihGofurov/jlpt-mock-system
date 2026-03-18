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
  AlertCircle,
  ChevronLeft,
  ShieldCheck,
  ArrowRight,
  Loader2,
  CheckCircle2,
  FileText,
  HelpCircle,
  SendHorizontal
} from "lucide-react";
import { authAxios } from "@/utils/axios";
import { handleApiError } from "@/utils/handle-error";
import { toast } from "react-toastify";
import { HomeworkPlayground } from "@/components/custom/playground";

const HomeworkPlaygroundPage = () => {
  const router = useRouter();
  const intl = useIntl();
  const { id: homeworkId } = router.query;

  const [activeItemData, setActiveItemData] = useState(null);
  const [loadingItemId, setLoadingItemId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Progress va natijalar holati
  const [allAnswers, setAllAnswers] = useState({});
  const [completedItems, setCompletedItems] = useState([]);

  const { data: homeworkInfo, isLoading } = useSWR(
    homeworkId ? [`/homework-assignments/${homeworkId}/`, router.locale] : null,
    (url, locale) => fetcher(url, { headers: { "Accept-Language": locale } }, {}, true)
  );

  // Playground yakunlanganda javoblarni qabul qilish
  const handleFinishItem = async (itemAnswers, itemId) => {
    const toastId = toast.loading(intl.formatMessage({ id: "Natijalar saqlanmoqda..." }));

    try {
      // Har bir item uchun alohida submit
      const payload = {
        submission_id: activeItemData.submission_id, // Start berganda kelgan id
        answers: itemAnswers
      };

      await authAxios.post("/submissions/submit-homework/", payload);

      toast.update(toastId, {
        render: intl.formatMessage({ id: "Natija saqlandi!" }),
        type: "success",
        isLoading: false,
        autoClose: 2000,
      });

      // Local holatni yangilash (Progress ko'rinishi uchun)
      if (!completedItems.includes(itemId)) {
        setCompletedItems(prev => [...prev, itemId]);
      }

      // Playgroundni yopish
      setActiveItemData(null);

      // Ma'lumotlarni yangilash (SWR mutate)
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

  const handleStartItem = async (item, type) => {
    try {
      setLoadingItemId(item.id);
      const payload = {
        homework_assignment_id: homeworkId,
        item_type: type,
        item_id: item.id
      };
      const res = await authAxios.post("/submissions/homework-start/", payload);

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

  const handleSubmitFinal = async () => {
    try {
      setIsSubmitting(true);
      await authAxios.post(`/homework-assignments/${homeworkId}/complete/`);
      toast.success(intl.formatMessage({ id: "Vazifa to'liq yakunlandi!" }));
      router.push("/dashboard/assignments/homework");
    } catch (error) {
      toast.error(handleApiError(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  // Barcha vazifalar bajarilganini tekshirish
  const totalItemsCount = (homeworkInfo?.mock_tests?.length || 0) + (homeworkInfo?.quizzes?.length || 0);
  const isAllFinished = homeworkInfo && completedItems.length >= totalItemsCount;
  const totalFinishedItems =
    (homeworkInfo?.mock_tests?.filter(i => i.status === "Completed").length || 0) +
    (homeworkInfo?.quizzes?.filter(i => i.status === "Completed").length || 0);

  if (activeItemData) {
    return (
      <>
        <Seo title={homeworkInfo?.title || "Homework"} />

        <HomeworkPlayground
          data={activeItemData}
          onFinish={(answers) => handleFinishItem(answers, activeItemData.item_id)}
          onBack={() => setActiveItemData(null)}
        />
      </>
    );
  }

  return (
    <>
      <Seo title={homeworkInfo?.title || "Homework"} />
      <AuthGuard roles={["STUDENT"]}>
        <div className="min-h-screen bg-[#FDFDFF] text-slate-900 selection:bg-primary/10 pb-10">

          {/* Header Nav */}
          <nav className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-8 flex justify-between items-center">
            <button
              onClick={() => router.push("/dashboard/assignments/homework")}
              className="group flex items-center gap-2 text-slate-400 hover:text-slate-900 transition-all font-bold text-xs md:text-sm"
            >
              <div className="w-8 h-8 rounded-full border border-slate-100 flex items-center justify-center group-hover:bg-slate-50 transition-all">
                <ChevronLeft size={16} />
              </div>
              <span className="hidden xs:inline">{intl.formatMessage({ id: "Ortga qaytish" })}</span>
            </button>
            <div className="flex items-center gap-2">
              <ShieldCheck className="text-emerald-500" size={16} />
              <span className="text-[9px] md:text-[10px] font-black uppercase tracking-wider md:tracking-[0.2em] text-slate-400">
                {intl.formatMessage({ id: "Homework Environment" })}
              </span>
            </div>
          </nav>

          <main className="max-w-7xl mx-auto px-4 md:px-6 grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12">

            {/* Chap taraf: Ma'lumotlar */}
            <div className="lg:col-span-7 flex flex-col justify-center space-y-6 md:space-y-8">
              <div>
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 text-[9px] md:text-[10px] font-black uppercase tracking-widest mb-4 md:mb-6">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                  </span>
                  {intl.formatMessage({ id: "Homework Assignment" })}
                </span>
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-black tracking-tight leading-tight mb-4 md:mb-6">
                  {homeworkInfo?.title}
                </h1>
                <p className="text-base md:text-lg text-slate-500 font-medium leading-relaxed max-w-2xl">
                  {homeworkInfo?.description}
                </p>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
                <div className="bg-white p-4 md:p-6 rounded-2xl md:rounded-[2.5rem] border border-slate-100 shadow-sm">
                  <Award className="text-emerald-500 mb-2 md:mb-3" size={20} />
                  <p className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest">{intl.formatMessage({ id: "Jarayon" })}</p>
                  <p className="text-lg md:text-xl font-black">{totalFinishedItems} / {totalItemsCount}</p>
                </div>
                <div className="bg-white p-4 md:p-6 rounded-2xl md:rounded-[2.5rem] border border-slate-100 shadow-sm col-span-2 md:col-span-1">
                  <BookOpen className="text-blue-500 mb-2 md:mb-3" size={20} />
                  <p className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest">{intl.formatMessage({ id: "Topshiriqlar" })}</p>
                  <p className="text-lg md:text-xl font-black">{totalItemsCount} {intl.formatMessage({ id: "ta element" })}</p>
                </div>
              </div>

              {/* Warning Box */}
              <div className="p-5 md:p-8 bg-blue-50/50 rounded-2xl md:rounded-[3rem] border border-blue-100/50 flex gap-4 md:gap-6 items-start">
                <div className="w-10 h-10 md:w-12 md:h-12 shrink-0 rounded-xl md:rounded-2xl bg-white flex items-center justify-center text-blue-600 shadow-sm">
                  <AlertCircle size={20} />
                </div>
                <div>
                  <h4 className="font-black text-blue-900 text-sm md:text-base mb-1">{intl.formatMessage({ id: "Muhim eslatma" })}</h4>
                  <p className="text-xs md:text-sm text-blue-800/70 font-medium leading-relaxed">
                    {intl.formatMessage({ id: "Barcha topshiriqlarni yakunlaganingizdan so'ng, 'Topshiriqlar' sahifasida natijalarni ko'rishingiz mumkin." })}
                  </p>
                </div>
              </div>
            </div>

            {/* O'ng taraf: Struktura va Topshirish */}
            <div className="lg:col-span-5 relative">
              <div className="bg-white rounded-2xl md:rounded-[3rem] lg:rounded-[4rem] p-6 md:p-10 border border-slate-100 shadow-[0_20px_40px_-12px_rgba(0,0,0,0.05)] lg:sticky lg:top-10">
                <h3 className="text-xl md:text-2xl font-black mb-6 md:mb-8 flex items-center justify-between">
                  {intl.formatMessage({ id: "Vazifa tarkibi" })}
                  <BookOpen size={20} className="text-slate-300" />
                </h3>

                <div className="space-y-2 md:space-y-3 mb-8 md:mb-12 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                  {/* Mock Tests */}
                  {homeworkInfo?.mock_tests?.map((test) => (
                    <div
                      key={test.id}
                      onClick={() => handleStartItem(test, "mock_test")}
                      className="group flex items-center justify-between p-3 md:p-4 rounded-xl md:rounded-3xl bg-slate-50/50 border border-transparent hover:border-primary/20 hover:bg-white transition-all cursor-pointer"
                    >
                      <div className="flex items-center gap-3 md:gap-4">
                        <div className={`w-10 h-10 md:w-12 md:h-12 rounded-lg md:rounded-2xl flex items-center justify-center shadow-sm transition-all ${test?.status == "Completed" ? 'bg-emerald-50 text-emerald-500' : 'bg-white text-slate-400 group-hover:text-primary'}`}>
                          {test?.status == "Completed" ? <CheckCircle2 size={20} /> : <FileText size={20} />}
                        </div>
                        <div>
                          <p className="font-bold text-slate-800 text-sm md:text-base leading-tight line-clamp-1">
                            {test.title}
                          </p>
                          <p className="text-[9px] md:text-[10px] text-slate-400 font-black uppercase tracking-tighter">
                            {test.level} • Mock Test
                          </p>
                        </div>
                      </div>
                      {loadingItemId === test.id ? (
                        <Loader2 className="animate-spin text-primary" size={16} />
                      ) : (
                        <ArrowRight size={16} className="text-slate-300 group-hover:translate-x-1 transition-transform" />
                      )}
                    </div>
                  ))}

                  {/* Quizzes */}
                  {homeworkInfo?.quizzes?.map((quiz) => (
                    <div
                      key={quiz.id}
                      onClick={() => handleStartItem(quiz, "quiz")}
                      className="group flex items-center justify-between p-3 md:p-4 rounded-xl md:rounded-3xl bg-slate-50/50 border border-transparent hover:border-primary/20 hover:bg-white transition-all cursor-pointer"
                    >
                      <div className="flex items-center gap-3 md:gap-4">
                        <div className={`w-10 h-10 md:w-12 md:h-12 rounded-lg md:rounded-2xl flex items-center justify-center shadow-sm transition-all ${quiz?.status == "Completed" ? 'bg-emerald-50 text-emerald-500' : 'bg-white text-slate-400 group-hover:text-primary'}`}>
                          {quiz?.status == "Completed" ? <CheckCircle2 size={20} /> : <HelpCircle size={20} />}
                        </div>
                        <div>
                          <p className="font-bold text-slate-800 text-sm md:text-base leading-tight line-clamp-1">
                            {quiz.title}
                          </p>
                          <p className="text-[9px] md:text-[10px] text-slate-400 font-black uppercase tracking-tighter">
                            Quiz
                          </p>
                        </div>
                      </div>
                      {loadingItemId === quiz.id ? (
                        <Loader2 className="animate-spin text-primary" size={16} />
                      ) : (
                        <ArrowRight size={16} className="text-slate-300 group-hover:translate-x-1 transition-transform" />
                      )}
                    </div>
                  ))}
                </div>

                {/* FINAL SUBMIT BUTTON - Faqat hamma elementlar bajarilganda chiqadi */}
                {/* {isAllFinished && (
                  <button
                    onClick={handleSubmitHomework}
                    disabled={isSubmitting}
                    className="w-full relative group overflow-hidden py-4 md:py-6 bg-emerald-600 text-white rounded-xl md:rounded-[2.5rem] font-black text-lg md:text-xl transition-all hover:bg-emerald-500 active:scale-[0.98] disabled:bg-slate-200 disabled:text-slate-400 shadow-xl shadow-emerald-100"
                  >
                    <div className="relative z-10 flex items-center justify-center gap-3 md:gap-4">
                      {isSubmitting ? (
                        <Loader2 className="animate-spin" size={20} />
                      ) : (
                        <>
                          Vazifani topshirish
                          <SendHorizontal size={20} className="group-hover:translate-x-1 transition-transform" />
                        </>
                      )}
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-teal-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </button>
                )} */}

                {!isAllFinished && (
                  <div className="text-center">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.1em]">
                      {intl.formatMessage({ id: "Har bir topshiriq ichki sahifasiga kirish uchun bosing" })}
                    </p>
                  </div>
                )}
              </div>
            </div>

          </main>
        </div>
      </AuthGuard>
    </>
  );
};

export default HomeworkPlaygroundPage;