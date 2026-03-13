import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import { testResults } from "../utils/mockData";

export default function Results() {
  const router = useRouter();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) return null;

  const totalTests = testResults.length;
  const avgScore = Math.round(
    testResults.reduce((sum, t) => sum + t.score, 0) / totalTests
  );
  const passRate = Math.round(
    (testResults.filter((t) => t.status === "Pass").length / totalTests) * 100
  );

  const levelColors = {
    N1: "border-red-300 text-red-600 bg-red-50",
    N2: "border-purple-300 text-purple-600 bg-purple-50",
    N3: "border-green-300 text-green-600 bg-green-50",
    N4: "border-blue-300 text-blue-600 bg-blue-50",
    N5: "border-yellow-300 text-yellow-600 bg-yellow-50",
  };

  return (
    <main className="py-6">
      {/* Header */}
      <h1 className="text-2xl font-bold">My Results</h1>
      <p className="text-gray-500 mt-1">Your learning history</p>

      {/* Summary Stats */}
      <div className="mt-6 grid grid-cols-3 gap-3">
        {[
          { value: totalTests, label: "Tests" },
          { value: `${avgScore}%`, label: "Avg Score" },
          { value: `${passRate}%`, label: "Pass Rate" },
        ].map((stat) => (
          <div
            key={stat.label}
            className="bg-white rounded-xl border border-orange-100 p-4 text-center"
          >
            <p className="text-2xl font-bold">{stat.value}</p>
            <p className="text-sm text-gray-500">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Results List */}
      <div className="mt-6 md:grid md:grid-cols-2 md:gap-4">
        {testResults.map((result) => (
          <div
            key={result.id}
            className="mb-4 md:mb-0 bg-white rounded-2xl border border-orange-100 p-5"
          >
            {/* Top row */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span
                  className={`rounded-full px-2 py-0.5 text-xs font-bold border ${
                    levelColors[result.level] || "bg-primary-50 text-primary border-primary"
                  }`}
                >
                  {result.level}
                </span>
                <span>🏅</span>
              </div>
              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ${
                  result.status === "Pass"
                    ? "bg-green-50 text-green-600"
                    : "bg-red-50 text-red-600"
                }`}
              >
                {result.status}
              </span>
            </div>

            {/* Test name */}
            <p className="font-semibold text-lg mt-2">{result.name}</p>

            {/* Score */}
            <div className="flex items-center gap-1 mt-1">
              <span className="text-3xl font-bold">{result.score}%</span>
              <span>📈</span>
            </div>

            {/* Correct count */}
            <p className="text-sm text-gray-500">
              {result.correct} / {result.total} correct
            </p>

            {/* Divider */}
            <div className="border-t border-orange-100 my-3" />

            {/* Date */}
            <div className="flex items-center gap-1 text-sm text-gray-500">
              <span>📅</span>
              <span>{result.date}</span>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
