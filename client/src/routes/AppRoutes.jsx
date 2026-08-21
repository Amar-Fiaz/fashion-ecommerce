import { Routes, Route } from "react-router-dom";
import BaseLayout from "../layouts/BaseLayout";
import HomePlaceholder from "../pages/HomePlaceholder";

// Centralized route definitions. Only one placeholder route exists
// in Phase 1. Later phases add routes here (including the lazy-loaded
// /admin route tree in Phase 12) rather than inventing a new pattern.
function AppRoutes() {
  return (
    <BaseLayout>
      <Routes>
        <Route path="/" element={<HomePlaceholder />} />
      </Routes>
    </BaseLayout>
  );
}

export default AppRoutes;