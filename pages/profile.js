import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../redux/slice/auth';
import { mockUser, achievements } from '../utils/mockData';
import useTranslation from '../hooks/useTranslation';
import NotificationsModal from '../components/NotificationsModal';
import LanguageModal from '../components/LanguageModal';

const xpPercent = (mockUser.xp / mockUser.xpMax) * 100;

const stats = [
  { emoji: '🏅', label: 'overall_score', value: `${mockUser.overallScore}%` },
  { emoji: '✅', label: 'passed_tests', value: `${mockUser.passedExams} / ${mockUser.totalTests}` },
];

export default function Profile() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const { t } = useTranslation();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showLanguage, setShowLanguage] = useState(false);

  const langDisplay = router.locale === 'uz' ? "O'zbek" : 'Русский';

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  const handleLogout = () => {
    dispatch(logout());
    router.push('/login');
  };

  if (!isAuthenticated) return null;

  return (
    <div className="pb-6">
      <h1 className="text-2xl font-bold mb-4">{t('profile')}</h1>

      {/* User Card */}
      <div className="bg-gradient-to-r from-primary to-primary-dark rounded-2xl p-6 text-white">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-white/30 flex items-center justify-center">
            <span className="text-2xl">👤</span>
          </div>
          <div>
            <p className="text-xl font-bold">{mockUser.fullName}</p>
            <p className="text-sm text-white/80">{mockUser.email}</p>
          </div>
        </div>
        <div className="bg-white/20 rounded-full px-4 py-1 text-sm inline-flex items-center gap-1 mt-3">
          ⭐ Target Level: {mockUser.targetLevel}
        </div>
        <div className="mt-4">
          <div className="flex justify-between text-sm mb-1">
            <span>⚡ XP</span>
            <span>{mockUser.xp} / {mockUser.xpMax}</span>
          </div>
          <div className="w-full h-2 bg-white/30 rounded-full">
            <div
              className="h-2 bg-white rounded-full"
              style={{ width: `${xpPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Achievements */}
      <div className="mt-6">
        <h2 className="text-lg font-bold">{t('achievements')}</h2>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-3 mt-3">
          {achievements.map((a) => (
            <div
              key={a.id}
              className="bg-white rounded-xl border border-orange-100 p-4 text-center"
            >
              <span className="text-3xl">{a.emoji}</span>
              <p className="text-xs text-gray-600 mt-2">{a.name}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Statistics */}
      <div className="mt-6">
        <h2 className="text-lg font-bold">{t('statistics')}</h2>
        <div className="mt-3 space-y-3">
          {stats.map((s) => (
            <div
              key={s.label}
              className="bg-white rounded-xl border border-orange-100 p-4 flex items-center gap-4"
            >
              <div className="w-10 h-10 rounded-full bg-primary-50 flex items-center justify-center">
                <span>{s.emoji}</span>
              </div>
              <span className="text-sm text-gray-500">{t(s.label)}</span>
              <span className="text-lg font-bold ml-auto">{s.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Settings */}
      <div className="mt-6 mb-4">
        <h2 className="text-lg font-bold">{t('settings')}</h2>
        <div className="mt-3 space-y-3">
          <div
            onClick={() => setShowNotifications(true)}
            className="bg-white rounded-xl border border-orange-100 p-4 flex items-center justify-between cursor-pointer"
          >
            <div>
              <p className="text-sm font-medium">{t('notifications')}</p>
              <p className="text-xs text-gray-400">{t('manage_notifications')}</p>
            </div>
            <span className="text-gray-400">›</span>
          </div>
          <div
            onClick={() => setShowLanguage(true)}
            className="bg-white rounded-xl border border-orange-100 p-4 flex items-center justify-between cursor-pointer"
          >
            <div>
              <p className="text-sm font-medium">{t('language')}</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">{langDisplay}</span>
              <span className="text-gray-400">›</span>
            </div>
          </div>
          <div
            onClick={handleLogout}
            className="bg-white rounded-xl border border-orange-100 p-4 flex items-center justify-between cursor-pointer"
          >
            <span className="text-sm font-medium text-red-500">{t('log_out')}</span>
          </div>
        </div>
      </div>

      <NotificationsModal
        isOpen={showNotifications}
        onClose={() => setShowNotifications(false)}
      />
      <LanguageModal
        isOpen={showLanguage}
        onClose={() => setShowLanguage(false)}
      />
    </div>
  );
}
