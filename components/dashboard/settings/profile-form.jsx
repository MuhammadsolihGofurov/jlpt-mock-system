import React, { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { User, Mail, Camera, Save, Loader2, UserCheck } from "lucide-react";
import { Input } from "@/components/ui";
import { toast } from "react-toastify";
import { authAxios } from "@/utils/axios";
import { handleApiError } from "@/utils/handle-error";
import { useIntl } from "react-intl";
import { useDispatch, useSelector } from "react-redux";
import { getMe } from "@/redux/slice/auth";

const ProfileForm = () => {
  const intl = useIntl();
  const fileInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isDirty },
  } = useForm({
    values: {
      first_name: user?.first_name || "",
      last_name: user?.last_name || "",
      email: user?.email || "",
    },
  });

  // 1. Shaxsiy ma'lumotlarni PATCH qilish
  const onSubmit = async (data) => {
    try {
      await authAxios.patch("/auth/me/", {
        first_name: data.first_name,
        last_name: data.last_name,
      });
      toast.success(intl.formatMessage({ id: "profile_updated" }));
      dispatch(getMe());
    } catch (err) {
      handleApiError(err);
    }
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      toast.error("Rasm hajmi 10MB dan oshmasligi kerak");
      return;
    }

    const formData = new FormData();
    formData.append("avatar", file);

    setUploading(true);
    const toastId = toast.loading(
      intl.formatMessage({ id: "Rasm yuklanmoqda..." }),
    );

    try {
      await authAxios.post("/auth/avatar/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.update(toastId, {
        render: intl.formatMessage({ id: "Avatar muvaffaqiyatli yangilandi!" }),
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });
      dispatch(getMe());
    } catch (err) {
      toast.dismiss(toastId);
      handleApiError(err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col gap-5">
      <h2 className="text-lg sm:text-xl font-bold text-heading flex items-center gap-3 px-4">
        <UserCheck className="text-primary" />
        {intl.formatMessage({ id: "shaxsiy_ma'lumotlar" })}
      </h2>
      <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Avatar Section */}
        <div className="bg-white/80 backdrop-blur-xl border border-gray-100 p-4 sm:p-8 rounded-xl sm:rounded-[3rem] shadow-sm flex flex-col items-center">
          <div className="relative group">
            <div className="w-32 h-32 rounded-[2.5rem] overflow-hidden ring-4 ring-orange-50 bg-gray-100 flex items-center justify-center border-2 border-white shadow-xl">
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt="Avatar"
                  className="w-full h-full object-cover"
                />
              ) : (
                <User size={48} className="text-gray-300" />
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
              title="Rasmni o'zgartirish"
            >
              <Camera size={20} strokeWidth={2.5} />
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleAvatarUpload}
              className="hidden"
              accept="image/*"
            />
          </div>
          <h3 className="mt-4 text-xl font-black text-heading">
            {user?.first_name} {user?.last_name}
          </h3>
          <p className="text-muted text-sm font-medium">{user?.email}</p>
        </div>

        {/* Form Section */}
        <div className="bg-white/80 backdrop-blur-xl border border-gray-100 p-4 sm:p-8 rounded-xl sm:rounded-[3rem] shadow-sm">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Ism"
                name="first_name"
                register={register}
                error={errors.first_name}
                placeholder="Ali"
              />
              <Input
                label="Familiya"
                name="last_name"
                register={register}
                error={errors.last_name}
                placeholder="Valiyev"
              />
            </div>

            {/* <Input
            label="Email"
            name="email"
            type="email"
            disabled
            register={register}
            placeholder="admin@mikan.uz"
            className="bg-gray-100/50 cursor-not-allowed"
          /> */}

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
                {intl.formatMessage({ id: "save_changes" })}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfileForm;
