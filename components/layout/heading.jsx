import React from "react";
import { Plus } from "lucide-react";
import { useIntl } from "react-intl";
import { useSelector } from "react-redux";
import { PageHeaderSkeleton } from "../skeleton";

const PageHeader = ({
  title,
  description,
  badge,
  buttonLabel,
  onButtonClick,
  extraActions,
  roles = [],
  icon = <Plus size={18} strokeWidth={3} />,
  customLoading = false
}) => {
  const intl = useIntl();
  const { user, loading } = useSelector((state) => state.auth);


  if (customLoading || loading) {
    return <PageHeaderSkeleton />
  }

  return (
    <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-5">
      <div className="relative w-full flex-1">
        <div className="absolute -left-5 top-1/2 -translate-y-1/2 w-1.5 h-10 bg-primary rounded-r-full hidden md:block shadow-[0_0_15px_rgba(245,166,35,0.4)]" />

        <div className="flex items-center gap-3 mb-1.5">
          <h1 className="text-xl sm:text-2xl md:text-4xl font-bold sm:font-black tracking-tight text-heading">
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
            <span className="flex-1">
              {intl.formatMessage({ id: description })}
            </span>
          </p>
        )}
      </div>

      <div className="flex items-center flex-wrap gap-3">
        {extraActions && (
          <div className="flex items-center gap-2 w-full sm:w-auto">
            {extraActions}
          </div>
        )}

        {roles.includes(user?.role) && buttonLabel && (
          <button
            onClick={onButtonClick}
            className="group bg-heading hover:bg-primary text-white font-semibold sm:font-bold px-6 py-3.5 rounded-[1.4rem] shadow-xl shadow-gray-200 hover:shadow-orange-200 transition-all duration-300 active:scale-95 flex items-center gap-2"
          >
            <div className="bg-white/20 rounded-lg p-0.5 group-hover:rotate-90 transition-transform duration-300">
              {icon}
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
