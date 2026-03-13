import Head from "next/head";

const Seo = ({
  children,
  title = "New title",
  description = "New Description",
  keywords = "New Keywords",
  link = "https://mikan.vercel.app/",
}) => {
  return (
    <Head>
      <meta name="keywords" content={keywords} />
      <meta name="description" content={description} />
      <title>{title}</title>

      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={link} />
      <meta property="og:site_name" content="teplolux" />

      <meta property="og:image" content="/images/favicon.png" />
      <meta property="og:image:secure_url" content="/images/favicon.png" />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content="teplolux platform preview" />

      <meta property="og:locale" content="uz_UZ" />
      <meta property="og:locale:alternate" content="ru_RU" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content="/images/favicon.png" />
      <meta name="twitter:site" content="@mikan.uz" />
      <meta name="twitter:creator" content="@mikan.uz" />

      <link rel="canonical" href="https://mikan.vercel.app/" />

      {children}
    </Head>
  );
};

export default Seo;
