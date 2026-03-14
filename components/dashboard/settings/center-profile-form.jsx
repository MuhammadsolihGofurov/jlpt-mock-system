import React, { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import {
  Building2,
  Camera,
  Save,
  Loader2,
  Globe,
  MapPin,
  Phone,
} from "lucide-react";
import { Input } from "@/components/ui";
import { toast } from "react-toastify";
import { authAxios } from "@/utils/axios";
import { handleApiError } from "@/utils/handle-error";
import { useIntl } from "react-intl";
import useSWR from "swr";
import fetcher from "@/utils/fetcher";

const CenterProfileForm = ({ centerId }) => {
  const intl = useIntl();
  const fileInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);

  const {
    data: center,
    mutate,
    isLoading,
  } = useSWR(centerId ? `/center-admin-centers/${centerId}/` : null, (url) =>
    fetcher(url, {}, {}, true),
  );

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty },
  } = useForm({
    values: {
      name: center?.name || "",
      description: center?.description || "",
      email: center?.email || "",
      phone: center?.phone || "",
      website: center?.website || "",
      address: center?.address || "",
    },
  });

  const onSubmit = async (data) => {
    try {
      await authAxios.patch(`center-admin-centers/${centerId}/`, data);
      toast.success(intl.formatMessage({ id: "center_updated_success" }));
      mutate();
    } catch (err) {
      handleApiError(err);
    }
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("avatar", file);

    setUploading(true);
    const toastId = toast.loading(intl.formatMessage({ id: "uploading_logo" }));

    try {
      await authAxios.patch(`centers/avatar/`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.update(toastId, {
        render: intl.formatMessage({ id: "logo_updated_success" }),
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });
      mutate();
    } catch (err) {
      toast.dismiss(toastId);
      handleApiError(err);
    } finally {
      setUploading(false);
    }
  };

  if (isLoading)
    return (
      <div className="p-10 animate-pulse bg-white/50 rounded-[3rem] h-96" />
    );

  return (
    <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-5">
      <div className="md:col-span-3">
        <h2 className="text-lg sm:text-xl font-bold text-heading flex items-center gap-3 px-4">
          <Building2 className="text-primary" />
          {intl.formatMessage({ id: "o'quv_markazi_ma'lumotlari" })}
        </h2>
      </div>

      {/* Logo Section */}
      <div className="bg-white/80 backdrop-blur-xl border border-gray-100 p-8 rounded-[3rem] shadow-sm flex flex-col items-center justify-center">
        <div className="relative group">
          <div className="w-32 h-32 rounded-[2.5rem] overflow-hidden ring-4 ring-orange-50 bg-gray-100 flex items-center justify-center border-2 border-white shadow-xl">
            {center?.avatar ? (
              <img
                src={center.avatar}
                alt="Logo"
                className="w-full h-full object-cover"
              />
            ) : (
              <Building2 size={48} className="text-gray-300" />
            )}
            {uploading && (
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center backdrop-blur-sm">
                <Loader2 className="animate-spin text-white" size={32} />
              </div>
            )}
          </div>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="absolute -bottom-2 -right-2 bg-primary text-white p-3 rounded-2xl shadow-lg hover:scale-110 active:scale-95 transition-all"
          >
            <Camera size={20} />
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleAvatarUpload}
            className="hidden"
            accept="image/*"
          />
        </div>
        <div className="mt-4 text-center">
          <span className="px-3 py-1 bg-green-50 text-green-600 rounded-full text-[10px] font-black uppercase tracking-widest">
            {center?.status_display}
          </span>
        </div>
      </div>

      {/* Center Details Form */}
      <div className="md:col-span-2 bg-white/80 backdrop-blur-xl border border-gray-100 p-8 rounded-[3rem] shadow-sm">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Markaz nomi"
              name="name"
              register={register}
              error={errors.name}
            />
            <Input
              label="Telefon"
              name="phone"
              register={register}
              error={errors.phone}
              icon={<Phone size={16} />}
            />
            <Input
              label="Email"
              name="email"
              register={register}
              error={errors.email}
            />
            <Input
              label="Veb-sayt"
              name="website"
              register={register}
              error={errors.website}
              icon={<Globe size={16} />}
            />
          </div>
          <Input
            label="Manzil"
            name="address"
            register={register}
            error={errors.address}
            icon={<MapPin size={16} />}
          />
          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={isSubmitting || !isDirty}
              className="bg-primary hover:bg-primary-dark text-white font-black px-10 py-4 rounded-2xl shadow-xl shadow-orange-200 transition-all active:scale-95 flex items-center gap-2 disabled:opacity-50 disabled:grayscale"
            >
              {isSubmitting ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <Save size={20} />
              )}
              {intl.formatMessage({ id: "O'zgarishlarni saqlash" })}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CenterProfileForm;
