import React, { useEffect } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
    GripVertical, Trash2, Plus, Save, ArrowLeft,
    Image as ImageIcon, Layers, Lock, Globe, Users, ShieldCheck
} from "lucide-react";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import useSWR from "swr";

import { Input, Select } from "@/components/ui";
import { authAxios } from "@/utils/axios";
import { useIntl } from "react-intl";
import { handleApiError } from "@/utils/handle-error";
import fetcher from "@/utils/fetcher";
import { useSelector } from "react-redux";

// --- SORTABLE CARD ROW COMPONENT ---
const SortableCardRow = ({ id, index, register, remove, db_id }) => {
    const intl = useIntl();
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 50 : 1,
    };

    return (
        <div ref={setNodeRef} style={style} className={`group bg-white rounded-[2rem] border-2 ${isDragging ? 'border-orange-500 shadow-xl scale-[1.01]' : 'border-slate-100 shadow-sm'} mb-5 transition-all duration-200 overflow-hidden`}>
            <div className="flex items-stretch min-h-[120px]">
                <div
                    {...attributes} {...listeners}
                    className="w-12 flex flex-col items-center justify-center bg-slate-50/50 border-r border-slate-100 cursor-grab active:cursor-grabbing hover:bg-orange-50 hover:text-orange-500 text-slate-300 transition-all"
                >
                    <GripVertical size={20} />
                    <span className="text-[9px] font-black mt-1 opacity-50 uppercase">{index + 1}</span>
                </div>

                <div className="flex-1 py-6 px-4 grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="relative">
                        <label className="text-[9px] font-black uppercase tracking-widest text-orange-500 mb-1 block ml-1">{intl.formatMessage({ id: "Termin" })}</label>
                        <textarea
                            {...register(`cards.${index}.term`)}
                            rows={1}
                            placeholder="Masalan: 走る"
                            className="w-full bg-transparent border-b border-slate-200 py-1 text-base font-bold outline-none focus:border-orange-500 transition-all resize-none overflow-hidden"
                            onInput={(e) => { e.target.style.height = 'auto'; e.target.style.height = e.target.scrollHeight + 'px'; }}
                        />
                    </div>
                    <div className="relative">
                        <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1 block ml-1">{intl.formatMessage({ id: "Furigana" })}</label>
                        <textarea
                            {...register(`cards.${index}.furigana`)}
                            rows={1}
                            placeholder={intl.formatMessage({ id: "Masalan: はしる" })}
                            className="w-full bg-transparent border-b border-slate-200 py-1 text-base font-medium outline-none focus:border-blue-500 transition-all resize-none overflow-hidden text-slate-600"
                            onInput={(e) => { e.target.style.height = 'auto'; e.target.style.height = e.target.scrollHeight + 'px'; }}
                        />
                    </div>
                    <div className="relative lg:col-span-2">
                        <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1 block ml-1">{intl.formatMessage({ id: "Ta'rif" })}</label>
                        <textarea
                            {...register(`cards.${index}.definition`)}
                            rows={1}
                            placeholder={intl.formatMessage({ id: "Masalan: yugurmoq" })}
                            className="w-full bg-transparent border-b border-slate-200 py-1 text-base font-medium outline-none focus:border-blue-500 transition-all resize-none overflow-hidden text-slate-600"
                            onInput={(e) => { e.target.style.height = 'auto'; e.target.style.height = e.target.scrollHeight + 'px'; }}
                        />
                    </div>
                </div>

                <div className="p-4 flex items-center gap-4 bg-slate-50/30 border-l border-slate-50">
                    <div className="relative group/lock cursor-not-allowed">
                        <div className="w-20 h-20 rounded-2xl bg-slate-100 border border-slate-200 flex flex-col items-center justify-center text-slate-400 opacity-60">
                            <ImageIcon size={22} />
                            <span className="text-[7px] font-black mt-1 uppercase tracking-tighter text-center">Rasm (PRO)</span>
                        </div>
                    </div>

                    <button type="button" onClick={remove} className="p-1 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all">
                        <Trash2 size={18} />
                    </button>
                </div>
            </div>
        </div>
    );
};

// --- MAIN PLAYGROUND PAGE ---
const FlashcardPlayground = ({ flashcard_data, cards }) => {
    const router = useRouter();
    const intl = useIntl();
    const isEditMode = !!flashcard_data?.id;
    const { user } = useSelector(state => state.auth);
    const userRole = user?.role;

    const { data: groupsData } = useSWR(
        userRole !== 'OWNER' && userRole !== "STUDENT" ? ["groups/", router.locale] : null,
        (url, locale) => fetcher(`${url}?page=all`, { headers: { "Accept-Language": locale } }, {}, true)
    );

    const { data: centerData } = useSWR(
        userRole == 'OWNER' ? ["owner-centers/", router.locale] : null,
        (url, locale) => fetcher(`${url}?page=all`, { headers: { "Accept-Language": locale } }, {}, true)
    );

    const groupOptions = groupsData?.map((g) => ({ value: g.id, label: g.name })) || [];
    const centerOptions = centerData?.map((c) => ({ value: c.id, label: c.center_name })) || [];

    // 2. Visibility variantlari (Role-based)
    const visibilityOptionsBased = [
        { value: "PUBLIC", label: "Global (Hamma markazlar)", roles: ["OWNER"] },
        { value: "PRIVATE", label: "Faqat tanlanganlar uchun", roles: ["OWNER"] },
        { value: "PRIVATE", label: "Faqat o'zim uchun", roles: ["CENTER_ADMIN", "STUDENT"] },
        { value: "CENTER", label: "Butun markaz uchun", roles: ["CENTER_ADMIN", "TEACHER"] },
        { value: "GROUPS", label: "Tanlanganlar uchun", roles: ["CENTER_ADMIN", "TEACHER"] },
    ];

    const visibilityOptions = visibilityOptionsBased.filter(option => option.roles.includes(userRole));

    // 3. React Hook Form Setup
    const { register, control, handleSubmit, reset, watch, formState: { isSubmitting } } = useForm({
        defaultValues: {
            title: "",
            description: "",
            visibility: "",
            assigned_group_ids: [],
            visible_center_ids: [],
            cards: [{ term: "", definition: "", image_link: "", furigana: "", order: 1 }]
        }
    });

    const { fields, append, remove, move } = useFieldArray({ control, name: "cards" });
    const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 10 } }));
    const currentVisibility = watch("visibility");

    // 4. Ma'lumotlarni formaga yuklash (Edit Mode)
    useEffect(() => {
        if (flashcard_data) {
            reset({
                title: flashcard_data.title || "",
                description: flashcard_data.description || "",
                visibility: flashcard_data.visibility || "PRIVATE",
                assigned_group_ids: flashcard_data.assigned_groups?.map(g => g.id) || [],
                visible_center_ids: flashcard_data.visible_centers?.map(c => c.id) || [],
                cards: cards?.length > 0
                    ? cards.sort((a, b) => a.order - b.order).map(c => ({ ...c, db_id: c.id }))
                    : [{ term: "", definition: "", image_link: "", order: 1 }]
            });
        }
    }, [flashcard_data, cards, reset]);

    const handleDragEnd = (event) => {
        const { active, over } = event;
        if (active && over && active.id !== over.id) {
            const oldIdx = fields.findIndex(f => f.id === active.id);
            const newIdx = fields.findIndex(f => f.id === over.id);
            move(oldIdx, newIdx);
        }
    };

    // --- DELETE CARD LOGIC ---
    const handleDelete = async (index) => {
        const cardToDelete = fields[index];
        const realId = cardToDelete.db_id;

        if (isEditMode && realId) {
            if (!confirm("Ushbu kartani o'chirib tashlamoqchimisiz?")) return;
            try {
                const toastId = toast.loading("O'chirilmoqda...");
                await authAxios.delete(`flashcards/${realId}/`);
                toast.update(toastId, { render: "O'chirildi", type: "success", isLoading: false, autoClose: 1500 });
                remove(index);
            } catch (err) {
                handleApiError(err);
            }
        } else {
            remove(index);
        }
    };

    // --- MAIN SUBMIT LOGIC ---
    const onSubmit = async (formData) => {
        const toastId = toast.loading("Saqlanmoqda...");
        try {
            const setId = flashcard_data?.id;
            const setPayload = {
                title: formData.title,
                description: formData.description,
                visibility: formData.visibility,
            };

            if (formData.visibility === "GROUPS") {
                setPayload.assigned_group_ids = formData.assigned_group_ids;
            }
            if (formData.visibility === "PRIVATE" && userRole === "OWNER") {
                setPayload.visible_center_ids = formData.visible_center_ids;
            }

            // 1. Flashcard Set yaratish yoki yangilash
            let currentSetId = setId;
            if (isEditMode) {
                await authAxios.put(`flashcard-sets/${setId}/`, setPayload);
            } else {
                const res = await authAxios.post("flashcard-sets/", setPayload);
                currentSetId = res.data.id;
            }

            // 2. Kartalarni ajratish (Update vs Create)
            const formattedCards = formData.cards.map((c, i) => ({
                ...c,
                order: i + 1,
                flashcard_set: currentSetId
            }));

            const cardsToUpdate = formattedCards.filter(c => !!c.db_id);
            const cardsToCreate = formattedCards.filter(c => !c.db_id);

            const requests = [];
            if (cardsToUpdate.length > 0) {
                requests.push(authAxios.patch("flashcards/bulk-update/", { cards: cardsToUpdate }));
            }
            if (cardsToCreate.length > 0) {
                requests.push(authAxios.post("flashcards/bulk-create/", { cards: cardsToCreate, flashcard_set: currentSetId }));
            }

            if (requests.length > 0) await Promise.all(requests);

            toast.update(toastId, { render: "Muvaffaqiyatli saqlandi!", type: "success", isLoading: false, autoClose: 2000 });
            router.push("/dashboard/flashcards");
        } catch (err) {
            const msg = handleApiError(err);
            toast.update(toastId, { render: msg, type: "error", isLoading: false, autoClose: 3000 });
        }
    };

    return (
        <div className="min-h-screen pb-24 font-sans text-slate-900 bg-slate-50/30">
            {/* STICKY HEADER */}
            <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200/60 py-5">
                <div className="max-w-[1200px] mx-auto px-8 flex justify-between items-center">
                    <div className="flex items-center gap-5">
                        <button onClick={() => router.back()} className="p-2.5 hover:bg-slate-100 rounded-xl transition-all text-slate-500">
                            <ArrowLeft size={22} />
                        </button>
                        <h1 className="text-xl font-black tracking-tight text-slate-800">
                            {intl.formatMessage({ id: isEditMode ? "To'plamni tahrirlash" : "Yangi to'plam" })}
                        </h1>
                    </div>
                    <button
                        onClick={handleSubmit(onSubmit)}
                        disabled={isSubmitting}
                        className="bg-[#1e293b] hover:bg-black text-white px-8 py-3 rounded-2xl font-bold shadow-lg transition-all flex items-center gap-2 active:scale-95 disabled:opacity-50"
                    >
                        <Save size={18} /> {intl.formatMessage({ id: isSubmitting ? "Saqlanmoqda..." : "Saqlash" })}
                    </button>
                </div>
            </div>

            <div className="max-w-[1200px] mx-auto px-8 mt-10 space-y-10">
                {/* CONFIGURATION SECTION */}
                <section className="bg-white rounded-[2.5rem] p-10 border border-slate-200/50 shadow-sm space-y-8">
                    <div className="flex items-center gap-3 text-orange-500">
                        <ShieldCheck size={24} />
                        <h2 className="text-lg font-black uppercase tracking-wider">{intl.formatMessage({ id: "Asosiy Sozlamalar" })}</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className={`${userRole === "STUDENT" ? "md:col-span-2" : ""}`}>
                            <Input label="To'plam nomi" placeholder={intl.formatMessage({ id: "Masalan: JLPT N5 Vocab" })} register={register} name="title" required />
                        </div>

                        {
                            userRole !== "STUDENT" && <Controller
                                name="visibility"
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        label="Ko'rinish doirasi"
                                        options={visibilityOptions}
                                        value={field.value}
                                        onChange={field.onChange}
                                        icon={<Globe size={16} />}
                                    />
                                )}
                            />
                        }

                        {currentVisibility === "PRIVATE" && userRole === "OWNER" && (
                            <div className="md:col-span-2">
                                <Controller
                                    name="visible_center_ids"
                                    control={control}
                                    render={({ field }) => (
                                        <Select
                                            label="O'quv markaz biriktirish"
                                            isMulti={true}
                                            options={centerOptions}
                                            value={field.value}
                                            onChange={field.onChange}
                                            icon={<Users size={16} />}
                                        />
                                    )}
                                />
                            </div>
                        )}

                        {currentVisibility === "GROUPS" && (
                            <div className="md:col-span-2">
                                <Controller
                                    name="assigned_group_ids"
                                    control={control}
                                    render={({ field }) => (
                                        <Select
                                            label="Guruhlarni biriktirish"
                                            isMulti={true}
                                            options={groupOptions}
                                            value={field.value}
                                            onChange={field.onChange}
                                            icon={<Users size={16} />}
                                        />
                                    )}
                                />
                            </div>
                        )}

                        <div className="md:col-span-2">
                            <Input label="Tavsif (Ixtiyoriy)" placeholder={intl.formatMessage({ id: "Ushbu to'plam haqida qisqacha..." })} register={register} name="description" />
                        </div>
                    </div>
                </section>

                {/* FLASHCARDS LIST SECTION */}
                <section className="space-y-4">
                    <div className="flex items-center justify-between px-4 mb-4">
                        <div className="flex items-center gap-2 text-slate-400 font-bold uppercase text-xs tracking-widest">
                            <Layers size={14} />
                            <span>{intl.formatMessage({ id: "Flashcardlar" })} ({fields.length})</span>
                        </div>
                    </div>

                    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                        <SortableContext items={fields.map(f => f.id)} strategy={verticalListSortingStrategy}>
                            {fields.map((field, index) => (
                                <SortableCardRow
                                    key={field.id}
                                    id={field.id}
                                    db_id={field.db_id}
                                    index={index}
                                    register={register}
                                    remove={() => handleDelete(index)}
                                />
                            ))}
                        </SortableContext>
                    </DndContext>

                    <button
                        type="button"
                        onClick={() => append({ term: "", definition: "", image_link: "", furigana: "", order: fields.length + 1 })}
                        className="w-full py-6 border-2 border-dashed border-slate-200 rounded-[2.5rem] text-slate-400 font-bold text-lg hover:border-orange-400 hover:text-orange-500 hover:bg-white transition-all flex items-center justify-center gap-3 group"
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