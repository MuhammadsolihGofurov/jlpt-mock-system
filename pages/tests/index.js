import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import Link from "next/link";
import { jlptLevels, levelColors } from "../../utils/mockData";

export default function TestsList() {
  const router = useRouter();
  const { isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/login");
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-cream p-5 pb-24 md:pb-5">
      <h1 className="text-2xl font-bold">All Tests</h1>
      <p className="text-gray-500 mt-1 mb-6">Choose your level</p>

      <div className="md:grid md:grid-cols-2 md:gap-4">
      {jlptLevels.map((level) => (
        <div
          key={level.id}
          className="bg-white rounded-2xl border border-orange-100 p-5 mb-4 md:mb-0"
        >
          <div className="flex items-center gap-4">
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center text-white font-bold text-lg"
              style={{ backgroundColor: levelColors[level.id] }}
            >
              {level.level}
            </div>
            <div>
              <h2 className="font-bold text-lg">{level.title}</h2>
              <p className="text-sm text-gray-500">{level.difficulty}</p>
            </div>
          </div>

          <p className="text-sm text-gray-600 mt-3">{level.description}</p>

          <div className="flex gap-4 mt-3">
            <span className="text-sm text-gray-500">📖 {level.questions} questions</span>
            <span className="text-sm text-gray-500">🕐 {level.timeMinutes} mins</span>
          </div>

          <Link href={`/tests/${level.id}`}>
            <button className="w-full mt-4 bg-primary text-white rounded-xl py-3 font-semibold text-center flex items-center justify-center gap-2">
              View Details <span>&gt;</span>
            </button>
          </Link>
        </div>
      ))}
      </div>
    </div>
  );
}
