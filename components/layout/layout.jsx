import Head from "next/head";
import { useRouter } from "next/router";
import { BottomNav, Sidebar } from "..";
import { Menu } from "lucide-react";
import { toggleSidebar } from "@/redux/slice/ui";
import { useDispatch, useSelector } from "react-redux";
import MobileHeader from "./mobile-header";
import useSWR, { mutate } from "swr";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import fetcher from "@/utils/fetcher";

const WITHOUT_SIDEBAR = [
  "/login",
  "/register",
  "/dashboard/mock-tests",
  "/playground",
  "/privacy",
  "/terms",
  "/dashboard/flashcards/create",
  "/dashboard/flashcards/edit",
  "/dashboard/flashcards/practice",
  "/dashboard/flashcards/study",
  "blocked"
];

const Layout = ({ children }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  const hasSidebar = WITHOUT_SIDEBAR.some((path) => router.pathname.includes(path));

  useEffect(() => {
    if (!user?.id) return;

    const token = localStorage.getItem("access");
    const ws = new WebSocket(`${process.env.NEXT_PUBLIC_WEB_SOKET_API_URL}ws/notifications/?token=${token}`);

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);

      toast.success(data.message, {
        duration: 5000,
      });
    };

    return () => ws.close();
  }, [user?.id]);

  return (
    <>
      <Head>
        {/* meta tags */}
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="author" content="Idea.uz" />
        <meta name="robots" content="index, follow, noodp" />
        <meta name="googlebot" content="index, follow" />
        <meta name="google" content="notranslate" />
        <meta name="format-detection" content="telephone=no" />

        {/* favicon */}
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/mikan-logo.svg"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/mikan-logo.svg"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/mikan-logo.svg"
        />
        {/* <link rel="manifest" href="/img/icons/favicon/site.webmanifest" /> */}
        <link
          rel="mask-icon"
          href="/img/icons/favicon/safari-pinned-tab.svg"
          color="#5bbad5"
        />
        <link rel="shortcut icon" href="/mikan-logo.svg" />
        <meta name="msapplication-TileColor" content="#ffc40d" />
        <meta
          name="msapplication-config"
          content="/img/icons/favicon/browserconfig.xml"
        />
        <meta name="theme-color" content="#ffffff"></meta>
      </Head>

      {hasSidebar || router.pathname === "/" ? (
        <>{children}</>
      ) : (
        <>
          <Sidebar />
          <MobileHeader />
          <section className="xl:ml-[260px] bg-cream">
            <div className="mx-auto min-h-screen px-5 pb-[130px] xl:pb-6 pt-3 xl:pt-10 flex flex-col gap-7 sm:gap-10">
              {children}
            </div>
          </section>
          <BottomNav />
        </>
      )}
    </>
  );
};

export default Layout;
