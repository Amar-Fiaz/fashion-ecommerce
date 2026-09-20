import { Outlet, Link, useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useAdminLogoutMutation } from "../features/auth/adminAuthApi";
import { clearAdminCredentials } from "../features/auth/adminAuthSlice";

const NAV_ITEMS = [
  { to: "/admin", label: "Dashboard", end: true },
  { to: "/admin/products", label: "Products" },
  { to: "/admin/categories", label: "Categories" },
  { to: "/admin/orders", label: "Orders" },
  { to: "/admin/customers", label: "Customers" },
];

// Standalone admin layout - structurally separate from the customer
// BaseLayout (no shared header/nav/footer), per ARCHITECTURE.md
// Section 9. Replaces the temporary AdminPlaceholderPage from Phase 7.
function AdminLayout() {
  const { user } = useSelector((state) => state.adminAuth);
  const [adminLogout] = useAdminLogoutMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await adminLogout();
    dispatch(clearAdminCredentials());
    navigate("/admin/login");
  };

  return (
    <div className="min-h-screen flex flex-col bg-neutral-50">
      <header className="bg-white border-b border-neutral-200">
        <div className="flex items-center justify-between px-4 py-3">
          <div>
            <p className="text-lg font-bold text-black">FASHION CO</p>
            <p className="text-xs text-neutral-500">Admin</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-neutral-800 hidden sm:inline">{user?.name}</span>
            <button
              type="button"
              onClick={handleLogout}
              className="text-sm text-neutral-500 hover:text-black"
            >
              Log out
            </button>
          </div>
        </div>
        <nav className="flex overflow-x-auto border-t border-neutral-200">
          {NAV_ITEMS.map((item) => {
            const isActive = item.end
              ? location.pathname === item.to
              : location.pathname.startsWith(item.to);
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`px-4 py-2 text-sm whitespace-nowrap border-b-2 ${
                  isActive
                    ? "text-black font-medium border-accent"
                    : "text-neutral-500 border-transparent hover:text-black"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </header>

      <main className="flex-1 p-4 sm:p-6 overflow-x-hidden">
        <Outlet />
      </main>
    </div>
  );
}

export default AdminLayout;