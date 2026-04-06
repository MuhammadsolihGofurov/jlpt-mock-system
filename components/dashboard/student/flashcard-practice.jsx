import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import useSWR from "swr";
import { useForm } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import {
  RotateCcw, ChevronRight, Brain, Loader2,
  ArrowLeft, Sparkles, Check, X, Languages
} from "lucide-react";
import { authAxios } from "@/utils/axios";
import { handleApiError } from "@/utils/handle-error";
import fetcher from "@/utils/fetcher";
import { useIntl } from "react-intl";

const FlashcardPractice = () => {
  const router = useRouter();
  const { id: setId, source, prompt_mode } = router.query;
  const intl = useIntl();

  const { data, error, isLoading, mutate } = useSWR(
    router.isReady && setId ? [`flashcard-sets/${setId}/practice-items/`, router.locale, source, prompt_mode] : null,
    (url, locale, s, m) => fetcher(`${url}?source=${s}&prompt_mode=${m}`, { headers: { "Accept-Language": locale } }, {}, true),
    {
      revalidateOnFocus: false,      // Oyna fokusiga qaytganda qayta yuklamaslik
      revalidateOnReconnect: false,  // Internet ulanganda qayta yuklamaslik
      revalidateIfStale: false,      // Ma'lumot eskirgan bo'lsa ham qayta yuklamaslik
      dedupingInterval: 600000,      // 10 daqiqa davomida takroriy so'rovlarni oldini olish
    }
  );

  const [step, setStep] = useState("practicing");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState([]);
  const [isChecked, setIsChecked] = useState(false);
  const [isCorrect, setIsCorrect] = useState(null);
  const [summary, setSummary] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, watch, setValue, reset, setFocus } = useForm({
    defaultValues: { current_answer: "" }
  });

  const currentAnswer = watch("current_answer");

  // Har safar keyingi kartaga o'tganda inputga fokus berish
  useEffect(() => {
    if (step === "practicing" && data?.items) {
      setFocus("current_answer");
    }
  }, [currentIndex, step, setFocus, data]);

  const onFormSubmit = (formData) => {
    if (!isChecked) {
      if (formData.current_answer.trim()) checkAnswer();
    } else {
      handleNext();
    }
  };

  const checkAnswer = () => {
    const currentCard = data?.items[currentIndex];
    if (!currentCard) return;

    const normalizedUser = currentAnswer.trim().toLowerCase();
    const normalizedCorrect = currentCard.prompt_answer.trim().toLowerCase();

    setIsCorrect(normalizedUser === normalizedCorrect);
    setIsChecked(true);
  };

  const handleNext = async () => {
    const currentCard = data?.items[currentIndex];
    const newAnswer = {
      card_id: currentCard.card_id,
      prompt_type: currentCard.prompt_type,
      given_answer: currentAnswer
    };

    const updatedAnswers = [...userAnswers, newAnswer];
    setUserAnswers(updatedAnswers);

    if (currentIndex < data?.items.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setIsChecked(false);
      setIsCorrect(null);
      setValue("current_answer", "");
    } else {
      await submitResults(updatedAnswers);
    }
  };

  const submitResults = async (finalAnswers) => {
    setIsSubmitting(true);
    try {
      const res = await authAxios.post(`/flashcard-sets/${setId}/practice/`, {
        source: data?.source,
        prompt_mode: prompt_mode,
        answers: finalAnswers
      });
      setSummary(res.data?.summary);
      setStep("finished");
    } catch (err) {
      handleApiError(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getModeLabel = () => {
    switch (prompt_mode) {
      case 'DEFINITION': return intl.formatMessage({ id: "Terminni kiriting" });
      case 'FURIGANA': return intl.formatMessage({ id: "O'qilishini kiriting (Furigana)" });
      case 'TERM': return intl.formatMessage({ id: "Ta'rifni kiriting" });
      default: return intl.formatMessage({ id: "Javobni kiriting" });
    }
  };

  if (isLoading || !router.isReady) return <div className="flex items-center justify-center min-h-[80vh]"><Loader2 className="animate-spin text-orange-500" size={48} /></div>;

  if (error || !data?.items?.length) return <div className="flex items-center justify-center min-h-[80vh]">{intl.formatMessage({ id: "Ma'lumot topilmadi" })}</div>;

  if (step === "practicing") {
    const currentCard = data?.items[currentIndex];
    const progress = ((currentIndex + 1) / data?.items.length) * 100;

    return (
      <div className="fixed inset-0 bg-slate-50 z-[100] flex flex-col">
        <div className="bg-white p-4 flex items-center justify-between border-b">
          <button onClick={() => router.back()} className="p-2 text-slate-400"><ArrowLeft size={24} /></button>
          <div className="flex flex-col items-center flex-1">
            <div className="w-48 h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <motion.div className="h-full bg-orange-500" animate={{ width: `${progress}%` }} />
            </div>
            <span className="text-[10px] font-black text-slate-400 mt-1 uppercase">{currentIndex + 1} / {data.items.length}</span>
          </div>
          <div className="w-10" />
        </div>

        <div className="flex-1 flex items-center justify-center p-4">
          <AnimatePresence mode="wait">
            <motion.form
              key={currentIndex}
              onSubmit={handleSubmit(onFormSubmit)}
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -20, opacity: 0 }}
              className="w-full max-w-2xl bg-white rounded-[3rem] p-8 md:p-12 shadow-2xl shadow-slate-200 border border-slate-100"
            >
              <div className="text-center space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-600 rounded-full">
                  <Languages size={12} />
                  <span className="text-[10px] font-black uppercase tracking-wider">{getModeLabel()}</span>
                </div>

                <div className="space-y-4 text-center">
                  {/* Asosiy Savol (Prompt) */}
                  <h3 className="text-3xl md:text-5xl font-black text-slate-800 leading-tight">
                    {currentCard?.prompt}
                  </h3>

                  {/* Yordamchi ma'lumotlar va Ko'rsatmalar */}
                  <div className="space-y-1">
                    {/* Furigana: Faqat DEFINITION mode'larida ko'rinadi */}
                    {(currentCard?.prompt_type === "DEFINITION_FURIGANA" || currentCard?.prompt_type === "DEFINITION") && currentCard?.furigana && (
                      <p className="text-xl font-bold text-orange-600">
                        {currentCard.furigana}
                      </p>
                    )}

                    {/* Foydalanuvchi uchun yo'riqnoma */}
                    <p className="text-sm font-black uppercase tracking-widest text-slate-400">
                      {currentCard?.prompt_type === "FURIGANA" ||
                        currentCard?.prompt_type === "FURIGANA_DEFINITION" ||
                        currentCard?.prompt_type === "DEFINITION"
                        ? intl.formatMessage({ id: "Terminni kiriting" })
                        : ""}
                    </p>

                    {/* Prompt Hint (agar bo'lsa) */}
                    {currentCard?.prompt_hint && (
                      <p className="text-slate-400 font-medium text-lg italic">
                        {currentCard.prompt_hint}
                      </p>
                    )}
                  </div>
                </div>

                <div className="relative">
                  <input
                    {...register("current_answer")}
                    disabled={isChecked}
                    autoComplete="off"
                    className={`w-full bg-slate-50 border-2 rounded-[2rem] px-6 py-6 text-center text-2xl font-bold outline-none transition-all ${isChecked
                      ? (isCorrect ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-700')
                      : 'border-transparent focus:bg-white focus:border-orange-500 shadow-inner'
                      }`}
                    placeholder="..."
                    autoFocus
                  />
                  {isChecked && (
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute -top-4 -right-4">
                      {isCorrect ? (
                        <div className="bg-green-500 text-white p-3 rounded-full shadow-lg"><Check size={24} strokeWidth={4} /></div>
                      ) : (
                        <div className="bg-red-500 text-white p-3 rounded-full shadow-lg"><X size={24} strokeWidth={4} /></div>
                      )}
                    </motion.div>
                  )}
                </div>

                {isChecked && !isCorrect && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-slate-900 rounded-[2rem] p-6 text-white text-left">
                    <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-2">{intl.formatMessage({ id: "To'g'ri javob" })}</p>
                    <p className="text-2xl font-bold">{currentCard?.prompt_answer}</p>
                  </motion.div>
                )}
              </div>

              <button
                type="submit"
                disabled={!currentAnswer && !isChecked}
                className={`w-full mt-10 py-5 rounded-[2rem] font-black text-xl flex items-center justify-center gap-3 transition-all active:scale-95 ${!isChecked ? 'bg-slate-900 text-white hover:bg-black' : (isCorrect ? 'bg-green-600 text-white' : 'bg-slate-900 text-white')
                  }`}
              >
                {isSubmitting ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <>
                    {!isChecked
                      ? intl.formatMessage({ id: "Tekshirish" })
                      : (currentIndex === data.items.length - 1
                        ? intl.formatMessage({ id: "Natijani ko'rish" })
                        : intl.formatMessage({ id: "Davom etish" }))
                    }
                    <ChevronRight size={24} />
                  </>
                )}
              </button>
            </motion.form>
          </AnimatePresence>
        </div>
      </div>
    );
  }

  if (step === "finished" && summary) {
    return (
      <div className="fixed inset-0 bg-white z-[110] flex items-center justify-center p-4 text-center">
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="max-w-md w-full space-y-8">
          <div className="text-8xl">🎉</div>
          <div>
            <h2 className="text-4xl font-black text-slate-800">{intl.formatMessage({ id: "Tamom!" })}</h2>
            <p className="text-slate-500 mt-2">{intl.formatMessage({ id: "Barcha kartalarni ko'rib chiqdingiz." })}</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-green-50 rounded-2xl">
              <p className="text-xs font-bold text-green-600 uppercase">{intl.formatMessage({ id: "To'g'ri" })}</p>
              <p className="text-2xl font-black">{summary.correct}</p>
            </div>
            <div className="p-4 bg-red-50 rounded-2xl">
              <p className="text-xs font-bold text-red-600 uppercase">{intl.formatMessage({ id: "Xato" })}</p>
              <p className="text-2xl font-black">{summary.incorrect}</p>
            </div>
          </div>
          <button
            onClick={() => router.push('/dashboard/flashcards')}
            className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-lg shadow-xl"
          >
            {intl.formatMessage({ id: "Mashg'ulotni tugatish" })}
          </button>
        </motion.div>
      </div>
    );
  }

  return null;
};

export default FlashcardPractice;