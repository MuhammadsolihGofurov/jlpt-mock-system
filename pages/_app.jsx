import { Provider } from "react-redux";
import "../public/styles/nprogress.css";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import store from "../redux/store/store";
import { Layout } from "../components";
import uz from "../lang/uz.json";
import ru from "../lang/ru.json";
import en from "../lang/en.json";
import { IntlProvider } from "react-intl";
import { LangProvider } from "../context/useLang";
import { useState } from "react";
import { useRouter } from "next/router";
import { useEffect } from "react";
import NProgress from "nprogress";
import { initCollapse } from "../utils/collapse";
import "react-toastify/dist/ReactToastify.css";
import "../styles/globals.css";
import { Flip, ToastContainer } from "react-toastify";
import { ModalProvider } from "@/context/modal-context";
import { OffcanvasProvider } from "@/context/offcanvas-context";
import { SWRConfig } from "swr";

const messages = {
  ru,
  uz,
  en,
};

export default function App({ Component, pageProps }) {
  const router = useRouter();
  const [locale, setLocale] = useState(router.locale);

  useEffect(() => {
    try {
      const handleStart = () => NProgress.start();
      const handleStop = () => NProgress.done();

      router.events.on("routeChangeStart", handleStart);
      router.events.on("routeChangeComplete", handleStop);
      router.events.on("routeChangeError", handleStop);

      initCollapse();

      return () => {
        router.events.off("routeChangeStart", handleStart);
        router.events.off("routeChangeComplete", handleStop);
        router.events.off("routeChangeError", handleStop);
      };
    } catch (error) {
      console.error("Error initializing collapse:", error);
    }
  }, [router]);

  return (
    <Provider store={store}>
      <IntlProvider
        locale={router.locale}
        defaultLocale={router.defaultLocale}
        messages={{ ...messages[router.locale] }}
        // remove
        onError={() => null}
      >
        <LangProvider>
          <OffcanvasProvider>
            <ModalProvider>
              <Layout>
                {/* <SWRConfig
                  value={{
                    revalidateOnFocus: false, // Oynaga qaytganda yangilamaslik
                    dedupingInterval: 10000, // Bir xil so'rovni 10 soniya ichida qayta yubormaslik
                    shouldRetryOnError: false, // xato bo'lsa qayta urinmaslik
                  }}
                > */}
                <Component {...pageProps} />
                {/* </SWRConfig> */}
              </Layout>
              <ToastContainer
                position="top-right"
                autoClose={3000}
                draggable
                theme="light"
                transition={Flip}
              />
            </ModalProvider>
          </OffcanvasProvider>
        </LangProvider>
      </IntlProvider>
    </Provider>
  );
}
