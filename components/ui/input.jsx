const Input = ({ label, register, name, error, ...props }) => (
  <div className="w-full">
    {label && <label className="block text-sm font-medium mb-1">{label}</label>}
    <input
      {...register(name)}
      {...props}
      className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-1 
        ${error ? "border-red-500 focus:ring-red-500" : "border-orange-200 focus:border-primary focus:ring-primary"}`}
    />
    {error && <p className="text-red-500 text-xs mt-1">{error.message}</p>}
  </div>
);

export default Input;
