import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import { useAdminRefreshMutation } from "../features/auth/adminAuthApi";
import { setAdminCredentials, clearAdminCredentials } from "../features/auth/adminAuthSlice";

// Mirrors the customer ProtectedRoute's pattern, adapted for the
// admin session. There is no global AdminAuthInitializer equivalent
// to AuthInitializer, so the silent-refresh attempt happens here,
// once, the first time a protected admin route is visited (e.g.
// after a page reload) - consolidating what AdminPlaceholderPage
// previously did inline.
function AdminProtectedRoute() {
  const dispatch = useDispatch();
  const { accessToken } = useSelector((state) => state.adminAuth);
  const [checked, setChecked] = useState(Boolean(accessToken));
  const [adminRefresh] = useAdminRefreshMutation();

  useEffect(() => {
    if (accessToken) {
      setChecked(true);
      return;
    }
    (async () => {
      try {
        const result = await adminRefresh().unwrap();
        dispatch(setAdminCredentials({ user: result.user, accessToken: result.accessToken }));
      } catch {
        dispatch(clearAdminCredentials());
      } finally {
        setChecked(true);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!checked) {
    return null;
  }

  if (!accessToken) {
    return <Navigate to="/admin/login" replace />;
  }

  return <Outlet />;
}

export default AdminProtectedRoute;