import Header from "../components/navigation/Header";
import Footer from "../components/Footer";

// Global layout shell. Header and Footer are now the real Phase 3
// components, replacing the empty Phase 1 placeholders.
function BaseLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}

export default BaseLayout;