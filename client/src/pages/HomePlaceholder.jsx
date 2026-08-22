import { useGetHealthQuery } from "../api/apiSlice";
import Container from "../components/Container";
import Button from "../components/Button";
import Input from "../components/Input";

// Placeholder page - still Phase 1/2 verification only. Real homepage
// content (Phase 4) will replace this entirely.
function HomePlaceholder() {
  const { data, error, isLoading } = useGetHealthQuery();

  return (
    <Container className="py-8 flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-black">
        Fashion E-Commerce Platform
      </h1>
      <p className="text-base text-neutral-800">
        Phase 1 foundation is running.
      </p>

      <section>
        <h2 className="text-lg font-semibold text-black mb-2">
          Backend connection status
        </h2>
        {isLoading && <p className="text-neutral-500">Checking backend connection...</p>}
        {error && (
          <p className="text-error">
            Could not reach the backend. Confirm the server is running and
            VITE_API_BASE_URL is set correctly.
          </p>
        )}
        {data && <p className="text-success">{data.message}</p>}
      </section>

      <section className="flex flex-col gap-4 max-w-sm">
        <h2 className="text-lg font-semibold text-black">
          Design system check (temporary — Phase 2 verification only)
        </h2>
        <div className="flex gap-3 flex-wrap">
          <Button variant="primary">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="destructive">Destructive</Button>
          <Button variant="primary" disabled>
            Disabled
          </Button>
        </div>
        <Input id="demo-input" label="Sample input" placeholder="Type here" />
        <Input
          id="demo-input-error"
          label="Sample input with error"
          placeholder="Type here"
          error="This field is required"
        />
      </section>
    </Container>
  );
}

export default HomePlaceholder;