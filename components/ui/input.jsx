import { useIntl } from "react-intl";

export const Input = ({ label, error, register, name, ...props }) => {
  const intl = useIntl();
  return (
    <div className="w-full space-y-1.5">
      {label && (
        <label className="text-sm font-bold text-heading px-1">
          {intl.formatMessage({ id: label })}
        </label>
      )}
      <input
        {...register(name)}
        {...props}
        className={`w-full px-5 py-3.5 rounded-2xl border-2 transition-all outline-none text-[15px] font-medium
        ${error ? "border-danger bg-red-50/30" : "border-gray-100 bg-gray-50/50 focus:border-primary focus:bg-white focus:shadow-lg focus:shadow-orange-100"}`}
      />
      {error && (
        <p className="text-xs text-danger font-bold px-1 uppercase tracking-tighter">
          {error.message}
        </p>
      )}
    </div>
  );
};

export default Input;
