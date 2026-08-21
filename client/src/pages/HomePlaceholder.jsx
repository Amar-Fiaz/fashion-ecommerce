import { useGetHealthQuery } from "../api/apiSlice";

// Placeholder page for Phase 1. Its only purpose is to prove the
// full foundation works end-to-end: Redux store -> RTK Query ->
// backend API -> rendered result. No real homepage content exists
// yet - that is built in Phase 4.
function HomePlaceholder() {
  const { data, error, isLoading } = useGetHealthQuery();

  return (
    <div>
      <h1>Fashion E-Commerce Platform</h1>
      <p>Phase 1 foundation is running.</p>

      <section>
        <h2>Backend connection status</h2>
        {isLoading && <p>Checking backend connection...</p>}
        {error && (
          <p>
            Could not reach the backend. Confirm the server is running and
            VITE_API_BASE_URL is set correctly.
          </p>
        )}
        {data && <p>{data.message}</p>}
      </section>
    </div>
  );
}

export default HomePlaceholder;