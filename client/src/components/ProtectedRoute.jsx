import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

// Redirects to /login if there's no authenticated customer session.
// Waits for `authChecked` (set once AuthInitializer's initial silent
// refresh attempt completes) before deciding, so a logged-in user
// isn't incorrectly redirected during the brief moment before their
// session is restored on page load.
function ProtectedRoute() {
  const { accessToken, authChecked } = useSelector((state) => state.auth);

  if (!authChecked) {
    return null; // brief moment while the initial silent refresh runs
  }

  if (!accessToken) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

export default ProtectedRoute;