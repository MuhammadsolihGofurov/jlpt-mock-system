const Button = ({ children, isLoading, ...props }) => (
  <button
    {...props}
    disabled={isLoading}
    className="w-full bg-primary text-white rounded-xl py-3 font-semibold hover:bg-primary-dark transition-colors disabled:bg-gray-400"
  >
    {isLoading ? "Yuklanmoqda..." : children}
  </button>
);

export default Button;
