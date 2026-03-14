import { ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export const Select = ({ label, options, value, onChange, error }) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef(null);

  useEffect(() => {
    const clickOutside = (e) => {
      if (selectRef.current && !selectRef.current.contains(e.target))
        setIsOpen(false);
    };
    document.addEventListener("mousedown", clickOutside);
    return () => document.removeEventListener("mousedown", clickOutside);
  }, []);

  const selectedOption = options.find((opt) => opt.value === value);

  return (
    <div className="w-full space-y-1.5 relative" ref={selectRef}>
      {label && (
        <label className="text-sm font-bold text-heading px-1">{label}</label>
      )}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full px-5 py-3.5 rounded-2xl border-2 cursor-pointer flex justify-between items-center transition-all
          ${error ? "border-danger bg-red-50/30" : "border-gray-100 bg-gray-50/50"}`}
      >
        <span className="text-[15px] font-medium text-heading">
          {selectedOption?.label || "Tanlang"}
        </span>
        <span
          className={`transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
        >
          <ChevronDown size={14}/>
        </span>
      </div>

      {isOpen && (
        <div className="absolute top-[105%] left-0 w-full bg-white border border-gray-100 rounded-2xl shadow-2xl z-[60] overflow-hidden animate-in fade-in zoom-in duration-200">
          {options.map((opt) => (
            <div
              key={opt.value}
              onClick={() => {
                onChange(opt.value);
                setIsOpen(false);
              }}
              className="px-5 py-3 hover:bg-orange-50 hover:text-primary cursor-pointer text-sm font-bold transition-colors"
            >
              {opt.label}
            </div>
          ))}
        </div>
      )}
      {error && <p className="text-xs text-danger font-bold px-1">{error}</p>}
    </div>
  );
};

export default Select;
