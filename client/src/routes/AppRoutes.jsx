import { Routes, Route } from "react-router-dom";
import BaseLayout from "../layouts/BaseLayout";
import HomePage from "../pages/HomePage";
import ProductListingPage from "../pages/ProductListingPage";

function AppRoutes() {
  return (
    <BaseLayout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/shop" element={<ProductListingPage />} />
      </Routes>
    </BaseLayout>
  );
}

export default AppRoutes;