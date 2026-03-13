import { useState, useEffect, useRef } from "react";
import { MoreVertical } from "lucide-react";

const ActionDropdown = ({ children, trigger }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target))
        setIsOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <div onClick={() => setIsOpen(!isOpen)}>
        {trigger ? trigger : (
          <button className="p-2 hover:bg-gray-100 rounded-xl transition-colors text-muted active:scale-90">
            <MoreVertical size={20} />
          </button>
        )}
      </div>

      {isOpen && (
        <div 
          onClick={() => setIsOpen(false)} 
          className="absolute right-0 mt-2 w-52 bg-white/95 backdrop-blur-xl border border-gray-100 rounded-[1.5rem] shadow-2xl z-[100] overflow-hidden animate-in fade-in zoom-in slide-in-from-top-2 duration-200"
        >
          <div className="py-2">
            {children}
          </div>
        </div>
      )}
    </div>
  );
};

export const DropdownItem = ({ onClick, icon: Icon, label, variant = "default" }) => {
  const variants = {
    default: "text-heading hover:bg-orange-50 hover:text-primary",
    danger: "text-danger hover:bg-red-50 hover:text-red-600",
    blue: "text-heading hover:bg-blue-50 hover:text-blue-600",
  };

  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-bold transition-all duration-200 ${variants[variant]}`}
    >
      {Icon && <Icon size={18} />}
      {label}
    </button>
  );
};

export default ActionDropdown;