import React from "react";
import { Brain, Loader2 } from "lucide-react";
import { useModal } from "@/context/modal-context";
import { useForm, Controller } from "react-hook-form";
import { Select } from "@/components/ui";
import { useRouter } from "next/router";

const FlashcardPracticeModal = ({ id }) => {
    const { closeModal } = useModal();
    const router = useRouter();
    const { control, handleSubmit, watch } = useForm({
        defaultValues: {
            source: "ALL",
            prompt_mode: "SELECT",
        }
    });

    const selectedMode = watch("prompt_mode");

    const onSubmit = (data) => {
        router.push(`/dashboard/flashcards/practice/${id}?source=${data.source}${data.prompt_mode !== "SELECT" ? `&prompt_mode=${data.prompt_mode}` : ""}`);
        closeModal("PRACTICE_MODAL");
    };

    return (
        <div className="p-8 flex items-center flex-col">
            <div className="mx-auto w-20 h-20 rounded-[2rem] bg-orange-50 text-orange-500 flex items-center justify-center mb-6">
                <Brain size={40} />
            </div>
            <h2 className="text-2xl font-black text-slate-800 text-center mb-2 leading-tight">
                Mashqni sozlash
            </h2>
            <p className="text-slate-500 text-center font-medium mb-8 px-4 leading-relaxed">
                O'zingizga mos keladigan rejimni tanlang va bilimingizni sinab ko'ring.
            </p>

            <div className="space-y-4 mb-8 w-full">
                <Controller
                    name="source"
                    control={control}
                    render={({ field }) => (
                        <Select
                            label="Qaysi kartalar?"
                            options={[
                                { value: "ALL", label: "Barchasi" },
                                { value: "ERRORS", label: "Faqat xatolar" }
                            ]}
                            {...field}
                        />
                    )}
                />
                <Controller
                    name="prompt_mode"
                    control={control}
                    render={({ field }) => (
                        <Select
                            label="Savol turi"
                            options={[
                                { value: "SELECT", label: "Savol turini tanlang..." },
                                { value: "MIXED", label: "Aralash (Mixed)" },
                                { value: "TERM", label: "Termin ko'rsatiladi" },
                                { value: "DEFINITION", label: "Ta'rif ko'rsatiladi" },
                            ]}
                            {...field}
                        />
                    )}
                />
            </div>

            <button
                onClick={handleSubmit(onSubmit)}
                disabled={selectedMode === "SELECT"}
                className="w-2/4 py-4 bg-orange-500 text-white rounded-2xl font-black shadow-lg disabled:opacity-50 active:scale-95 transition-all"
            >
                Boshlash
            </button>
        </div>
    );
};

export default FlashcardPracticeModal;