import { forwardRef } from "react";

const Input = forwardRef(function Input(
  { id, label, type = "text", placeholder, error, disabled = false, className = "", ...rest },
  ref
) {
  const borderClasses = error
    ? "border-error focus:border-error"
    : "border-neutral-200 focus:border-black";

  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-neutral-800">
          {label}
        </label>
      )}
      <input
        id={id}
        ref={ref}
        type={type}
        placeholder={placeholder}
        disabled={disabled}
        className={`px-3 py-2 rounded-sm border bg-white text-base text-neutral-800 outline-none transition-colors focus:shadow-sm disabled:bg-neutral-50 disabled:text-neutral-500 disabled:pointer-events-none ${borderClasses} ${className}`}
        {...rest}
      />
      {error && <p className="text-sm text-error">{error}</p>}
    </div>
  );
});

export default Input;