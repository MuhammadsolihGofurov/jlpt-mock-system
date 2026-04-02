import React, { useState } from "react";
import { Users, Trash2, UserPlus, Save, X, ShieldCheck } from "lucide-react";
import useSWR, { mutate } from "swr";
import { useForm, Controller } from "react-hook-form";
import { toast } from "react-toastify";
import { useIntl } from "react-intl";
import { useRouter } from "next/router";

import fetcher from "@/utils/fetcher";
import { authAxios } from "@/utils/axios";
import { handleApiError } from "@/utils/handle-error";
import { Select } from "@/components/ui";
import { useModal } from "@/context/modal-context";

const GroupMembersModal = ({ group }) => {
  const intl = useIntl();
  const router = useRouter();
  const { openModal, closeModal } = useModal();
  const [isAdding, setIsAdding] = useState(false);

  // 1. Guruh a'zolarini olish
  const { data: members, isLoading } = useSWR(
    [`groups/${group.id}/members/`, router.locale],
    (url, locale) =>
      fetcher(url, { headers: { "Accept-Language": locale } }, {}, true),
  );

  // 2. Talabalar ro'yxatini olish (qo'shish uchun)
  const { data: allStudents } = useSWR(
    isAdding ? ["users/", router.locale, "STUDENT"] : null,
    (url, locale) =>
      fetcher(
        `${url}?page=all&role=STUDENT`,
        { headers: { "Accept-Language": locale } },
        {},
        true,
      ),
  );

  const studentOptions =
    allStudents?.map((s) => ({
      value: s.id,
      label: `${s.first_name} ${s.last_name}`,
    })) || [];

  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm({
    defaultValues: { user_ids: [] },
  });

  // A'zoni o'chirish
  const handleDeleteMember = async (memberId) => {
    openModal(
      "CONFIRM_MODAL",
      {
        title: "Foydalanuvchini chiqarish",
        body: "Ushbu foydalanuvchini guruhdan chiqarib tashlamoqchimisiz? Bunda barcha bog'langan ma'lumotlar ham yo'qolishi mumkin.",
        confirmText: "Ha",
        variant: "danger",
        mutateKey: [`groups/${group.id}/members/`, router.locale],
        onConfirm: async () => {
          return await authAxios.delete(`/group-memberships/${memberId}/`);
        },
      },
      "small",
    );
  };

  // Bulk Add (Ko'plab a'zo qo'shish)
  const onBulkAdd = async (data) => {
    try {
      const payload = {
        group_id: group.id,
        members: data.user_ids.map((id) => ({
          user_id: id,
          role_in_group: "STUDENT", // Default role
        })),
      };

      await authAxios.post("/group-memberships/bulk-add/", payload);
      toast.success(
        intl.formatMessage({ id: "A'zolar muvaffaqiyatli qo'shildi" }),
      );
      setIsAdding(false);
      reset();
      mutate([`groups/${group.id}/members/`, router.locale]);
    } catch (err) {
      handleApiError(err);
    }
  };

  return (
    <div className="p-6 sm:p-8 max-h-[90vh] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="bg-orange-100 p-3 rounded-2xl text-primary">
            <Users size={24} />
          </div>
          <div>
            <h2 className="text-xl font-black text-heading">{group.name}</h2>
            <p className="text-muted text-sm font-medium italic">
              {intl.formatMessage({ id: "Guruh a'zolarini boshqarish" })}
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsAdding(!isAdding)}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold transition-all ${isAdding
            ? "bg-slate-100 text-slate-600"
            : "bg-primary text-white shadow-lg shadow-orange-100"
            }`}
        >
          {isAdding ? <X size={18} /> : <UserPlus size={18} />}
          {intl.formatMessage({ id: isAdding ? "Yopish" : "A'zo qo'shish" })}
        </button>
      </div>

      {/* Bulk Add Form */}
      {isAdding && (
        <form
          onSubmit={handleSubmit(onBulkAdd)}
          className="mb-8 p-6 bg-orange-50/50 border border-orange-100 rounded-[2rem] animate-in slide-in-from-top-4 duration-300"
        >
          <div className="space-y-4">
            <Controller
              name="user_ids"
              control={control}
              render={({ field }) => (
                <Select
                  label="Talabalarni tanlang"
                  isMulti={true}
                  options={studentOptions}
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="Ism bo'yicha qidirish..."
                />
              )}
            />
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-2xl font-black shadow-md disabled:opacity-50"
              >
                <Save size={18} />
                Saqlash
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Members List */}
      <div className="flex-1 overflow-y-auto custom-scrollbar pr-2">
        {isLoading ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="h-16 bg-slate-50 animate-pulse rounded-2xl"
              />
            ))}
          </div>
        ) : members?.results?.length > 0 ? (
          <div className="space-y-3">
            {members?.results.map((member) => (
              <div
                key={member.id}
                className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-2xl hover:border-orange-200 hover:shadow-sm transition-all group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-500 uppercase">
                    {member.first_name?.[0]}
                    {member.last_name?.[0]}
                  </div>
                  <div>
                    <h4 className="font-bold text-heading leading-none">
                      {member.first_name} {member.last_name}
                    </h4>
                    <span className="text-[10px] font-black text-primary/60 uppercase tracking-widest mt-1 inline-block">
                      {member.role || "STUDENT"}
                    </span>
                  </div>
                </div>

                {member?.role !== "CENTER_ADMIN" && (
                  <button
                    onClick={() => handleDeleteMember(member.id)}
                    className="p-2.5 text-slate-300 hover:text-danger hover:bg-red-50 rounded-xl transition-all"
                  >
                    <Trash2 size={18} />
                  </button>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-10 bg-slate-50/50 rounded-[2rem] border border-dashed border-slate-200">
            <Users size={40} className="mx-auto text-slate-300 mb-2" />
            <p className="text-slate-500 font-medium">
              Guruhda hozircha a'zolar yo'q
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default GroupMembersModal;
