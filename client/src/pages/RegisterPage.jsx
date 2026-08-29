import { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Container from "../components/Container";
import Input from "../components/Input";
import Button from "../components/Button";
import { useRegisterUserMutation } from "../features/auth/authApi";

const registerSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  email: z.string().trim().email("Enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

function RegisterPage() {
  const [registerUser, { isLoading }] = useRegisterUserMutation();
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(registerSchema) });

  const onSubmit = async (data) => {
    setServerError(null);
    try {
      await registerUser(data).unwrap();
      setSubmitted(true);
    } catch (err) {
      setServerError(err?.data?.message || "Registration failed. Please try again.");
    }
  };

  if (submitted) {
    return (
      <Container className="py-12 max-w-md mx-auto text-center flex flex-col gap-3">
        <h1 className="text-xl font-semibold text-black">Check your email</h1>
        <p className="text-sm text-neutral-500">
          We sent a verification link to your email address. Please verify your
          account before logging in.
        </p>
      </Container>
    );
  }

  return (
    <Container className="py-12 max-w-md mx-auto">
      <h1 className="text-2xl font-bold text-black mb-6">Create an account</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
        <Input id="name" label="Name" error={errors.name?.message} {...register("name")} />
        <Input
          id="email"
          label="Email"
          type="email"
          error={errors.email?.message}
          {...register("email")}
        />
        <Input
          id="password"
          label="Password"
          type="password"
          error={errors.password?.message}
          {...register("password")}
        />
        {serverError && <p className="text-sm text-error">{serverError}</p>}
        <Button type="submit" variant="primary" disabled={isLoading}>
          {isLoading ? "Creating account..." : "Create account"}
        </Button>
      </form>
      <p className="text-sm text-neutral-500 mt-4">
        Already have an account?{" "}
        <Link to="/login" className="text-black underline">
          Log in
        </Link>
      </p>
    </Container>
  );
}

export default RegisterPage;