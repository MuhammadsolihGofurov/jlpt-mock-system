import { TrendingUp, ArrowUpRight } from "lucide-react";
import { useIntl } from "react-intl";

const StatCard = ({ title, value, icon: Icon, growth, color = "orange" }) => {
  const intl = useIntl();
  const colors = {
    orange: "bg-orange-50 text-orange-600 ring-orange-100",
    blue: "bg-blue-50 text-blue-600 ring-blue-100",
    purple: "bg-purple-50 text-purple-600 ring-purple-100",
  };

  return (
    <div className="group relative overflow-hidden bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
      {/* Orqa fondagi dekorativ doira (hoverda ko'rinadi) */}
      <div className="absolute -right-4 -top-4 w-24 h-24 bg-gray-50 rounded-full transition-all group-hover:scale-150 group-hover:bg-orange-50/50" />

      <div className="relative flex justify-between items-start">
        {/* Ikonka konteyneri */}
        <div
          className={`p-4 rounded-2xl shadow-sm ring-4 ${colors[color] || colors.orange} transition-transform group-hover:rotate-6`}
        >
          <Icon size={26} strokeWidth={2.5} />
        </div>

        {/* Growth Badge */}
        {growth ? (
          <div className="flex items-center gap-1 text-[13px] font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-100">
            <ArrowUpRight size={16} />
            <span>{growth}%</span>
          </div>
        ) : (
          <div className="opacity-0 group-hover:opacity-100 transition-opacity">
            <ArrowUpRight size={20} className="text-gray-300" />
          </div>
        )}
      </div>

      <div className="relative mt-8">
        <p className="text-gray-500 text-sm font-semibold tracking-wide uppercase">
          {intl.formatMessage({ id: title })}
        </p>
        <div className="flex items-baseline gap-2 mt-1">
          <h3 className="text-3xl font-black text-gray-900 tracking-tight">
            {value?.toLocaleString() || 0}
          </h3>
          {/* Agar birlik bo'lsa (masalan %) shu yerga qo'shish mumkin */}
        </div>
      </div>

      {/* Pastki qismdagi mayin chiziq */}
      <div className="absolute bottom-0 left-0 h-1.5 w-0 bg-orange-400 transition-all duration-500 group-hover:w-full" />
    </div>
  );
};

export default StatCard;
