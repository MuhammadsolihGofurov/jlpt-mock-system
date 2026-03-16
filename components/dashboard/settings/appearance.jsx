import React from "react";
import { useIntl } from "react-intl";
import { Languages, Moon, Sun, Monitor } from "lucide-react";
import { useRouter } from "next/router";
// import { useTheme } from "next-themes"; // Agar next-themes ishlatsangiz

const AppearanceSettings = () => {
  const intl = useIntl();
  const router = useRouter();
  const { locale, pathname, asPath, query } = router;

  // Tilni o'zgartirish funksiyasi
  const changeLanguage = (newLocale) => {
    router.push({ pathname, query }, asPath, { locale: newLocale });
  };

  return (
    <div className="space-y-3 sm:space-y-6">
      {/* Tilni o'zgartirish bloki */}
      <div className="bg-white/80 backdrop-blur-md border border-gray-100 p-6 rounded-[2.5rem] shadow-sm">
        <div className="flex items-center gap-4 mb-6">
          <div className="bg-blue-50 p-3 rounded-2xl text-blue-600">
            <Languages size={24} />
          </div>
          <div>
            <h3 className="text-lg font-black text-heading leading-none">
              {intl.formatMessage({ id: "language_settings" })}
            </h3>
            <p className="text-muted text-sm font-medium mt-1">
              {intl.formatMessage({ id: "language_settings_desc" })}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
          {[
            {
              code: "uz",
              label: "O'zbekcha",
              flag: "https://flagcdn.com/w40/uz.png",
            },
            {
              code: "ru",
              label: "Русский",
              flag: "https://flagcdn.com/w40/ru.png",
            },
            {
              code: "en",
              label: "English",
              flag: "https://flagcdn.com/w40/us.png",
            },
            {
              code: "jp",
              label: "日本語",
              flag: "https://flagcdn.com/w40/jp.png",
            },
          ].map((lang) => (
            <button
              key={lang.code}
              onClick={() => changeLanguage(lang.code)}
              className={`flex items-center justify-between px-5 py-4 rounded-2xl border-2 transition-all active:scale-95
                ${
                  locale === lang.code
                    ? "border-primary bg-orange-50/50 text-primary shadow-lg shadow-orange-100"
                    : "border-gray-50 bg-gray-50/30 text-muted hover:border-gray-200"
                }`}
            >
              <span className="font-bold">{lang.label}</span>
              <div className="relative w-6 h-6 overflow-hidden rounded-full border border-gray-100">
                <img
                  src={lang.flag}
                  alt={lang.label}
                  className="w-full h-full object-cover"
                />
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Mavzu (Dark/Light) bloki */}
      {/* <div className="bg-white/80 backdrop-blur-md border border-gray-100 p-6 rounded-[2.5rem] shadow-sm">
        <div className="flex items-center gap-4 mb-6">
          <div className="bg-purple-50 p-3 rounded-2xl text-purple-600">
            <Moon size={24} />
          </div>
          <div>
            <h3 className="text-lg font-black text-heading leading-none">
              {intl.formatMessage({ id: "theme_settings" }) ||
                "Tashqi ko'rinish"}
            </h3>
            <p className="text-muted text-sm font-medium mt-1">
              {intl.formatMessage({ id: "theme_settings_desc" }) ||
                "Mavzu rejimini boshqarish"}
            </p>
          </div>
        </div>

        <div className="flex items-center p-1.5 bg-gray-100/50 rounded-[1.8rem] w-fit">
          <ThemeButton
            active={true} // Kelajakda logic qo'shiladi
            icon={<Sun size={20} />}
            label="Light"
          />
          <ThemeButton active={false} icon={<Moon size={20} />} label="Dark" />
          <ThemeButton
            active={false}
            icon={<Monitor size={20} />}
            label="System"
          />
        </div>
      </div> */}
    </div>
  );
};

// Yordamchi tugma komponenti
const ThemeButton = ({ active, icon, label }) => (
  <button
    className={`flex items-center gap-2 px-6 py-3 rounded-[1.5rem] font-bold text-sm transition-all
      ${
        active
          ? "bg-white text-heading shadow-md"
          : "text-muted hover:text-heading"
      }`}
  >
    {icon}
    {label}
  </button>
);

export default AppearanceSettings;
