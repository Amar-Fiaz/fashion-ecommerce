import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Container from "../components/Container";
import Input from "../components/Input";
import Button from "../components/Button";
import { useAdminLoginMutation } from "../features/auth/adminAuthApi";

const schema = z.object({
  email: z.string().trim().email("Enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

// Structurally separate from the customer /login page: its own route,
// its own submission target (/api/admin/auth/login), and its own
// Redux slice (adminAuth) - per ARCHITECTURE.md Section 5.
function AdminLoginPage() {
  const [adminLogin, { isLoading }] = useAdminLoginMutation();
  const [serverError, setServerError] = useState(null);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(schema) });

  const onSubmit = async (data) => {
    setServerError(null);
    try {
      await adminLogin(data).unwrap();
      navigate("/admin");
    } catch (err) {
      setServerError(err?.data?.message || "Login failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50">
      <Container className="max-w-sm">
        <h1 className="text-2xl font-bold text-black mb-6 text-center">Admin Login</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
          <Input
            id="admin-email"
            label="Email"
            type="email"
            error={errors.email?.message}
            {...register("email")}
          />
          <Input
            id="admin-password"
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
      </Container>
    </div>
  );
}

export default AdminLoginPage;