import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import Link from 'next/link';
import { jlptLevels, mockQuestions } from '../../../utils/mockData';
import { ExitTestDialog } from '../../../components';

export default function TestQuestion() {
  const router = useRouter();
  const { level, id } = router.query;
  const { isAuthenticated } = useSelector((state) => state.auth);

  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(null);
  const [showExit, setShowExit] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const levelData = jlptLevels.find((l) => l.id === level);
  const questions = mockQuestions[level] || [];
  const totalQuestions = questions.length;

  // Set initial question index from URL param
  useEffect(() => {
    if (id) {
      const idx = parseInt(id, 10) - 1;
      if (idx >= 0 && idx < totalQuestions) setCurrentQ(idx);
    }
  }, [id, totalQuestions]);

  const question = questions[currentQ];

  // Initialize timer
  useEffect(() => {
    if (levelData && timeLeft === null) {
      setTimeLeft(levelData.timeMinutes * 60);
    }
  }, [levelData, timeLeft]);

  // Countdown timer
  useEffect(() => {
    if (timeLeft === null || timeLeft <= 0 || submitted) return;
    const timer = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timer);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft, submitted]);

  // Auto-submit when time runs out
  useEffect(() => {
    if (timeLeft === 0 && !submitted) {
      setSubmitted(true);
    }
  }, [timeLeft, submitted]);

  // Auth guard
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  const handleSelect = useCallback(
    (label) => {
      if (submitted) return;
      setAnswers((prev) => ({ ...prev, [question.id]: label }));
    },
    [question, submitted]
  );

  const handleSubmit = useCallback(() => {
    setSubmitted(true);
  }, []);

  if (!isAuthenticated) return null;

  if (!levelData || !question) {
    return (
      <div className="pb-24 md:pb-6">
        <p className="text-gray-500">Question not found.</p>
        <Link href="/tests" className="text-primary font-semibold mt-4 inline-block">
          ← Back to Tests
        </Link>
      </div>
    );
  }

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const progress = ((currentQ + 1) / totalQuestions) * 100;
  const selected = answers[question.id];
  const isLast = currentQ === totalQuestions - 1;
  const isFirst = currentQ === 0;

  // Results calculation
  if (submitted) {
    const correctCount = questions.reduce(
      (acc, q) => (answers[q.id] === q.correctAnswer ? acc + 1 : acc),
      0
    );
    const score = Math.round((correctCount / totalQuestions) * 100);
    const passed = score >= (levelData.passingScore || 60);

    return (
      <div className="pb-24 md:pb-6 flex flex-col items-center">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl border border-orange-100 p-6 text-center mt-4">
            <div className="text-6xl mb-4">{passed ? '🎉' : '😔'}</div>
            <h1 className="text-2xl font-bold">
              {passed ? 'Congratulations!' : 'Keep Practicing!'}
            </h1>
            <p className="text-gray-500 mt-2">
              {passed
                ? `You passed the ${levelData.title} test!`
                : `You didn't pass this time, but don't give up!`}
            </p>

            <div className="mt-6 bg-cream rounded-xl p-4">
              <div className="text-4xl font-bold text-primary">{score}%</div>
              <p className="text-sm text-gray-500 mt-1">
                {correctCount} / {totalQuestions} correct
              </p>
              <div
                className={`inline-block rounded-full px-3 py-1 text-sm font-semibold text-white mt-2 ${
                  passed ? 'bg-success' : 'bg-danger'
                }`}
              >
                {passed ? 'PASS' : 'FAIL'}
              </div>
            </div>

            {/* Per-question breakdown */}
            <div className="mt-6 text-left space-y-2">
              {questions.map((q, i) => {
                const userAnswer = answers[q.id];
                const isCorrect = userAnswer === q.correctAnswer;
                return (
                  <div
                    key={q.id}
                    className={`flex items-center gap-2 p-2 rounded-lg text-sm ${
                      isCorrect ? 'bg-green-50' : 'bg-red-50'
                    }`}
                  >
                    <span>{isCorrect ? '✅' : '❌'}</span>
                    <span className="text-gray-600">Q{i + 1}</span>
                    <span className="text-gray-400 ml-auto text-xs">
                      {userAnswer ? `Your: ${userAnswer}` : 'Skipped'} · Correct: {q.correctAnswer}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="mt-6 space-y-3">
              <Link href={`/tests/${level}`}>
                <button className="w-full bg-primary text-white rounded-xl py-3 font-semibold hover:bg-primary-dark transition-colors">
                  Back to {levelData.title}
                </button>
              </Link>
              <Link href="/tests">
                <button className="w-full border border-gray-200 rounded-xl py-3 font-semibold text-gray-700 hover:bg-gray-50 transition-colors">
                  All Tests
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-24 md:pb-6">
      {/* Top bar */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => setShowExit(true)}
          className="text-gray-500 hover:text-gray-700 text-sm font-medium"
        >
          ✕ Exit
        </button>
        <span className="text-sm font-medium text-gray-600">
          {levelData.title}
        </span>
        <span
          className={`text-sm font-bold ${
            timeLeft < 60 ? 'text-danger' : 'text-gray-600'
          }`}
        >
          ⏱ {formatTime(timeLeft || 0)}
        </span>
      </div>

      {/* Progress bar */}
      <div className="w-full h-2 bg-gray-200 rounded-full mb-6">
        <div
          className="h-2 bg-primary rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Question counter */}
      <p className="text-sm text-gray-500 mb-2">
        Question {currentQ + 1} of {totalQuestions}
      </p>

      {/* Question text */}
      <div className="bg-white rounded-2xl border border-orange-100 p-6 mb-6">
        <p className="text-lg font-semibold leading-relaxed">{question.text}</p>
      </div>

      {/* Options */}
      <div className="space-y-3">
        {question.options.map((opt) => {
          const isSelected = selected === opt.label;
          return (
            <button
              key={opt.label}
              onClick={() => handleSelect(opt.label)}
              className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                isSelected
                  ? 'border-primary bg-primary/5'
                  : 'border-orange-100 bg-white hover:border-primary/50'
              }`}
            >
              <div className="flex items-center gap-3">
                <span
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    isSelected
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {opt.label}
                </span>
                <span className="font-medium">{opt.text}</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Navigation */}
      <div className="flex gap-3 mt-8">
        {!isFirst && (
          <button
            onClick={() => setCurrentQ((q) => q - 1)}
            className="flex-1 border border-gray-200 rounded-xl py-3 font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
          >
            ← Previous
          </button>
        )}
        {isLast ? (
          <button
            onClick={handleSubmit}
            className="flex-1 bg-success text-white rounded-xl py-3 font-semibold hover:bg-green-600 transition-colors"
          >
            Submit ✓
          </button>
        ) : (
          <button
            onClick={() => setCurrentQ((q) => q + 1)}
            className="flex-1 bg-primary text-white rounded-xl py-3 font-semibold hover:bg-primary-dark transition-colors"
          >
            Next →
          </button>
        )}
      </div>

      <ExitTestDialog
        isOpen={showExit}
        onCancel={() => setShowExit(false)}
        onExit={() => router.push(`/tests/${level}`)}
      />
    </div>
  );
}
