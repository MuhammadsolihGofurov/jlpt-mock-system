import { useState } from "react";
import { useIntl } from "react-intl";
import { Eye, EyeOff } from "lucide-react"; // Iconlar

export const Input = ({ label, error, register, name, type = "text", ...props }) => {
  const intl = useIntl();
  const [showPassword, setShowPassword] = useState(false);

  // Parol bo'lsa va showPassword true bo'lsa 'text' aks holda 'password'
  const inputType = type === "password" && showPassword ? "text" : type;

  return (
    <div className="w-full space-y-1.5">
      {label && (
        <label className="text-sm font-bold text-heading px-1">
          {/* Agar tarjima topilmasa label o'zini chiqaradi */}
          {intl.messages[label] ? intl.formatMessage({ id: label }) : label}
        </label>
      )}
      
      <div className="relative group">
        <input
          {...(register ? register(name) : {})} // register ixtiyoriy bo'lishi uchun
          {...props}
          type={inputType}
          className={`w-full px-5 py-3.5 rounded-2xl border-2 transition-all outline-none text-[15px] font-medium
          ${error 
            ? "border-danger bg-red-50/30 text-danger" 
            : "border-gray-100 bg-gray-50/50 focus:border-primary focus:bg-white focus:shadow-lg focus:shadow-orange-100 text-heading"
          } ${type === "password" ? "pr-12" : ""}`} // Parol bo'lsa o'ngdan joy ochamiz
        />

        {/* Faqat password bo'lgandagina Eye iconni chiqaramiz */}
        {type === "password" && (
          <button
            type="button" // Formani submit qilib yubormasligi uchun
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-1.5 rounded-xl hover:bg-gray-100 text-muted transition-colors"
          >
            {showPassword ? (
              <EyeOff size={18} strokeWidth={2.5} />
            ) : (
              <Eye size={18} strokeWidth={2.5} />
            )}
          </button>
        )}
      </div>

      {error && (
        <p className="text-xs text-danger font-bold px-1 uppercase tracking-tighter animate-in fade-in slide-in-from-top-1">
          {error.message}
        </p>
      )}
    </div>
  );
};

export default Input;