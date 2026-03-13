import { useEffect } from "react";
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

function Login({ info }) {
  const dispatch = useDispatch();
  const intl = useIntl();
  const router = useRouter();
  const { loading, error } = useSelector((state) => state.auth);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      await dispatch(loginUser(data)).unwrap();
      toast.success("Xush kelibsiz!");
      router.push("/dashboard");
    } catch (err) {
      toast.error(err?.detail || "Xatolik!");
    }
  };
  return (
    <>
      <Seo
        title={info?.seo_title}
        description={info?.meta_description}
        keywords={info?.meta_keywords}
      />
      <main className="min-h-screen flex flex-col items-center justify-center px-4 bg-cream">
        <div className="mb-6 flex flex-col items-center">
          <Image
            src="/mikan-logo.svg"
            alt="Mikan Logo"
            width={80}
            height={80}
            loading="eager"
          />
          <h1 className="text-2xl font-bold mt-3">Mikan.uz</h1>
          <p className="text-gray-500">
            {intl.formatMessage({ id: "auth_desc" })}
          </p>
        </div>

        <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-orange-100 p-8">
          <h2 className="text-xl font-bold mb-6">
            {intl.formatMessage({ id: "login" })}
          </h2>

          {error && (
            <p className="text-red-500 mb-4 text-sm">
              {error.detail || "Xatolik yuz berdi"}
            </p>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label={intl.formatMessage({ id: "email" })}
              name="email"
              type="email"
              register={register}
              error={errors.email}
              placeholder="teacher@edu1.com"
              required
            />

            <Input
              label={intl.formatMessage({ id: "password" })}
              name="password"
              type="password"
              register={register}
              error={errors.password}
              placeholder="••••••••"
              required
            />

            <Button type="submit" isLoading={loading}>
              {intl.formatMessage({ id: "submit" })}
            </Button>
          </form>
        </div>
      </main>
    </>
  );
}

export async function getServerSideProps() {
  try {
    const pageData = {
      seo_title: "Kirish",
      meta_description: "Kirish description",
      meta_keywords: "mikan login",
    };

    if (!pageData) {
      return { notFound: true };
    }

    return {
      props: {
        info: pageData,
      },
    };
  } catch (error) {
    console.error("Fetch Error:", error);
    return { notFound: true };
  }
}

export default Login;
