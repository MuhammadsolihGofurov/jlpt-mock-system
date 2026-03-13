import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import Link from 'next/link';
import { jlptLevels, mockQuestions, levelColors } from '../../utils/mockData';

export default function TestDetail() {
  const router = useRouter();
  const { level } = router.query;
  const { isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) return null;

  const levelData = jlptLevels.find((l) => l.id === level);
  if (!levelData) {
    return (
      <div className="pb-24 md:pb-6">
        <p className="text-gray-500">Level not found.</p>
        <Link href="/tests" className="text-primary font-semibold mt-4 inline-block">
          ← Back to Tests
        </Link>
      </div>
    );
  }

  const questionCount = mockQuestions[level]?.length || 0;

  return (
    <div className="pb-24 md:pb-6">
      <Link href="/tests" className="text-primary text-sm font-semibold">
        ← Back to Tests
      </Link>

      {/* Level Header */}
      <div
        className="mt-4 rounded-2xl p-6 text-white"
        style={{ background: `linear-gradient(to right, ${levelColors[level]}, ${levelColors[level]}dd)` }}
      >
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-white/30 flex items-center justify-center font-bold text-2xl">
            {levelData.level}
          </div>
          <div>
            <h1 className="text-2xl font-bold">{levelData.title}</h1>
            <p className="text-white/80">{levelData.difficulty}</p>
          </div>
        </div>
        <p className="mt-3 text-white/90">{levelData.description}</p>
        <div className="flex gap-4 mt-4 text-sm text-white/80">
          <span>📖 {levelData.questions} questions</span>
          <span>🕐 {levelData.timeMinutes} mins</span>
          <span>✅ Pass: {levelData.passingScore}%</span>
        </div>
      </div>

      {/* Sections */}
      <div className="mt-6">
        <h2 className="text-lg font-bold">Test Sections</h2>
        <div className="mt-3 space-y-3 md:grid md:grid-cols-2 md:gap-3 md:space-y-0">
          {levelData.sections.map((section, idx) => (
            <div
              key={idx}
              className="bg-white rounded-xl border border-orange-100 p-4"
            >
              <p className="font-semibold">{section.name}</p>
              <div className="flex gap-4 mt-2 text-sm text-gray-500">
                <span>📝 {section.questions} questions</span>
                <span>🕐 {section.timeMinutes} mins</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Start Test */}
      <div className="mt-8">
        <div className="bg-white rounded-xl border border-orange-100 p-5 text-center">
          <p className="text-gray-500 text-sm mb-1">
            {questionCount} practice questions available
          </p>
          <p className="text-xs text-gray-400 mb-4">
            Answer all questions within the time limit. You need {levelData.passingScore}% to pass.
          </p>
          <Link href={`/tests/${level}/1`}>
            <button className="w-full bg-primary text-white rounded-xl py-3 font-semibold hover:bg-primary-dark transition-colors">
              Start Test 🚀
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
