import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { mockUser, recentActivity, recommendedTests } from "../utils/mockData";

export default function Home() {
  const router = useRouter();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) return null;

  return (
    <main className="min-h-screen bg-cream px-4 py-6 pb-24 md:pb-6">
      {/* Welcome Header */}
      <div>
        <h1 className="text-2xl font-bold">Welcome back, {mockUser.name}</h1>
        <p className="text-gray-500 mt-1">
          Let&apos;s continue your learning journey!
        </p>
      </div>

      {/* Streak Card */}
      <div className="mt-6 bg-gradient-to-r from-primary to-primary-dark rounded-2xl p-5 text-white relative overflow-hidden">
        <Image
          src="/mikan-logo.svg"
          alt="Mikan"
          width={96}
          height={96}
          className="absolute right-4 top-4 opacity-30 w-24 h-24"
        />
        <div className="flex items-center gap-2">
          <span className="text-xl">🍊</span>
          <span className="font-semibold">Vitamin C Streak</span>
        </div>
        <div className="flex items-baseline gap-2 mt-2">
          <span className="text-5xl font-bold">{mockUser.streak}</span>
          <span className="text-xl">days</span>
        </div>
        <div className="mt-4">
          <div className="flex justify-between items-center text-sm">
            <span>Energy Level</span>
            <span>{mockUser.energyLevel}%</span>
          </div>
          <div className="mt-1 h-2 rounded-full bg-white/30">
            <div
              className="h-2 rounded-full bg-white"
              style={{ width: `${mockUser.energyLevel}%` }}
            />
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-white rounded-xl border border-orange-100 p-4">
          <span className="text-xl">📝</span>
          <p className="text-2xl font-bold mt-1">{mockUser.totalTests}</p>
          <p className="text-sm text-gray-500">Total Tests</p>
        </div>
        <div className="bg-white rounded-xl border border-orange-100 p-4">
          <span className="text-xl">📈</span>
          <p className="text-2xl font-bold mt-1">{mockUser.avgScore}%</p>
          <p className="text-sm text-gray-500">Avg Score</p>
        </div>
        <div className="bg-white rounded-xl border border-orange-100 p-4">
          <span className="text-xl">🕐</span>
          <p className="text-2xl font-bold mt-1">{mockUser.timeSpent}</p>
          <p className="text-sm text-gray-500">Time Spent</p>
        </div>
        <div className="bg-white rounded-xl border border-orange-100 p-4">
          <span className="text-xl">🏆</span>
          <p className="text-2xl font-bold mt-1">{mockUser.passedExams}</p>
          <p className="text-sm text-gray-500">Passed Exams</p>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="mt-8">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-bold">Recent Activity</h2>
          <Link href="/activity" className="text-primary text-sm font-semibold">
            View all &gt;
          </Link>
        </div>
        {recentActivity.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-xl border border-orange-100 p-4 mb-3 mt-3 flex justify-between items-center"
          >
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold">{item.name}</span>
                <span
                  className={`inline-block rounded-full px-2 py-0.5 text-xs font-semibold text-white ${
                    item.status === "Pass" ? "bg-success" : "bg-danger"
                  }`}
                >
                  {item.status}
                </span>
              </div>
              <p className="text-sm text-gray-400 mt-1">{item.date}</p>
            </div>
            <span className="text-xl font-bold">{item.score}%</span>
          </div>
        ))}
      </div>

      {/* Recommended Tests */}
      <div className="mt-8 mb-4">
        <h2 className="text-lg font-bold">Recommended Tests</h2>
        <div
          className="flex overflow-x-auto gap-3 mt-3 md:grid md:grid-cols-3 md:overflow-visible scrollbar-hide"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {recommendedTests.map((test) => (
            <div
              key={test.id}
              className="min-w-[200px] bg-white rounded-xl border border-orange-100 p-4 flex-shrink-0"
            >
              <span className="inline-block bg-primary/10 text-primary text-xs font-bold px-2 py-1 rounded-full">
                {test.level}
              </span>
              <p className="font-semibold mt-2">{test.name}</p>
              <p className="text-sm text-gray-500 mt-1">
                {test.questions} questions · {test.timeMinutes} mins
              </p>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </main>
  );
}
