import { ChevronDown, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useIntl } from "react-intl";

export const Select = ({
  label,
  options = [],
  value, // isMulti bo'lsa [val1, val2], bo'lmasa val1
  onChange,
  error,
  isLabel = true,
  isMulti = false, // Yangi prop
  placeholder = "Tanlang",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef(null);
  const intl = useIntl();

  useEffect(() => {
    const clickOutside = (e) => {
      if (selectRef.current && !selectRef.current.contains(e.target))
        setIsOpen(false);
    };
    document.addEventListener("mousedown", clickOutside);
    return () => document.removeEventListener("mousedown", clickOutside);
  }, []);

  // Tanlangan variant(lar)ni aniqlash
  const getSelectedOptions = () => {
    if (isMulti) {
      return options.filter(
        (opt) => Array.isArray(value) && value.includes(opt.value),
      );
    }
    return options.find((opt) => opt.value === value);
  };

  const selected = getSelectedOptions();

  const handleSelect = (optionValue) => {
    if (isMulti) {
      const newValue = Array.isArray(value) ? [...value] : [];
      if (newValue.includes(optionValue)) {
        // Agar allaqachon bo'lsa, olib tashlaymiz (Toggle)
        onChange(newValue.filter((v) => v !== optionValue));
      } else {
        // Yangi qiymat qo'shamiz
        onChange([...newValue, optionValue]);
      }
    } else {
      onChange(optionValue);
      setIsOpen(false);
    }
  };

  const removeOption = (e, optionValue) => {
    e.stopPropagation(); // Dropdown ochilib ketmasligi uchun
    if (isMulti && Array.isArray(value)) {
      onChange(value.filter((v) => v !== optionValue));
    }
  };

  return (
    <div className="w-full space-y-1.5 relative" ref={selectRef}>
      {label && (
        <label className="text-sm font-bold text-heading px-1">
          {intl.formatMessage({ id: label })}
        </label>
      )}

      <div
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full px-4 py-2.5 rounded-2xl border-2 cursor-pointer flex justify-between items-center transition-all min-h-[54px]
          ${error ? "border-danger bg-red-50/30" : "border-gray-100 bg-gray-50/50 hover:border-orange-200"}`}
      >
        <div className="flex flex-wrap gap-2 overflow-hidden">
          {isMulti ? (
            Array.isArray(selected) && selected.length > 0 ? (
              selected.map((opt) => (
                <span
                  key={opt.value}
                  className="flex items-center gap-1 bg-white border border-orange-100 text-primary text-[13px] font-bold px-3 py-1 rounded-xl shadow-sm animate-in zoom-in duration-200"
                >
                  {isLabel ? intl.formatMessage({ id: opt.label }) : opt.label}
                  <X
                    size={14}
                    className="hover:text-danger transition-colors cursor-pointer"
                    onClick={(e) => removeOption(e, opt.value)}
                  />
                </span>
              ))
            ) : (
              <span className="text-slate-400 text-sm">
                {intl.formatMessage({ id: placeholder })}
              </span>
            )
          ) : (
            <span className="text-[15px] font-medium text-heading">
              {selected
                ? isLabel
                  ? intl.formatMessage({ id: selected.label })
                  : selected.label
                : intl.formatMessage({ id: placeholder })}
            </span>
          )}
        </div>

        <span
          className={`transition-transform duration-300 ml-2 shrink-0 ${isOpen ? "rotate-180" : ""}`}
        >
          <ChevronDown size={14} className="text-slate-400" />
        </span>
      </div>

      {isOpen && (
        <div className="absolute top-[105%] left-0 w-full bg-white border border-gray-100 rounded-2xl shadow-2xl z-[70] overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 max-h-[250px] overflow-y-auto custom-scrollbar">
          {options.length > 0 ? (
            options.map((opt) => {
              const isSelected = isMulti
                ? Array.isArray(value) && value.includes(opt.value)
                : value === opt.value;

              return (
                <div
                  key={opt.value}
                  onClick={() => handleSelect(opt.value)}
                  className={`px-5 py-3 hover:bg-orange-50 cursor-pointer text-sm font-bold transition-colors flex items-center justify-between
                    ${isSelected ? "text-primary bg-orange-50/50" : "text-heading"}`}
                >
                  {isLabel ? intl.formatMessage({ id: opt.label }) : opt.label}
                  {isSelected && isMulti && (
                    <div className="w-2 h-2 bg-primary rounded-full" />
                  )}
                </div>
              );
            })
          ) : (
            <div className="px-5 py-4 text-center text-slate-400 text-xs font-medium">
              Ma'lumot mavjud emas
            </div>
          )}
        </div>
      )}

      {error && <p className="text-xs text-danger font-bold px-1">{error}</p>}
    </div>
  );
};

export default Select;
