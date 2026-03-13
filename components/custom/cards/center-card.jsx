import Image from "next/image";
import {
  Users,
  Mail,
  ShieldCheck,
  Calendar,
  Edit2,
  Trash2,
  Ban,
} from "lucide-react";
import { ActionDropdown } from "@/components/ui";
import { useModal } from "@/context/modal-context";
import { authAxios } from "@/utils/axios";
import { mutate } from "swr";
import { DropdownItem } from "@/components/ui/action-dropdown";
import { useRouter } from "next/router";

const CenterCard = ({ center, onEdit, onDelete }) => {
  const { openModal } = useModal();
  const router = useRouter();
  const statusColors = {
    ACTIVE: "bg-emerald-50 text-emerald-600 border-emerald-100",
    TRIAL: "bg-blue-50 text-blue-600 border-blue-100",
    SUSPENDED: "bg-red-50 text-red-600 border-red-100",
  };

  const handleDelete = (id) => {
    openModal(
      "CONFIRM_MODAL",
      {
        title: "Markazni o'chirish",
        body: "Ushbu o'quv markazini o'chirib tashlamoqchimisiz? Bunda barcha bog'langan ma'lumotlar ham yo'qolishi mumkin.",
        confirmText: "Ha, o'chirilsin",
        variant: "danger",
        mutateKey: ["owner-centers/", router.locale],
        onConfirm: async () => {
          return await authAxios.delete(`/owner-centers/${id}/`);
        },
      },
      "small",
    );
  };

  const handleActivate = (id) => {
    openModal(
      "CONFIRM_MODAL",
      {
        title: "Markazni aktivlashtirish",
        body: "Ushbu o'quv markazini aktivlashtirmoqchimisiz? Bunda elektron pochta orqali tizimga kira olish imkoniyati mavjud bo'ladi.",
        confirmText: "Ha",
        variant: "info",
        mutateKey: ["owner-centers/", router.locale],
        onConfirm: async () => {
          return await authAxios.post(`/owner-centers/${id}/activate/`);
        },
      },
      "small",
    );
  };
  const handleBlock = (id) => {
    openModal(
      "CONFIRM_MODAL",
      {
        title: "Markazni bloklash",
        body: "Ushbu o'quv markazini bloklamoqchimisiz? Bunda elektron pochta orqali tizimga kira olmaydi.",
        confirmText: "Ha",
        variant: "danger",
        mutateKey: ["owner-centers/", router.locale],
        onConfirm: async () => {
          return await authAxios.post(`/owner-centers/${id}/suspend/`);
        },
      },
      "small",
    );
  };

  return (
    <div className="group relative bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
      <div className="flex justify-between items-start mb-6">
        {/* Logo va Nomi */}
        <div className="flex items-center gap-4">
          <div className="relative h-16 w-16 rounded-[1.5rem] overflow-hidden border-2 border-gray-50 shadow-inner">
            <Image
              src={center.center_avatar || "/default-center.png"}
              alt={center.center_name}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-500"
            />
          </div>
          <div>
            <h3 className="text-lg font-black text-heading leading-tight group-hover:text-primary transition-colors">
              {center.center_name}
            </h3>
            <span
              className={`inline-block mt-1 text-[10px] font-black px-2 py-0.5 rounded-lg border uppercase tracking-wider ${statusColors[center.status]}`}
            >
              {center.status}
            </span>
          </div>
        </div>

        <ActionDropdown>
          <DropdownItem
            icon={Edit2}
            label="Tahrirlash"
            variant="blue"
            onClick={() => openModal("centerForm", { center }, "middle")}
          />
          {center?.status !== "ACTIVE" ? (
            <DropdownItem
              icon={ShieldCheck}
              label="Aktivlashtirish"
              onClick={() => handleActivate(center?.id)}
            />
          ) : (
            <DropdownItem
              icon={Ban}
              label="Bloklash"
              variant="danger"
              onClick={() => handleBlock(center?.id)}
            />
          )}
          <div className="h-[1px] bg-gray-100 mx-2 my-1" />
          <DropdownItem
            icon={Trash2}
            label="O'chirish"
            variant="danger"
            onClick={() => handleDelete(center?.id)}
          />
        </ActionDropdown>
      </div>

      {/* Statistika qismi */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="bg-gray-50/50 p-3 rounded-2xl border border-gray-100/50">
          <p className="text-[10px] font-bold text-muted uppercase">
            O'qituvchilar
          </p>
          <div className="flex items-center gap-1.5 mt-0.5 text-heading font-black">
            <Users size={14} className="text-primary" />
            {center.teacher_count}
          </div>
        </div>
        <div className="bg-gray-50/50 p-3 rounded-2xl border border-gray-100/50">
          <p className="text-[10px] font-bold text-muted uppercase">Tarif</p>
          <div className="flex items-center gap-1.5 mt-0.5 text-heading font-black text-sm">
            <ShieldCheck size={14} className="text-blue-500" />
            {center.plan_name}
          </div>
        </div>
      </div>

      {/* Adminlar Ro'yxati */}
      <div className="space-y-2">
        <p className="text-[11px] font-bold text-muted uppercase px-1">
          Adminlar
        </p>
        <div className="flex -space-x-2 overflow-hidden mb-3">
          {center.centeradmin_emails.map((admin, i) => (
            <div
              key={i}
              title={admin.email}
              className="h-8 w-8 rounded-full ring-2 ring-white bg-orange-100 flex items-center justify-center text-[10px] font-bold text-primary border border-orange-200"
            >
              {admin.first_name[0]}
              {admin.last_name[0]}
            </div>
          ))}
          {center.centeradmin_emails.length > 3 && (
            <div className="h-8 w-8 rounded-full ring-2 ring-white bg-gray-100 flex items-center justify-center text-[10px] font-bold text-muted">
              +{center.centeradmin_emails.length - 3}
            </div>
          )}
        </div>
      </div>

      {/* Footer Info */}
      <div className="mt-4 pt-4 border-t border-dashed border-gray-100 flex items-center justify-between text-[11px] text-muted font-medium">
        <div className="flex items-center gap-1">
          <Calendar size={12} />
          {new Date(center.created_at).toLocaleDateString()}
        </div>
        <button className="text-primary font-bold hover:underline">
          Batafsil
        </button>
      </div>
    </div>
  );
};

export default CenterCard;
