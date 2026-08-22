import Container from "../Container";

// Static promotional banner. Non-functional/informational only -
// real banner management (admin-editable) is Phase 13 scope.

function PromoBanner() {
  return (
    <section className="bg-accent">
      <Container className="py-3 text-center">
        <p className="text-sm font-medium text-white">
          Free shipping on all orders over $75
        </p>
      </Container>
    </section>
  );
}

export default PromoBanner;