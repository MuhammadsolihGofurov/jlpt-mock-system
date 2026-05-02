import Document, { Html, Head, Main, NextScript } from "next/document";
import nextConfig from "../next.config";

class MyDocument extends Document {
  render() {
    const currentLocale =
      this.props.__NEXT_DATA__.locale || nextConfig.i18n.defaultLocale;

    return (
      <Html lang={currentLocale} data-scroll-behavior="smooth">
        <Head>
          {/* Mobil — sahifani to'g'ri o'lchamda ko'rsatish */}
          <meta name="viewport" content="width=device-width, initial-scale=1, minimum-scale=1" />

          {/* PWA — Manifest */}
          <link rel="manifest" href="/manifest.json" />

          {/* PWA — Tema rangi (browser toolbar rangi) */}
          <meta name="theme-color" content="#ffffff" />

          {/* PWA — iOS Safari uchun (Apple o'z standartlaridan foydalanadi) */}
          <meta name="apple-mobile-web-app-capable" content="yes" />
          <meta name="apple-mobile-web-app-status-bar-style" content="default" />
          <meta name="apple-mobile-web-app-title" content="Mikan" />
          <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" />

          {/* PWA — Windows Tile (Microsoft Store / taskbar) */}
          <meta name="msapplication-TileColor" content="#ffffff" />
          <meta name="msapplication-TileImage" content="/icons/icon-144x144.png" />
        </Head>
        <body>
          <Main />
          <noscript
            dangerouslySetInnerHTML={{
              __html:
                '<iframe src="https://www.googletagmanager.com/ns.html?id=GTM-MLW6T4V" height="0" width="0" style="display:none;visibility:hidden"></iframe>',
            }}
          ></noscript>
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
