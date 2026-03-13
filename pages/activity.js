import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import { testResults, recentActivity } from '../utils/mockData';

// Merge and deduplicate activity items, sorted by date descending
const allActivity = [...testResults, ...recentActivity]
  .reduce((acc, item) => {
    if (!acc.find((a) => a.name === item.name && a.date === item.date)) {
      acc.push(item);
    }
    return acc;
  }, [])
  .sort((a, b) => new Date(b.date) - new Date(a.date));

export default function Activity() {
  const router = useRouter();
  const { isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) return null;

  return (
    <div className="pb-24 md:pb-6">
      <h1 className="text-2xl font-bold">Activity History</h1>
      <p className="text-gray-500 mt-1 mb-6">Your complete test history</p>

      <div className="md:grid md:grid-cols-2 md:gap-4">
        {allActivity.map((item, idx) => (
          <div
            key={`${item.name}-${item.date}-${idx}`}
            className="bg-white rounded-xl border border-orange-100 p-4 mb-3 md:mb-0"
          >
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  {item.level && (
                    <span className="inline-block bg-primary/10 text-primary text-xs font-bold px-2 py-0.5 rounded-full">
                      {item.level}
                    </span>
                  )}
                  <span className="font-semibold text-sm">{item.name}</span>
                </div>
                <p className="text-sm text-gray-400 mt-1">{item.date}</p>
                {item.correct !== undefined && (
                  <p className="text-xs text-gray-400 mt-1">
                    {item.correct} / {item.total} correct
                  </p>
                )}
              </div>
              <div className="flex flex-col items-end gap-1">
                <span
                  className={`inline-block rounded-full px-2 py-0.5 text-xs font-semibold text-white ${
                    item.status === 'Pass' ? 'bg-success' : 'bg-danger'
                  }`}
                >
                  {item.status}
                </span>
                <span className="text-xl font-bold">{item.score}%</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
