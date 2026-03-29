import React, { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Trash2, X, Plus, Save, ArrowLeft, Image as ImageIcon, Layers } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { useRouter } from "next/router";
import { toast } from "react-toastify";

import { Input } from "@/components/ui";
import { authAxios } from "@/utils/axios";
import { searchImages } from "@/utils/googleSearch";

// --- SORTABLE CARD ROW ---
const SortableCardRow = ({ id, index, register, remove, setValue, watch }) => {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showSearch, setShowSearch] = useState(false);

    const term = watch(`cards.${index}.term`);
    const currentImage = watch(`cards.${index}.image_link`);

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 50 : 1,
    };

    const handleSearch = async () => {
        if (!term) return toast.warning("Avval terminni yozing!");
        setLoading(true);
        setShowSearch(true);
        const res = await searchImages(term);
        setImages(res);
        setLoading(false);
    };

    return (
        <div ref={setNodeRef} style={style} className={`group bg-white rounded-[2.5rem] border-2 ${isDragging ? 'border-orange-500 shadow-2xl scale-[1.01]' : 'border-slate-50 shadow-sm'} mb-6 transition-all duration-200 overflow-hidden`}>
            <div className="flex items-stretch min-h-[140px]">
                {/* 1. SEZILARLI DRAG ZONE */}
                <div
                    {...attributes} {...listeners}
                    className="w-16 flex flex-col items-center justify-center bg-slate-50 border-r border-slate-100 cursor-grab active:cursor-grabbing hover:bg-orange-50 hover:text-orange-500 text-slate-300 transition-all"
                >
                    <GripVertical size={24} />
                    <span className="text-[10px] font-black mt-2 opacity-50 uppercase tracking-tighter">{index + 1}</span>
                </div>

                {/* 2. KENGAYTIRILGAN INPUTLAR */}
                <div className="flex-1 p-8 grid grid-cols-1 lg:grid-cols-2 gap-12">
                    <div className="relative group/input">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-orange-500 mb-2 block ml-1">Termin</label>
                        <textarea
                            {...register(`cards.${index}.term`)}
                            rows={1}
                            placeholder="Atama..."
                            className="w-full bg-transparent border-b-2 border-slate-100 py-2 text-2xl font-bold outline-none focus:border-orange-500 transition-all resize-none overflow-hidden"
                            onInput={(e) => { e.target.style.height = 'auto'; e.target.style.height = e.target.scrollHeight + 'px'; }}
                        />
                    </div>
                    <div className="relative group/input">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2 block ml-1">Ta'rif</label>
                        <textarea
                            {...register(`cards.${index}.definition`)}
                            rows={1}
                            placeholder="Izoh yozing..."
                            className="w-full bg-transparent border-b-2 border-slate-100 py-2 text-xl font-medium outline-none focus:border-blue-500 transition-all resize-none overflow-hidden text-slate-600"
                            onInput={(e) => { e.target.style.height = 'auto'; e.target.style.height = e.target.scrollHeight + 'px'; }}
                        />
                    </div>
                </div>

                {/* 3. RASM VA O'CHIRISH */}
                <div className="p-6 flex items-center gap-6 border-l border-slate-50 bg-slate-50/30">
                    <div className="w-24 h-24 relative rounded-2xl bg-white border-2 border-dashed border-slate-200 flex items-center justify-center overflow-hidden group/img transition-all hover:border-orange-300">
                        {currentImage ? (
                            <>
                                <img src={currentImage} className="w-full h-full object-cover" />
                                <button
                                    onClick={() => setValue(`cards.${index}.image_link`, "")}
                                    className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 flex items-center justify-center text-white transition-opacity"
                                >
                                    <X size={20} />
                                </button>
                            </>
                        ) : (
                            <button type="button" onClick={handleSearch} className="flex flex-col items-center gap-1 text-slate-300 hover:text-orange-500 transition-colors">
                                <ImageIcon size={28} />
                                <span className="text-[8px] font-black uppercase tracking-tighter">Rasm</span>
                            </button>
                        )}
                    </div>

                    <button type="button" onClick={() => remove(index)} className="p-3 text-slate-200 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all">
                        <Trash2 size={24} />
                    </button>
                </div>
            </div>

            {/* GOOGLE SEARCH SLIDER */}
            {showSearch && (
                <div className="px-16 pb-8 animate-in fade-in slide-in-from-top-2 duration-300">
                    <div className="flex justify-between mb-4 items-center">
                        <p className="text-[10px] font-bold text-slate-400 uppercase italic tracking-widest">Qidiruv natijalari: {term}</p>
                        <button onClick={() => setShowSearch(false)} className="hover:rotate-90 transition-transform"><X size={16} /></button>
                    </div>
                    {loading ? (
                        <div className="flex gap-4">
                            {[1, 2, 3, 4, 5].map(i => <div key={i} className="h-28 w-40 bg-slate-50 animate-pulse rounded-2xl" />)}
                        </div>
                    ) : (
                        <Swiper slidesPerView={"auto"} spaceBetween={16}>
                            {images.map((url, i) => (
                                <SwiperSlide key={i} style={{ width: 'auto' }}>
                                    <img
                                        src={url}
                                        onClick={() => { setValue(`cards.${index}.image_link`, url); setShowSearch(false); }}
                                        className="h-28 w-40 object-cover rounded-2xl cursor-pointer hover:ring-4 ring-orange-500 hover:scale-105 transition-all shadow-md"
                                    />
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    )}
                </div>
            )}
        </div>
    );
};

// --- MAIN PAGE ---
const FlashcardPlayground = () => {
    const router = useRouter();
    const { register, control, handleSubmit, watch, setValue, formState: { isSubmitting } } = useForm({
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
        const toastId = toast.loading("Saqlanmoqda...");
        try {
            const setRes = await authAxios.post("flashcard-sets/", { title: data.title, description: data.description });
            const formattedCards = data.cards.map((card, idx) => ({ ...card, order: idx + 1 }));
            await authAxios.post("flashcards/bulk-create/", { flashcard_set: setRes.data.id, cards: formattedCards });
            toast.update(toastId, { render: "Muvaffaqiyatli saqlandi!", type: "success", isLoading: false, autoClose: 2000 });
            router.push("/dashboard/flashcards");
        } catch (err) {
            toast.update(toastId, { render: "Xatolik yuz berdi!", type: "error", isLoading: false, autoClose: 3000 });
        }
    };

    return (
        <div className="min-h-screen bg-[#fcfdfe] pb-24 font-sans">
            {/* STICKY HEADER */}
            <div className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-slate-100 py-6">
                <div className="max-w-[1300px] mx-auto px-10 flex justify-between items-center">
                    <div className="flex items-center gap-6">
                        <button onClick={() => router.push("/dashboard/flashcards")} className="p-3 bg-slate-50 hover:bg-black hover:text-white rounded-2xl transition-all">
                            <ArrowLeft size={24} />
                        </button>
                        <h1 className="text-2xl font-black tracking-tight">Flashcard yaratish</h1>
                    </div>
                    <button
                        onClick={handleSubmit(onSubmit)}
                        disabled={isSubmitting}
                        className="bg-orange-500 hover:bg-orange-600 text-white px-10 py-4 rounded-[1.5rem] font-black shadow-xl shadow-orange-100 transition-all flex items-center gap-3 active:scale-95"
                    >
                        <Save size={20} /> {isSubmitting ? "Saqlanmoqda..." : "Saqlash"}
                    </button>
                </div>
            </div>

            <div className="max-w-[1300px] mx-auto px-10 mt-12 space-y-12">
                {/* SET INFO SECTION (O'zgarmagan) */}
                <section className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-sm space-y-8">
                    <div className="flex items-center gap-4 text-orange-500">
                        <Layers size={32} />
                        <h2 className="text-2xl font-black">To'plam ma'lumotlari</h2>
                    </div>
                    <div className="grid grid-cols-1 gap-6">
                        <Input label="To'plam nomi" placeholder="Masalan: IELTS Vocabulary - Unit 1" register={register} name="title" required />
                        <Input label="Tavsif (Optional)" placeholder="Ushbu to'plam nima haqida?" register={register} name="description" />
                    </div>
                </section>

                {/* CARDS SECTION */}
                <section className="space-y-6">
                    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                        <SortableContext items={fields.map(f => f.id)} strategy={verticalListSortingStrategy}>
                            {fields.map((field, index) => (
                                <SortableCardRow
                                    key={field.id} id={field.id} index={index}
                                    register={register} remove={remove} setValue={setValue} watch={watch}
                                />
                            ))}
                        </SortableContext>
                    </DndContext>

                    <button
                        type="button"
                        onClick={() => append({ term: "", definition: "", image_link: "", order: fields.length + 1 })}
                        className="w-full py-16 border-4 border-dashed border-slate-100 rounded-[3rem] text-slate-300 font-black text-2xl hover:border-orange-500 hover:text-orange-500 hover:bg-orange-50/50 transition-all flex items-center justify-center gap-4 group"
                    >
                        <div className="bg-slate-50 group-hover:bg-orange-500 group-hover:text-white p-3 rounded-2xl transition-all">
                            <Plus size={32} />
                        </div>
                        Karta qo'shish
                    </button>
                </section>
            </div>
        </div>
    );
};

export default FlashcardPlayground;