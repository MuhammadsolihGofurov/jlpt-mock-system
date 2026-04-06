import { ChevronDown, X, Search as SearchIcon } from "lucide-react";
import { useEffect, useRef, useState, useMemo } from "react";
import { useIntl } from "react-intl";

export const Select = ({
  label,
  options = [],
  value,
  onChange,
  error,
  isLabel = true,
  isMulti = false,
  placeholder = "Tanlang",
  isSearchable = true, // Yangi prop: qidiruvni yoqish/o'chirish
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const selectRef = useRef(null);
  const searchInputRef = useRef(null);
  const intl = useIntl();

  useEffect(() => {
    const clickOutside = (e) => {
      if (selectRef.current && !selectRef.current.contains(e.target)) {
        setIsOpen(false);
        setSearchTerm(""); // Yopilganda qidiruvni tozalash
      }
    };
    document.addEventListener("mousedown", clickOutside);
    return () => document.removeEventListener("mousedown", clickOutside);
  }, []);

  // Dropdown ochilganda inputga fokus berish
  useEffect(() => {
    if (isOpen && isSearchable && searchInputRef.current) {
      setTimeout(() => searchInputRef.current?.focus(), 100);
    }
  }, [isOpen, isSearchable]);

  // Optionlarni qidiruvga ko'ra filterlash (Optimallashgan)
  const filteredOptions = useMemo(() => {
    if (!searchTerm) return options;
    const lowerSearch = searchTerm.toLowerCase();
    return options.filter((opt) => {
      const labelText = isLabel ? intl.formatMessage({ id: opt.label }) : opt.label;
      return labelText.toLowerCase().includes(lowerSearch);
    });
  }, [searchTerm, options, isLabel, intl]);

  // Tanlangan variant(lar)ni aniqlash
  const selected = useMemo(() => {
    if (isMulti) {
      return options.filter((opt) => Array.isArray(value) && value.includes(opt.value));
    }
    return options.find((opt) => opt.value === value);
  }, [value, options, isMulti]);

  const handleSelect = (optionValue) => {
    if (isMulti) {
      const newValue = Array.isArray(value) ? [...value] : [];
      if (newValue.includes(optionValue)) {
        onChange(newValue.filter((v) => v !== optionValue));
      } else {
        onChange([...newValue, optionValue]);
      }
      // Multi-selectda dropdown yopilmaydi, qidiruv tozalanadi
      setSearchTerm("");
    } else {
      onChange(optionValue);
      setIsOpen(false);
      setSearchTerm("");
    }
  };

  const removeOption = (e, optionValue) => {
    e.stopPropagation();
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
        <div className="flex flex-wrap gap-2 overflow-hidden items-center">
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
              <span className="text-slate-400 text-sm">{intl.formatMessage({ id: placeholder })}</span>
            )
          ) : (
            <span className="text-[15px] font-medium text-heading">
              {selected
                ? isLabel ? intl.formatMessage({ id: selected.label }) : selected.label
                : intl.formatMessage({ id: placeholder })}
            </span>
          )}
        </div>

        <ChevronDown size={14} className={`text-slate-400 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
      </div>

      {isOpen && (
        <div className="absolute top-[105%] left-0 w-full bg-white border border-gray-100 rounded-2xl shadow-2xl z-[70] overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">

          {/* Search Input Qismi */}
          {isSearchable && (
            <div className="p-3 border-b border-gray-50 bg-gray-50/30">
              <div className="relative">
                <SearchIcon size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onClick={(e) => e.stopPropagation()} // Inputga bosganda dropdown yopilmasligi uchun
                  placeholder={intl.formatMessage({ id: "Qidirish..." })}
                  className="w-full pl-9 pr-4 py-2 bg-white border border-gray-100 rounded-xl text-sm font-bold focus:border-primary/30 outline-none transition-all"
                />
              </div>
            </div>
          )}

          {/* Options Ro'yxati */}
          <div className="max-h-[120px] overflow-y-auto custom-scrollbar">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((opt) => {
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
                    {isSelected && (
                      <div className="w-2 h-2 bg-primary rounded-full animate-in zoom-in" />
                    )}
                  </div>
                );
              })
            ) : (
              <div className="px-5 py-8 text-center">
                <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">{intl.formatMessage({ id: "Natija topilmadi" })}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {error && <p className="text-xs text-danger font-bold px-1">{error}</p>}
    </div>
  );
};

export default Select;