import i18nextConfig from "../../next.config";
import Head from "next/head";
import { useRouter } from "next/router";
import { BottomNav, Sidebar } from "../../components";

const AUTH_PATHS = ["/login", "/signup"];

const Layout = ({ children }) => {
   const router = useRouter();
   const isAuthPage = AUTH_PATHS.includes(router.pathname);

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
               href="/img/icons/favicon/apple-touch-icon.png"
            />
            <link
               rel="icon"
               type="image/png"
               sizes="32x32"
               href="/img/icons/favicon/favicon-32x32.png"
            />
            <link
               rel="icon"
               type="image/png"
               sizes="16x16"
               href="/img/icons/favicon/favicon-16x16.png"
            />
            <link rel="manifest" href="/img/icons/favicon/site.webmanifest" />
            <link
               rel="mask-icon"
               href="/img/icons/favicon/safari-pinned-tab.svg"
               color="#5bbad5"
            />
            <link rel="shortcut icon" href="/img/icons/favicon/favicon.ico" />
            <meta name="msapplication-TileColor" content="#ffc40d" />
            <meta
               name="msapplication-config"
               content="/img/icons/favicon/browserconfig.xml"
            />
            <meta name="theme-color" content="#ffffff"></meta>

            {/* href lang */}
            {i18nextConfig.i18n.locales.map((locale, i) => {
               return (
                  <link
                     key={i}
                     rel="alternate"
                     hrefLang={locale}
                     href="https://api.idea.inweb.uz"
                  />
               );
            })}
         </Head>

         {isAuthPage ? (
            <div className="flex min-h-screen items-center justify-center bg-cream">
               <div className="mx-auto w-full max-w-[480px] px-4">
                  {children}
               </div>
            </div>
         ) : (
            <>
               <Sidebar />
               <div className="md:ml-[240px]">
                  <div className="mx-auto min-h-screen max-w-[480px] md:max-w-[800px] px-4 pb-20 md:pb-6 md:pt-2">
                     {children}
                  </div>
               </div>
               <BottomNav />
            </>
         )}
      </>
   );
};

export default Layout;
