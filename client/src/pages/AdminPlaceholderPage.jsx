import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import Container from "../components/Container";
import Button from "../components/Button";
import { useAdminRefreshMutation, useAdminLogoutMutation } from "../features/auth/adminAuthApi";
import { setAdminCredentials, clearAdminCredentials } from "../features/auth/adminAuthSlice";

// Temporary verification page only - proves the admin auth flow works
// end-to-end on the frontend (login, session persistence via silent
// refresh, logout). The real admin dashboard is built in Phase 12;
// this page and its route are replaced entirely then.
function AdminPlaceholderPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, accessToken } = useSelector((state) => state.adminAuth);
  const [checking, setChecking] = useState(!accessToken);
  const [adminRefresh] = useAdminRefreshMutation();
  const [adminLogout] = useAdminLogoutMutation();

  useEffect(() => {
    if (accessToken) {
      setChecking(false);
      return;
    }
    (async () => {
      try {
        const result = await adminRefresh().unwrap();
        dispatch(setAdminCredentials({ user: result.user, accessToken: result.accessToken }));
      } catch {
        navigate("/admin/login");
      } finally {
        setChecking(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLogout = async () => {
    await adminLogout();
    dispatch(clearAdminCredentials());
    navigate("/admin/login");
  };

  if (checking) {
    return (
      <Container className="py-8">
        <p className="text-neutral-500">Checking admin session...</p>
      </Container>
    );
  }

  return (
    <Container className="py-8 flex flex-col gap-4">
      <h1 className="text-2xl font-bold text-black">
        Admin area (temporary verification page)
      </h1>
      <p className="text-neutral-800">
        Logged in as: {user?.name} ({user?.email})
      </p>
      <Button variant="secondary" onClick={handleLogout} className="w-fit">
        Log out
      </Button>
      <p className="text-sm text-neutral-500">
        This confirms Phase 7&apos;s admin auth flow works end-to-end. The real
        admin dashboard is built in Phase 12.
      </p>
    </Container>
  );
}

export default AdminPlaceholderPage;