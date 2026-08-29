import { Outlet } from "react-router-dom";
import Header from "../components/navigation/Header";
import Footer from "../components/Footer";

// Now uses React Router's Outlet pattern (nested routes) instead of a
// children prop, so AppRoutes.jsx can wrap only customer-facing
// routes in this layout while admin routes render without it.
function BaseLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default BaseLayout;