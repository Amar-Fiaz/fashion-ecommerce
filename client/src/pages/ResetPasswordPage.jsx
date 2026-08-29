import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Container from "../components/Container";
import Input from "../components/Input";
import Button from "../components/Button";
import { useResetPasswordMutation } from "../features/auth/authApi";

const schema = z.object({
  password: z.string().min(8, "Password must be at least 8 characters"),
});

function ResetPasswordPage() {
  const { token } = useParams();
  const [resetPassword, { isLoading }] = useResetPasswordMutation();
  const [status, setStatus] = useState("idle");
  const [serverError, setServerError] = useState(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(schema) });

  const onSubmit = async (data) => {
    setServerError(null);
    try {
      await resetPassword({ token, password: data.password }).unwrap();
      setStatus("success");
    } catch (err) {
      setServerError(err?.data?.message || "This reset link is invalid or has expired.");
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <Container className="py-12 max-w-md mx-auto text-center flex flex-col gap-3">
        <p className="text-sm text-success">Password reset successfully.</p>
        <Link to="/login" className="text-sm text-black underline w-fit mx-auto">
          Log in
        </Link>
      </Container>
    );
  }

  return (
    <Container className="py-12 max-w-md mx-auto">
      <h1 className="text-2xl font-bold text-black mb-6">Reset password</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
        <Input
          id="password"
          label="New password"
          type="password"
          error={errors.password?.message}
          {...register("password")}
        />
        {serverError && <p className="text-sm text-error">{serverError}</p>}
        <Button type="submit" variant="primary" disabled={isLoading}>
          {isLoading ? "Resetting..." : "Reset password"}
        </Button>
      </form>
    </Container>
  );
}

export default ResetPasswordPage;