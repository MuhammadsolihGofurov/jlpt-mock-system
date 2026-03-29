import React from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Trash2, X, Plus, Save, ArrowLeft, Image as ImageIcon, Layers, Lock } from "lucide-react";
import { useRouter } from "next/router";
import { toast } from "react-toastify";

import { Input } from "@/components/ui";
import { authAxios } from "@/utils/axios";
import { useIntl } from "react-intl";
import { handleApiError } from "@/utils/handle-error";

// --- SORTABLE CARD ROW ---
const SortableCardRow = ({ id, index, register, remove }) => {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 50 : 1,
    };

    return (
        <div ref={setNodeRef} style={style} className={`group bg-white rounded-[2rem] border-2 ${isDragging ? 'border-orange-500 shadow-xl scale-[1.01]' : 'border-slate-100 shadow-sm'} mb-5 transition-all duration-200 overflow-hidden`}>
            <div className="flex items-stretch min-h-[120px]">
                {/* 1. SEZILARLI DRAG ZONE */}
                <div
                    {...attributes} {...listeners}
                    className="w-12 flex flex-col items-center justify-center bg-slate-50/50 border-r border-slate-100 cursor-grab active:cursor-grabbing hover:bg-orange-50 hover:text-orange-500 text-slate-300 transition-all"
                >
                    <GripVertical size={20} />
                    <span className="text-[9px] font-black mt-1 opacity-50 uppercase">{index + 1}</span>
                </div>

                {/* 2. KENGAYTIRILGAN INPUTLAR */}
                <div className="flex-1 py-6 px-4 grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="relative">
                        <label className="text-[9px] font-black uppercase tracking-widest text-orange-500 mb-1 block ml-1">Termin</label>
                        <textarea
                            {...register(`cards.${index}.term`)}
                            rows={1}
                            placeholder="Masalan: Architecture"
                            className="w-full bg-transparent border-b border-slate-200 py-1 text-base font-bold outline-none focus:border-orange-500 transition-all resize-none overflow-hidden"
                            onInput={(e) => { e.target.style.height = 'auto'; e.target.style.height = e.target.scrollHeight + 'px'; }}
                        />
                    </div>
                    <div className="relative">
                        <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1 block ml-1">Ta'rif</label>
                        <textarea
                            {...register(`cards.${index}.definition`)}
                            rows={1}
                            placeholder="Izoh yozing..."
                            className="w-full bg-transparent border-b border-slate-200 py-1 text-base font-medium outline-none focus:border-blue-500 transition-all resize-none overflow-hidden text-slate-600"
                            onInput={(e) => { e.target.style.height = 'auto'; e.target.style.height = e.target.scrollHeight + 'px'; }}
                        />
                    </div>
                </div>

                {/* 3. LOCKED IMAGE & DELETE */}
                <div className="p-4 flex items-center gap-4 bg-slate-50/30 border-l border-slate-50">
                    {/* Premium Image Button */}
                    <div className="relative group/lock cursor-not-allowed">
                        <div className="w-20 h-20 rounded-2xl bg-slate-100 border border-slate-200 flex flex-col items-center justify-center text-slate-400 opacity-60">
                            <ImageIcon size={22} />
                            <span className="text-[7px] font-black mt-1 uppercase tracking-tighter">Rasm</span>
                        </div>
                        {/* Overlay "Pro" */}
                        <div className="absolute inset-0 bg-black/5 backdrop-blur-[1px] rounded-2xl flex flex-col items-center justify-center">
                            <Lock size={14} className="text-slate-600" />
                            <span className="text-[8px] font-bold text-slate-700 bg-white/80 px-2 py-0.5 rounded-full mt-1 border border-slate-200 shadow-sm">PRO</span>
                        </div>
                    </div>

                    <button type="button" onClick={() => remove(index)} className="p-1 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all">
                        <Trash2 size={18} />
                    </button>
                </div>
            </div>
        </div>
    );
};

// --- MAIN PAGE ---
const FlashcardPlayground = () => {
    const router = useRouter();
    const intl = useIntl();
    const { register, control, handleSubmit, formState: { isSubmitting } } = useForm({
        defaultValues: {
            title: "",
            description: "",
            cards: [{ term: "", definition: "", image_link: "", order: 1 }]
        }
    });

    const { fields, append, remove, move } = useFieldArray({ control, name: "cards" });
    const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 10 } }));

    const handleDragEnd = (event) => {
        const { active, over } = event;
        if (active.id !== over.id) {
            const oldIdx = fields.findIndex(f => f.id === active.id);
            const newIdx = fields.findIndex(f => f.id === over.id);
            move(oldIdx, newIdx);
        }
    };

    const onSubmit = async (data) => {
        const toastId = toast.loading(intl.formatMessage({ id: "Saqlanmoqda..." }));
        try {
            if (data?.title === "") {
                toast.update(toastId, { render: intl.formatMessage({ id: "To'plam nomi bo'sh bo'lishi mumkin emas!" }), type: "error", isLoading: false, autoClose: 3000 });
                return;
            }
            const setRes = await authAxios.post("flashcard-sets/", { title: data.title, description: data.description });
            const formattedCards = data.cards.map((card, idx) => ({ ...card, order: idx + 1, image_link: "" }));

            if (formattedCards.length > 0) {
                await authAxios.post("flashcards/bulk-create/", { flashcard_set: setRes.data.id, cards: formattedCards });
            }

            toast.update(toastId, { render: intl.formatMessage({ id: "To'plam yaratildi!" }), type: "success", isLoading: false, autoClose: 2000 });
            router.push("/dashboard/flashcards");
        } catch (err) {
            const msg = handleApiError(err);
            toast.update(toastId, { render: msg, type: "error", isLoading: false, autoClose: 3000 });
        }
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC] pb-24 font-sans text-slate-900">
            {/* CLEAN HEADER */}
            <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200/60 py-5">
                <div className="max-w-[1200px] mx-auto px-8 flex justify-between items-center">
                    <div className="flex items-center gap-5">
                        <button onClick={() => router.push("/dashboard/flashcards")} className="p-2.5 hover:bg-slate-100 rounded-xl transition-all text-slate-500">
                            <ArrowLeft size={22} />
                        </button>
                        <h1 className="text-xl font-black tracking-tight text-slate-800">{intl.formatMessage({ id: "Yangi to'plam" })}</h1>
                    </div>
                    <button
                        onClick={handleSubmit(onSubmit)}
                        disabled={isSubmitting}
                        className="bg-[#1e293b] hover:bg-black text-white px-8 py-3 rounded-2xl font-bold shadow-sm transition-all flex items-center gap-2 active:scale-95 text-sm"
                    >
                        <Save size={18} /> {isSubmitting ? "Saqlanmoqda..." : "Saqlash"}
                    </button>
                </div>
            </div>

            <div className="max-w-[1200px] mx-auto px-8 mt-10 space-y-10">
                {/* INFO SECTION */}
                <section className="bg-white rounded-[2rem] p-8 border border-slate-200/50 shadow-sm space-y-6">
                    <div className="flex items-center gap-3 text-orange-500">
                        <Layers size={24} />
                        <h2 className="text-lg font-black uppercase tracking-wider">{intl.formatMessage({ id: "Ma'lumotlar" })}</h2>
                    </div>
                    <div className="grid grid-cols-1 gap-5">
                        <Input label="To'plam nomi" placeholder="IELTS Reading - Unit 5" register={register} name="title" required />
                        <Input label="Tavsif (Ixtiyoriy)" placeholder="Bu to'plam nima haqida?" register={register} name="description" />
                    </div>
                </section>

                {/* CARDS SECTION */}
                <section className="space-y-4">
                    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                        <SortableContext items={fields.map(f => f.id)} strategy={verticalListSortingStrategy}>
                            {fields.map((field, index) => (
                                <SortableCardRow
                                    key={field.id} id={field.id} index={index}
                                    register={register} remove={remove}
                                />
                            ))}
                        </SortableContext>
                    </DndContext>

                    <button
                        type="button"
                        onClick={() => append({ term: "", definition: "", image_link: "", order: fields.length + 1 })}
                        className="w-full py-4 border-2 border-dashed border-slate-200 rounded-[2rem] text-slate-400 font-bold text-lg hover:border-orange-400 hover:text-orange-500 hover:bg-white transition-all flex items-center justify-center gap-3 group"
                    >
                        <div className="bg-slate-100 group-hover:bg-orange-500 group-hover:text-white p-2 rounded-xl transition-all">
                            <Plus size={24} />
                        </div>
                        {intl.formatMessage({ id: "Yangi karta qo'shish" })}
                    </button>
                </section>
            </div>
        </div>
    );
};

export default FlashcardPlayground;