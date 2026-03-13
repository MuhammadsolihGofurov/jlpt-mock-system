import { useRouter } from 'next/router';

const languages = [
  { code: 'ru', name: 'Русский', flag: '🇷🇺' },
  { code: 'uz', name: "O'zbek", flag: '🇺🇿' },
];

export default function LanguageModal({ isOpen, onClose }) {
  const router = useRouter();
  const currentLocale = router.locale || 'ru';

  if (!isOpen) return null;

  const handleSelect = (code) => {
    router.push(router.pathname, router.asPath, { locale: code });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-6 max-w-sm w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold">Language</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl">
            ✕
          </button>
        </div>

        <div className="space-y-3">
          {languages.map((lang) => {
            const isActive = currentLocale === lang.code;
            return (
              <button
                key={lang.code}
                onClick={() => handleSelect(lang.code)}
                className={`w-full text-left p-4 rounded-xl border-2 transition-all flex items-center gap-3 ${
                  isActive
                    ? 'border-primary bg-primary/5'
                    : 'border-orange-100 hover:border-primary/50'
                }`}
              >
                <span className="text-2xl">{lang.flag}</span>
                <span className="font-medium">{lang.name}</span>
                {isActive && (
                  <span className="ml-auto text-primary font-bold">✓</span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
