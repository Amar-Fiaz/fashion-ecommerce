import { Routes, Route } from "react-router-dom";
import BaseLayout from "../layouts/BaseLayout";
import HomePage from "../pages/HomePage";

// Centralized route definitions. HomePage replaces the Phase 1-3
// placeholder now that real homepage content exists (Phase 4).
function AppRoutes() {
  return (
    <BaseLayout>
      <Routes>
        <Route path="/" element={<HomePage />} />
      </Routes>
    </BaseLayout>
  );
}

export default AppRoutes;