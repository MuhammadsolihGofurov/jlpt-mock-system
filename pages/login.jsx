import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import Image from "next/image";
import Link from "next/link";
import { Button, Input } from "@/components/ui";
import { loginUser } from "@/redux/slice/auth";
import { useIntl } from "react-intl";
import { toast } from "react-toastify";
import Seo from "@/components/seo/seo";
import { LogIn, ShieldCheck, ArrowRight } from "lucide-react";
import { useEffect } from "react";
import { handleApiError } from "@/utils/handle-error";

function Login({ info }) {
  const dispatch = useDispatch();
  const intl = useIntl();
  const router = useRouter();
  const { loading } = useSelector((state) => state.auth);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: { email: "", password: "" },
  });

  useEffect(() => {
    if (router.query.email) {
      setValue("email", router.query.email);
    }
  }, [router.query.email]);

  const onSubmit = async (data) => {
    const toastId = toast.loading(
      intl.formatMessage({ id: "checking_credentials" }) || "Tekshirilmoqda...",
    );
    try {
      await dispatch(loginUser(data)).unwrap();
      toast.update(toastId, {
        render: "Xush kelibsiz!",
        type: "success",
        isLoading: false,
        autoClose: 2000,
      });
      router.push("/dashboard");
    } catch (err) {
      // console.error(err);
      // console.error(err?.error?.detail);
      toast.update(toastId, {
        render: err?.error?.detail?.[0] || "Email yoki parol xato!",
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

      <div className="absolute top-[-5%] left-[-5%] w-[30%] h-[30%] bg-orange-100/40 rounded-full blur-[80px]" />
      <div className="absolute bottom-[-5%] right-[-5%] w-[30%] h-[30%] bg-blue-100/30 rounded-full blur-[80px]" />

      <div className="w-full max-w-[420px] z-10 flex flex-col items-center px-4">
        <div className="flex flex-col items-center mb-6">
          <div className="bg-white p-3 rounded-[2rem] shadow-lg shadow-orange-100/50 mb-4 border border-orange-50">
            <Image
              src="/mikan-logo.svg"
              alt="Mikan Logo"
              width={45}
              height={45}
              priority
            />
          </div>
          <h1 className="text-3xl font-black text-heading tracking-tight">
            Mikan<span className="text-primary">.uz</span>
          </h1>
          <p className="text-muted text-xs font-medium text-center">
            {intl.formatMessage({ id: "auth_desc" }) || "Tizimga xush kelibsiz"}
          </p>
        </div>

        <div className="w-full bg-white/80 backdrop-blur-xl rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-white p-8">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-8 h-8 bg-orange-50 rounded-xl flex items-center justify-center text-primary">
              <LogIn size={18} strokeWidth={3} />
            </div>
            <h2 className="text-xl font-black text-heading">
              {intl.formatMessage({ id: "login" })}
            </h2>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label="email"
              name="email"
              type="email"
              register={register}
              error={errors.email}
              placeholder="teacher@mikan.uz"
              rules={{ required: "Email shart" }}
            />

            <div>
              <Input
                label="password"
                name="password"
                type="password"
                register={register}
                error={errors.password}
                placeholder="••••••••"
                rules={{ required: "Parol shart" }}
              />
              {/* <div className="flex justify-end mt-1.5">
                <Link
                  href="/forgot-password"
                  size="sm"
                  className="text-[10px] font-bold text-primary hover:underline"
                >
                  Parolni unutdingizmi?
                </Link>
              </div> */}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center py-3.5 rounded-xl bg-primary hover:bg-primary-dark text-white font-black shadow-lg shadow-orange-100 transition-all active:scale-[0.98] gap-2 group"
            >
              <span className="text-sm">Tizimga kirish</span>
              <ArrowRight
                size={18}
                className="group-hover:translate-x-1 transition-transform"
              />
            </button>
          </form>

          {/* Xavfsizlik belgisi - Kichikroq */}
          <div className="mt-6 pt-4 border-t border-gray-50 flex items-center justify-center gap-2 text-[10px] text-muted font-medium uppercase tracking-widest">
            <ShieldCheck size={14} className="text-green-500" />
            <span>{intl.formatMessage({ id: "Xavfsiz ulanish" })}</span>
          </div>
        </div>

        {/* Footer - Bir qatorga tushirildi */}
        <p className="mt-6 text-sm text-muted">
          {intl.formatMessage({ id: "Hisob yo'qmi?" })}{" "}
          <Link
            href="/register"
            className="text-primary font-black hover:underline"
          >
            {intl.formatMessage({ id: "register" })}
          </Link>
        </p>
      </div>
    </main>
  );
}

export async function getServerSideProps() {
  try {
    const pageData = {
      seo_title: "Kirish | Mikan",
      meta_description: "Mikan platformasiga kirish",
      meta_keywords: "mikan login",
    };
    return { props: { info: pageData } };
  } catch (error) {
    return { notFound: true };
  }
}

export default Login;
