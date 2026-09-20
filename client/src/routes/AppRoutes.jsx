import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import BaseLayout from "../layouts/BaseLayout";
import ProtectedRoute from "../components/ProtectedRoute";
import HomePage from "../pages/HomePage";
import ProductListingPage from "../pages/ProductListingPage";
import ProductDetailPage from "../pages/ProductDetailPage";
import RegisterPage from "../pages/RegisterPage";
import LoginPage from "../pages/LoginPage";
import ForgotPasswordPage from "../pages/ForgotPasswordPage";
import ResetPasswordPage from "../pages/ResetPasswordPage";
import VerifyEmailPage from "../pages/VerifyEmailPage";
import ProfilePage from "../pages/ProfilePage";
import CartPage from "../pages/CartPage";
import WishlistPage from "../pages/WishlistPage";
import CheckoutPage from "../pages/CheckoutPage";
import MockGatewayPage from "../pages/MockGatewayPage";
import OrderConfirmationPage from "../pages/OrderConfirmationPage";
import OrderHistoryPage from "../pages/OrderHistoryPage";
import OrderDetailPage from "../pages/OrderDetailPage";
import NotificationsPage from "../pages/NotificationsPage";

// The entire admin panel is lazy-loaded, per ARCHITECTURE.md Section 9 -
// none of this code is downloaded by customer-only visitors. A single
// Suspense boundary wrapping the /admin route subtree covers every
// lazily-loaded component nested inside it (AdminLayout,
// AdminDashboardPage, etc.), since Suspense catches suspension
// anywhere in its rendered subtree, not just its direct child.
const AdminLoginPage = lazy(() => import("../pages/AdminLoginPage"));
const AdminProtectedRoute = lazy(() => import("../components/AdminProtectedRoute"));
const AdminLayout = lazy(() => import("../layouts/AdminLayout"));
const AdminDashboardPage = lazy(() => import("../pages/admin/AdminDashboardPage"));

function AdminFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center text-neutral-500">
      Loading admin panel...
    </div>
  );
}

function AppRoutes() {
  return (
    <Routes>
      <Route element={<BaseLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/shop" element={<ProductListingPage />} />
        <Route path="/shop/:slug" element={<ProductDetailPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
        <Route path="/verify-email/:token" element={<VerifyEmailPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/mock-gateway/:paymentId" element={<MockGatewayPage />} />
        <Route path="/order-confirmation/:id" element={<OrderConfirmationPage />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/wishlist" element={<WishlistPage />} />
          <Route path="/orders" element={<OrderHistoryPage />} />
          <Route path="/orders/:id" element={<OrderDetailPage />} />
          <Route path="/notifications" element={<NotificationsPage />} />
        </Route>
      </Route>

      <Route
        path="/admin/login"
        element={
          <Suspense fallback={<AdminFallback />}>
            <AdminLoginPage />
          </Suspense>
        }
      />

      <Route
        path="/admin"
        element={
          <Suspense fallback={<AdminFallback />}>
            <AdminProtectedRoute />
          </Suspense>
        }
      >
        <Route element={<AdminLayout />}>
          <Route index element={<AdminDashboardPage />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default AppRoutes;