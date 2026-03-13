import React from "react";
import { Plus } from "lucide-react";
import { useIntl } from "react-intl";

const PageHeader = ({
  title,
  description,
  badge,
  buttonLabel,
  onButtonClick,
  extraActions,
}) => {
  const intl = useIntl();
  return (
    <div className="relative mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-5">
      {/* Matn qismi */}
      <div className="relative">
        {/* Chap tomondagi brend-line (faqat desktopda) */}
        <div className="absolute -left-5 top-1/2 -translate-y-1/2 w-1.5 h-10 bg-primary rounded-r-full hidden md:block shadow-[0_0_15px_rgba(245,166,35,0.4)]" />

        <div className="flex items-center gap-3 mb-1.5">
          <h1 className="text-3xl md:text-4xl font-black tracking-tight text-heading">
            {intl.formatMessage({ id: title })}
          </h1>
          {badge && (
            <span className="bg-orange-50 text-primary text-[10px] font-black px-2.5 py-1 rounded-xl border border-orange-100 uppercase tracking-wider shadow-sm">
              {intl.formatMessage({ id: badge })}
            </span>
          )}
        </div>

        {description && (
          <p className="text-muted font-medium flex items-center gap-2 text-sm md:text-base">
            <span className="flex h-2 w-2 rounded-full bg-primary/40 animate-pulse" />
            {intl.formatMessage({ id: description })}
          </p>
        )}
      </div>

      {/* Harakatlar qismi (Buttons) */}
      <div className="flex items-center gap-3">
        {extraActions && (
          <div className="flex items-center gap-2">{extraActions}</div>
        )}

        {buttonLabel && (
          <button
            onClick={onButtonClick}
            className="group bg-heading hover:bg-primary text-white font-bold px-6 py-3.5 rounded-[1.4rem] shadow-xl shadow-gray-200 hover:shadow-orange-200 transition-all duration-300 active:scale-95 flex items-center gap-2"
          >
            <div className="bg-white/20 rounded-lg p-0.5 group-hover:rotate-90 transition-transform duration-300">
              <Plus size={18} strokeWidth={3} />
            </div>
            <span className="text-sm tracking-wide">
              {intl.formatMessage({ id: buttonLabel })}
            </span>
          </button>
        )}
      </div>
    </div>
  );
};

export default PageHeader;
