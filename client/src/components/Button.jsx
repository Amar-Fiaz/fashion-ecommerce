// Foundational reusable Button component. All styling comes from the
// design tokens defined in tailwind.config.js / docs/DESIGN_SYSTEM.md -
// no hardcoded colors, spacing, or radius values outside those tokens.
//
// Variants: primary, secondary, ghost, destructive - per
// docs/DESIGN_SYSTEM.md "Button Variants".

const VARIANT_CLASSES = {
  primary: "bg-accent text-white hover:bg-accent-dark",
  secondary: "bg-transparent text-black border border-black hover:bg-neutral-50",
  ghost: "bg-transparent text-black hover:bg-neutral-50",
  destructive: "bg-error text-white hover:opacity-90",
};

function Button({
  children,
  variant = "primary",
  type = "button",
  disabled = false,
  onClick,
  className = "",
}) {
  const variantClasses = VARIANT_CLASSES[variant] || VARIANT_CLASSES.primary;

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`px-4 py-2 rounded-md text-sm font-medium transition-colors disabled:opacity-50 disabled:pointer-events-none ${variantClasses} ${className}`}
    >
      {children}
    </button>
  );
}

export default Button;