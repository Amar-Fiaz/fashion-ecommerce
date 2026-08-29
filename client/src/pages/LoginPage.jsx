import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Container from "../components/Container";
import Input from "../components/Input";
import Button from "../components/Button";
import { useLoginUserMutation } from "../features/auth/authApi";

const loginSchema = z.object({
  email: z.string().trim().email("Enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

function LoginPage() {
  const [loginUser, { isLoading }] = useLoginUserMutation();
  const [serverError, setServerError] = useState(null);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (data) => {
    setServerError(null);
    try {
      await loginUser(data).unwrap();
      navigate("/");
    } catch (err) {
      setServerError(err?.data?.message || "Login failed. Please try again.");
    }
  };

  return (
    <Container className="py-12 max-w-md mx-auto">
      <h1 className="text-2xl font-bold text-black mb-6">Log in</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
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
          {isLoading ? "Logging in..." : "Log in"}
        </Button>
      </form>
      <div className="flex flex-col gap-1 mt-4 text-sm text-neutral-500">
        <Link to="/forgot-password" className="underline w-fit">
          Forgot password?
        </Link>
        <p>
          Don&apos;t have an account?{" "}
          <Link to="/register" className="text-black underline">
            Create one
          </Link>
        </p>
      </div>
    </Container>
  );
}

export default LoginPage;