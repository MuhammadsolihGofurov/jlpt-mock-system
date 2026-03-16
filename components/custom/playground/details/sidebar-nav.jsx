export const SidebarNavigation = ({
  sections,
  currentSectionIndex,
  setCurrentSectionIndex,
  answers,
}) => {
  return (
    <aside className="w-80 bg-slate-900 text-white p-6 hidden lg:flex flex-col gap-6">
      <div className="space-y-4">
        <h3 className="font-bold text-slate-400 uppercase text-xs tracking-widest">
          Bo'limlar
        </h3>
        {sections.map((sec, idx) => (
          <button
            key={sec.id}
            onClick={() => setCurrentSectionIndex(idx)}
            className={`w-full text-left p-4 rounded-2xl transition-all flex justify-between items-center
              ${currentSectionIndex === idx ? "bg-primary text-white" : "hover:bg-slate-800 text-slate-300"}`}
          >
            <span className="font-bold">{sec.name}</span>
            {/* Bu bo'limda nechta savol yechilganini hisoblash mantiqi */}
          </button>
        ))}
      </div>
    </aside>
  );
};
