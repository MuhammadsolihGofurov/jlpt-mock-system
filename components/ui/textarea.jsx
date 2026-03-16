import { useIntl } from "react-intl";

export const Textarea = ({
  label,
  error,
  register,
  name,
  rows = 3,
  ...props
}) => {
  const intl = useIntl();

  return (
    <div className="w-full space-y-1.5">
      {label && (
        <label className="text-sm font-bold text-heading px-1">
          {/* Agar tarjima kodi bo'lsa tarjima qiladi, aks holda labelni o'zini chiqaradi */}
          {intl.messages[label] ? intl.formatMessage({ id: label }) : label}
        </label>
      )}

      <div className="relative group">
        <textarea
          {...(register ? register(name) : {})}
          {...props}
          rows={rows}
          className={`w-full px-5 py-3.5 rounded-2xl border-2 transition-all outline-none text-[15px] font-medium min-h-[100px]
          ${
            error
              ? "border-danger bg-red-50/30 text-danger focus:border-danger"
              : "border-gray-100 bg-gray-50/50 focus:border-primary focus:bg-white focus:shadow-lg focus:shadow-orange-100 text-heading"
          } custom-scrollbar`}
        />
      </div>

      {error && (
        <p className="text-xs text-danger font-bold px-1 uppercase tracking-tighter animate-in fade-in slide-in-from-top-1">
          {error.message}
        </p>
      )}
    </div>
  );
};

export default Textarea;
