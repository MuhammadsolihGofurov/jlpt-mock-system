import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import Image from "next/image";
import Link from "next/link";
import { Button, Input } from "@/components/ui";
import { registerUser } from "@/redux/slice/auth"; // Register action bor deb hisoblaymiz
import { useIntl } from "react-intl";
import { toast } from "react-toastify";
import Seo from "@/components/seo/seo";
import { UserPlus, ShieldCheck, ArrowRight, Ticket } from "lucide-react";

function Register({ info }) {
  const dispatch = useDispatch();
  const intl = useIntl();
  const router = useRouter();
  const { loading } = useSelector((state) => state.auth);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
      first_name: "",
      last_name: "",
      password: "",
      invitation_code: "",
    },
  });

  const onSubmit = async (data) => {
    const toastId = toast.loading("Hisob yaratilmoqda...");
    try {
      await dispatch(registerUser(data)).unwrap();

      toast.update(toastId, {
        render: "Ro'yxatdan o'tdingiz! Endi tizimga kiring.",
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });

      router.push({
        pathname: "/login",
        query: { email: data.email },
      });
    } catch (err) {
      toast.update(toastId, {
        render: err?.detail || "Xatolik! Ma'lumotlarni tekshiring.",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
    }
  };

  return (
    <main className="min-h-screen w-full flex items-center justify-center bg-[#FDFCFB] overflow-hidden relative">
      <Seo
        title={info?.seo_title}
        description={info?.meta_description}
        keywords={info?.meta_keywords}
      />

      {/* Orqa fon effektlari */}
      <div className="absolute top-[-5%] right-[-5%] w-[30%] h-[30%] bg-blue-100/40 rounded-full blur-[80px]" />
      <div className="absolute bottom-[-5%] left-[-5%] w-[30%] h-[30%] bg-orange-100/30 rounded-full blur-[80px]" />

      <div className="w-full max-w-[460px] z-10 flex flex-col items-center px-4 mt-[-20px]">
        {/* Logo qismi */}
        <div className="bg-white p-2.5 rounded-[1.5rem] shadow-md border border-orange-50 mb-4">
          <Image
            src="/mikan-logo.svg"
            alt="Mikan Logo"
            width={40}
            height={40}
            priority
          />
        </div>

        {/* Register Card */}
        <div className="w-full bg-white/80 backdrop-blur-xl rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-white p-8">
          <div className="flex items-center gap-2 mb-5">
            <div className="w-8 h-8 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
              <UserPlus size={18} strokeWidth={3} />
            </div>
            <h2 className="text-xl font-black text-heading">
              {intl.formatMessage({ id: "register" }) || "Ro'yxatdan o'tish"}
            </h2>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-3.5">
            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Ism"
                name="first_name"
                register={register}
                error={errors.first_name}
                placeholder="Jane"
                rules={{ required: "Ism shart" }}
              />
              <Input
                label="Familiya"
                name="last_name"
                register={register}
                error={errors.last_name}
                placeholder="Doe"
              />
            </div>

            <Input
              label="email"
              name="email"
              type="email"
              register={register}
              error={errors.email}
              placeholder="student@example.com"
              rules={{ required: "Email shart" }}
            />

            <Input
              label="Taklif kodi"
              name="invitation_code"
              register={register}
              error={errors.invitation_code}
              placeholder="INV-abc123"
              rules={{ required: "Taklif kodi shart" }}
            />

            <Input
              label="password"
              name="password"
              type="password"
              register={register}
              error={errors.password}
              placeholder="••••••••"
              rules={{
                required: "Parol shart",
                minLength: { value: 8, message: "Kamida 8 belgi" },
              }}
            />

            <button
              type="submit"
              isLoading={loading}
              className="w-full py-3.5 mt-2 rounded-xl bg-primary hover:bg-primary-dark text-white font-black shadow-lg shadow-orange-100 transition-all active:scale-[0.98] flex items-center justify-center gap-2 group"
            >
              <span className="text-sm">
                {intl.formatMessage({ id: "register" })}
              </span>
              <ArrowRight
                size={18}
                className="group-hover:translate-x-1 transition-transform"
              />
            </button>
          </form>

          <div className="mt-5 pt-4 border-t border-gray-50 flex items-center justify-center gap-2 text-[10px] text-muted font-medium uppercase tracking-widest">
            <ShieldCheck size={14} className="text-green-500" />
            <span>
              {intl.formatMessage({ id: "Ma'lumotlar himoyalangan" })}
            </span>
          </div>
        </div>

        <p className="mt-5 text-sm text-muted">
          {intl.formatMessage({ id: "Hisobingiz bormi?" })}{" "}
          <Link
            href="/login"
            className="text-primary font-black hover:underline"
          >
            {intl.formatMessage({ id: "login" })}
          </Link>
        </p>
      </div>
    </main>
  );
}

export async function getServerSideProps() {
  return {
    props: {
      info: {
        seo_title: "Ro'yxatdan o'tish | Mikan",
        meta_description: "Mikan platformasida yangi hisob yaratish",
        meta_keywords: "mikan register, ro'yxatdan o'tish",
      },
    },
  };
}

export default Register;
