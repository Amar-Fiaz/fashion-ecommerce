import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Container from "../components/Container";
import Input from "../components/Input";
import Button from "../components/Button";
import { useForgotPasswordMutation } from "../features/auth/authApi";

const schema = z.object({
  email: z.string().trim().email("Enter a valid email address"),
});

function ForgotPasswordPage() {
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();
  const [submitted, setSubmitted] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(schema) });

  const onSubmit = async (data) => {
    await forgotPassword(data);
    // Always shows the same generic success message regardless of
    // whether the email exists, matching the backend's intentional
    // non-enumeration behavior.
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <Container className="py-12 max-w-md mx-auto text-center">
        <p className="text-sm text-neutral-500">
          If an account with that email exists, a reset link has been sent.
        </p>
      </Container>
    );
  }

  return (
    <Container className="py-12 max-w-md mx-auto">
      <h1 className="text-2xl font-bold text-black mb-6">Forgot password</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
        <Input
          id="email"
          label="Email"
          type="email"
          error={errors.email?.message}
          {...register("email")}
        />
        <Button type="submit" variant="primary" disabled={isLoading}>
          {isLoading ? "Sending..." : "Send reset link"}
        </Button>
      </form>
    </Container>
  );
}

export default ForgotPasswordPage;