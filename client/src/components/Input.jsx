// Foundational reusable Input component. Styled entirely from design
// tokens. Supports a default, focus, error, and disabled state, per
// docs/DESIGN_SYSTEM.md "Input Variants".
//
// Kept generic and unopinionated about validation - form logic
// (React Hook Form + Zod) is wired up by whichever feature uses this,
// starting in a later phase. This component only handles appearance.

function Input({
  id,
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  error,
  disabled = false,
  className = "",
}) {
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
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        className={`px-3 py-2 rounded-sm border bg-white text-base text-neutral-800 outline-none transition-colors focus:shadow-sm disabled:bg-neutral-50 disabled:text-neutral-500 disabled:pointer-events-none ${borderClasses} ${className}`}
      />
      {error && <p className="text-sm text-error">{error}</p>}
    </div>
  );
}

export default Input;