import React, { useState } from "react";
import { useRouter } from "next/router";
import useSWR from "swr";
import { useForm } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import {
  RotateCcw, ChevronRight, Brain, Loader2,
  ArrowLeft, Sparkles, Check, X
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
    (url, locale, s, m) => fetcher(`${url}?source=${s}&prompt_mode=${m}`, { headers: { "Accept-Language": locale } }, {}, true)
  );

  const [step, setStep] = useState("practicing");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState([]);
  const [isChecked, setIsChecked] = useState(false);
  const [isCorrect, setIsCorrect] = useState(null);
  const [summary, setSummary] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, watch, setValue, reset } = useForm({
    defaultValues: { current_answer: "" }
  });

  const currentAnswer = watch("current_answer");

  // Form yuborilganda (Enter bosilganda ham ishlaydi)
  const onFormSubmit = (formData) => {
    if (!isChecked) {
      if (formData.current_answer.trim()) checkAnswer();
    } else {
      handleNext();
    }
  };

  const checkAnswer = () => {
    const currentCard = data.items[currentIndex];
    const correct = currentAnswer.trim().toLowerCase() === currentCard.prompt_answer.trim().toLowerCase();
    setIsCorrect(correct);
    setIsChecked(true);
  };

  const handleNext = async () => {
    const currentCard = data.items[currentIndex];
    const newAnswer = {
      card_id: currentCard.card_id,
      prompt_type: currentCard.prompt_type,
      given_answer: currentAnswer
    };

    const updatedAnswers = [...userAnswers, newAnswer];
    setUserAnswers(updatedAnswers);

    if (currentIndex < data.items.length - 1) {
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
        source: data.source,
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

  if (isLoading || !router.isReady) {
    return (
      <div className="flex items-center justify-center min-h-[80vh]">
        <Loader2 className="animate-spin text-orange-500" size={48} />
      </div>
    );
  }

  if (error || !data?.items?.length) {
    return (
      <div className="flex items-center justify-center min-h-[80vh] px-6 text-center">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
          <div className="text-6xl mb-6">🏜️</div>
          <h2 className="text-2xl font-black text-slate-800 mb-2">{intl.formatMessage({ id: "Hech narsa topilmadi" })}</h2>
          <button onClick={() => router.back()} className="mt-6 px-8 py-3 bg-slate-900 text-white rounded-2xl font-bold">
            {intl.formatMessage({ id: "Orqaga" })}
          </button>
        </motion.div>
      </div>
    );
  }

  if (step === "practicing") {
    const currentCard = data.items[currentIndex];
    const progress = ((currentIndex + 1) / data.items.length) * 100;

    return (
      <div className="fixed inset-0 bg-slate-50 z-[100] flex flex-col md:relative md:inset-auto md:bg-transparent md:min-h-[85vh]">
        {/* Header - Fixed on mobile */}
        <div className="bg-white md:bg-transparent p-4 md:p-0 md:mb-8 flex items-center justify-between border-b md:border-0 shadow-sm md:shadow-none">
          <button onClick={() => router.back()} className="p-2 hover:bg-slate-100 rounded-xl transition-colors text-slate-400">
            <ArrowLeft size={24} />
          </button>

          <div className="flex flex-col items-center flex-1">
            <div className="w-32 md:w-64 h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-orange-500"
                animate={{ width: `${progress}%` }}
              />
            </div>
            <span className="text-[10px] font-black text-slate-400 uppercase mt-1 tabular-nums">
              {currentIndex + 1} / {data.items.length}
            </span>
          </div>
          <div className="w-10" />
        </div>

        {/* Main Content - Center alignment */}
        <div className="flex-1 flex items-center justify-center p-4 md:p-0">
          <AnimatePresence mode="wait">
            <motion.form
              key={currentIndex}
              onSubmit={handleSubmit(onFormSubmit)}
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -20, opacity: 0 }}
              className="w-full max-w-2xl bg-white rounded-[2.5rem] md:rounded-[3.5rem] p-6 md:p-12 shadow-2xl shadow-slate-200 border border-slate-100"
            >
              <div className="text-center space-y-6 md:space-y-8">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-orange-50 text-orange-600 rounded-full">
                  <Sparkles size={12} />
                  <span className="text-[10px] font-black uppercase tracking-wider">
                    {currentCard.prompt_type === 'TERM' ? intl.formatMessage({ id: "Ta'rifni kiriting" }) : intl.formatMessage({ id: "Terminni kiriting" })}
                  </span>
                </div>

                <h3 className="text-2xl md:text-4xl font-black text-slate-800 leading-tight min-h-[80px] flex items-center justify-center">
                  {currentCard.prompt}
                </h3>

                <div className="relative group">
                  <input
                    {...register("current_answer")}
                    disabled={isChecked}
                    autoComplete="off"
                    className={`w-full bg-slate-50 border-2 rounded-2xl md:rounded-[2rem] px-6 py-4 md:py-6 text-center text-xl md:text-2xl font-bold outline-none transition-all ${isChecked
                      ? (isCorrect ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-700')
                      : 'border-transparent focus:bg-white focus:border-orange-500'
                      }`}
                    placeholder={intl.formatMessage({ id: "Javobingizni kiriting" })}
                    autoFocus
                  />

                  {isChecked && (
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute -top-3 -right-3 md:-top-4 md:-right-4">
                      {isCorrect ? (
                        <div className="bg-green-500 text-white p-2 md:p-3 rounded-full shadow-lg"><Check size={20} strokeWidth={4} /></div>
                      ) : (
                        <div className="bg-red-500 text-white p-2 md:p-3 rounded-full shadow-lg"><X size={20} strokeWidth={4} /></div>
                      )}
                    </motion.div>
                  )}
                </div>

                <AnimatePresence>
                  {isChecked && !isCorrect && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="bg-red-50 rounded-2xl p-4 md:p-6 border border-red-100">
                      <p className="text-red-400 text-[10px] font-black uppercase tracking-widest mb-1">{intl.formatMessage({ id: "To'g'ri javob" })}</p>
                      <p className="text-red-700 font-bold text-lg md:text-xl">{currentCard.prompt_answer}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Action Button */}
              <div className="mt-8 md:mt-12">
                <button
                  type="submit"
                  disabled={!currentAnswer && !isChecked}
                  className={`w-full py-4 md:py-5 rounded-2xl md:rounded-3xl font-black text-lg md:text-xl flex items-center justify-center gap-3 transition-all active:scale-95 shadow-xl ${!isChecked
                    ? 'bg-slate-900 text-white hover:bg-black shadow-slate-200'
                    : (isCorrect ? 'bg-green-600 text-white shadow-green-100' : 'bg-slate-900 text-white')
                    }`}
                >
                  {isSubmitting ? <Loader2 className="animate-spin" /> : (
                    <>
                      {!isChecked ? intl.formatMessage({ id: "Javobni tekshirish" }) : (
                        currentIndex === data.items.length - 1 ? intl.formatMessage({ id: "Natijani ko'rish" }) : intl.formatMessage({ id: "Davom etish" })
                      )}
                      {isChecked && <ChevronRight size={20} strokeWidth={3} />}
                    </>
                  )}
                </button>
              </div>
            </motion.form>
          </AnimatePresence>
        </div>
      </div>
    );
  }

  // Finished Step (Natijalar)
  if (step === "finished" && summary) {
    const isSuccess = summary.correct >= summary.incorrect;
    return (
      <div className="fixed inset-0 bg-white z-[110] flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-full max-w-md text-center space-y-8"
        >
          <div className="text-8xl drop-shadow-xl">{isSuccess ? "🎉" : "💪"}</div>

          <div>
            <h2 className="text-4xl font-black text-slate-800">{intl.formatMessage({ id: isSuccess ? "Ajoyib!" : "Bo'sh kelma!" })}</h2>
            <p className="text-slate-400 mt-2 italic font-medium">"{intl.formatMessage({ id: isSuccess ? "Bugun sen g'olibsan!" : "Har bir xato - bu tajriba." })}"</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-6 bg-green-50 rounded-3xl border-b-4 border-green-500">
              <p className="text-[10px] font-black uppercase text-green-600 mb-1">{intl.formatMessage({ id: "To'g'ri" })}</p>
              <p className="text-3xl font-black text-slate-800">{summary.correct}</p>
            </div>
            <div className="p-6 bg-red-50 rounded-3xl border-b-4 border-red-500">
              <p className="text-[10px] font-black uppercase text-red-600 mb-1">{intl.formatMessage({ id: "Xato" })}</p>
              <p className="text-3xl font-black text-slate-800">{summary.incorrect}</p>
            </div>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => { setCurrentIndex(0); setUserAnswers([]); setIsChecked(false); setStep("practicing"); mutate(); reset(); }}
              className="w-full py-4 bg-orange-500 text-white rounded-2xl font-black text-lg flex items-center justify-center gap-2"
            >
              <RotateCcw size={20} /> {intl.formatMessage({ id: "Qayta urinish" })}
            </button>
            <button
              onClick={() => router.push('/dashboard/flashcards')}
              className="w-full py-4 bg-slate-100 text-slate-500 rounded-2xl font-bold"
            >
              {intl.formatMessage({ id: "Mashg'ulotni tugatish" })}
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return null;
};

export default FlashcardPractice;