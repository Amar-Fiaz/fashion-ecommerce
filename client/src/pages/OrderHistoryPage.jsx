import { Link } from "react-router-dom";
import Container from "../components/Container";
import { useGetMyOrdersQuery } from "../features/order/orderApi";

function OrderHistoryPage() {
  const { data, isLoading } = useGetMyOrdersQuery();
  const orders = data?.orders || [];

  return (
    <Container className="py-8">
      <h1 className="text-2xl font-bold text-black mb-6">My Orders</h1>

      {isLoading && <p className="text-neutral-500">Loading...</p>}

      {!isLoading && orders.length === 0 && (
        <div className="flex flex-col gap-3">
          <p className="text-neutral-500">You haven&apos;t placed any orders yet.</p>
          <Link to="/shop" className="text-sm text-black underline w-fit">
            Browse products
          </Link>
        </div>
      )}

      <div className="flex flex-col gap-3">
        {orders.map((order) => (
          <Link
            key={order._id}
            to={`/orders/${order._id}`}
            className="border border-neutral-200 rounded-md p-4 flex items-center justify-between hover:border-black transition-colors"
          >
            <div>
              <p className="text-sm font-medium text-black">{order.orderNumber}</p>
              <p className="text-xs text-neutral-500">
                {new Date(order.createdAt).toLocaleDateString()} · {order.items.length}{" "}
                {order.items.length === 1 ? "item" : "items"}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-black">${order.total}</p>
              <p className="text-xs text-neutral-500 capitalize">{order.status}</p>
            </div>
          </Link>
        ))}
      </div>
    </Container>
  );
}

export default OrderHistoryPage;