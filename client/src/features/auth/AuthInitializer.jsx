import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useRefreshUserMutation } from "./authApi";
import { setCredentials, clearCredentials, setAuthChecked } from "./authSlice";

// Attempts a silent refresh on app load using the httpOnly
// refreshToken cookie, so a returning user with a valid session isn't
// logged out just because the page was reloaded (the in-memory access
// token is intentionally lost on refresh - see ARCHITECTURE.md
// Section 5). Runs once, globally, since the customer header reflects
// auth state on every page. Admin auth is refreshed separately, only
// when an admin route is visited - see AdminPlaceholderPage.
function AuthInitializer({ children }) {
  const dispatch = useDispatch();
  const [refreshUser] = useRefreshUserMutation();

  useEffect(() => {
    async function attemptRefresh() {
      try {
        const result = await refreshUser().unwrap();
        dispatch(setCredentials({ user: result.user, accessToken: result.accessToken }));
      } catch {
        dispatch(clearCredentials());
      } finally {
        dispatch(setAuthChecked());
      }
    }
    attemptRefresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return children;
}

export default AuthInitializer;