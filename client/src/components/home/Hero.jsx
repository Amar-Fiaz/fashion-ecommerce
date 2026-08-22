import Container from "../Container";
import Button from "../Button";

// Full-width hero section with a CSS-only placeholder image block and
// layered text/CTA content. The CTA is a non-functional placeholder -
// it will link to the product catalog once that route exists
// (Phase 5).

function Hero() {
  return (
    <section className="relative w-full h-[420px] sm:h-[480px] lg:h-[560px] bg-neutral-200 flex items-center justify-center overflow-hidden">
      <span className="absolute text-sm text-neutral-500">
        Hero image placeholder
      </span>
      <div className="absolute inset-0 bg-black/30" />
      <Container className="relative z-10 text-center flex flex-col items-center gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-white">
          New Season, New Style
        </h1>
        <p className="text-base text-white max-w-md">
          Discover pieces designed to move with you — clean lines, premium
          fabrics, made to last.
        </p>
        <Button variant="primary">Shop the Collection</Button>
      </Container>
    </section>
  );
}

export default Hero;