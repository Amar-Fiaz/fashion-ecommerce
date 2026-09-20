import { useAdminDashboardOverviewQuery } from "../../features/admin/adminApi";

const CARDS = [
  { key: "productCount", label: "Products" },
  { key: "orderCount", label: "Total Orders" },
  { key: "pendingOrderCount", label: "Pending Orders" },
  { key: "customerCount", label: "Customers" },
];

function AdminDashboardPage() {
  const { data, isLoading, error } = useAdminDashboardOverviewQuery();
  const overview = data?.overview;

  return (
    <div>
      <h1 className="text-2xl font-bold text-black mb-6">Dashboard</h1>

      {isLoading && <p className="text-neutral-500">Loading...</p>}
      {error && <p className="text-error">Could not load dashboard data.</p>}

      {overview && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {CARDS.map((card) => (
            <div key={card.key} className="border border-neutral-200 rounded-md p-4 bg-white">
              <p className="text-sm text-neutral-500">{card.label}</p>
              <p className="text-2xl font-bold text-black mt-1">{overview[card.key]}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AdminDashboardPage;