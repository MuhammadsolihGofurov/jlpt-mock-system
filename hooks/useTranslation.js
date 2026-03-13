import { useRouter } from 'next/router';
import ru from '../lang/ru.json';
import uz from '../lang/uz.json';

const translations = { ru, uz };

export default function useTranslation() {
  const { locale = 'ru' } = useRouter();
  const t = (key) => {
    const dict = translations[locale] || translations.ru;
    return dict[key] || key;
  };
  return { t, locale };
}
