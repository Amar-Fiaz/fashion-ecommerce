import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Container from "../Container";
import Input from "../Input";
import Button from "../Button";

// Newsletter signup UI. Client-side validation only (React Hook Form
// + Zod) - there is no backend endpoint yet (NewsletterSubscriber
// model and API are a later phase), so submission is simulated
// locally rather than sent anywhere.

const newsletterSchema = z.object({
  email: z.string().email("Enter a valid email address"),
});

function NewsletterSignup() {
  const [submitted, setSubmitted] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({ resolver: zodResolver(newsletterSchema) });

  const onSubmit = () => {
    // No backend call yet - this only proves the form/validation
    // pipeline works end-to-end. Real submission wiring happens once
    // the NewsletterSubscriber API exists.
    setSubmitted(true);
    reset();
  };

  return (
    <section className="bg-neutral-50 border-t border-neutral-200">
      <Container className="py-10 flex flex-col items-center text-center gap-4">
        <h2 className="text-xl font-semibold text-black">Stay in the loop</h2>
        <p className="text-sm text-neutral-500 max-w-sm">
          Sign up for new arrivals, exclusive offers, and style updates.
        </p>

        {submitted ? (
          <p className="text-sm text-success">Thanks for subscribing.</p>
        ) : (
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col sm:flex-row gap-3 w-full max-w-sm"
            noValidate
          >
            <div className="flex-1">
              <Input
                id="newsletter-email"
                type="email"
                placeholder="Enter your email"
                error={errors.email?.message}
                {...register("email")}
              />
            </div>
            <Button type="submit" variant="primary">
              Subscribe
            </Button>
          </form>
        )}
      </Container>
    </section>
  );
}

export default NewsletterSignup;