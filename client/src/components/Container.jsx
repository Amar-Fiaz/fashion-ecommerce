// Foundational layout container. Centers content and applies
// consistent horizontal padding/max-width across breakpoints, so
// every page built in later phases uses the same content boundary
// instead of each page inventing its own.

function Container({ children, className = "" }) {
  return (
    <div className={`w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 ${className}`}>
      {children}
    </div>
  );
}

export default Container;