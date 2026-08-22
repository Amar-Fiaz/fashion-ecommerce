import Container from "./Container";

// Global site footer. Links to static pages (About, Contact, FAQ,
// policies) are placeholders - those pages don't exist yet, so links
// are non-navigating for now, per PHASES.md Phase 3 scope.
const footerLinks = [
  { name: "About", slug: "about" },
  { name: "Contact", slug: "contact" },
  { name: "FAQ", slug: "faq" },
  { name: "Shipping Policy", slug: "shipping-policy" },
  { name: "Return Policy", slug: "return-policy" },
  { name: "Privacy Policy", slug: "privacy-policy" },
  { name: "Terms and Conditions", slug: "terms-and-conditions" },
];

function Footer() {
  return (
    <footer className="border-t border-neutral-200 bg-neutral-50 mt-12">
      <Container className="py-8 flex flex-col gap-4">
        <ul className="flex flex-wrap gap-x-6 gap-y-2">
          {footerLinks.map((link) => (
            <li key={link.slug}>
              <span className="text-sm text-neutral-500 hover:text-black cursor-pointer transition-colors">
                {link.name}
              </span>
            </li>
          ))}
        </ul>
        <p className="text-xs text-neutral-500">
          © {new Date().getFullYear()} Fashion E-Commerce Platform. All rights reserved.
        </p>
      </Container>
    </footer>
  );
}

export default Footer;