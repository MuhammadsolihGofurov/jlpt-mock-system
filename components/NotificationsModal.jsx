import { useState } from 'react';

const defaultSettings = [
  { id: 'daily', label: 'Daily Reminder', description: 'Get reminded to study every day', enabled: true },
  { id: 'results', label: 'Test Results', description: 'Notify when test results are ready', enabled: true },
  { id: 'streak', label: 'Streak Alerts', description: 'Alert when your streak is about to expire', enabled: false },
];

export default function NotificationsModal({ isOpen, onClose }) {
  const [settings, setSettings] = useState(defaultSettings);

  if (!isOpen) return null;

  const toggle = (id) => {
    setSettings((prev) =>
      prev.map((s) => (s.id === id ? { ...s, enabled: !s.enabled } : s))
    );
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-6 max-w-sm w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold">Notifications</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl">
            ✕
          </button>
        </div>

        <div className="space-y-4">
          {settings.map((s) => (
            <div key={s.id} className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">{s.label}</p>
                <p className="text-xs text-gray-400">{s.description}</p>
              </div>
              <button
                onClick={() => toggle(s.id)}
                className={`w-11 h-6 rounded-full transition-colors relative flex-shrink-0 ${
                  s.enabled ? 'bg-primary' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`absolute top-[2px] left-[2px] w-5 h-5 bg-white rounded-full shadow-sm transition-transform ${
                    s.enabled ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          ))}
        </div>

        <button
          onClick={onClose}
          className="w-full mt-6 bg-primary text-white rounded-xl py-3 font-semibold hover:bg-primary-dark transition-colors"
        >
          Done
        </button>
      </div>
    </div>
  );
}
