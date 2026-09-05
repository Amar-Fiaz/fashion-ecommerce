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
import AdminLoginPage from "../pages/AdminLoginPage";
import AdminPlaceholderPage from "../pages/AdminPlaceholderPage";

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
        </Route>
      </Route>

      <Route path="/admin/login" element={<AdminLoginPage />} />
      <Route path="/admin" element={<AdminPlaceholderPage />} />
    </Routes>
  );
}

export default AppRoutes;