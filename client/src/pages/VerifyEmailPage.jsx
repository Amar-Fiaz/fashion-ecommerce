import { useParams, Link } from "react-router-dom";
import Container from "../components/Container";
import { useVerifyEmailQuery } from "../features/auth/authApi";

function VerifyEmailPage() {
  const { token } = useParams();
  const { isLoading, isSuccess, isError, error } = useVerifyEmailQuery(token);

  return (
    <Container className="py-12 max-w-md mx-auto text-center flex flex-col gap-3">
      {isLoading && <p className="text-neutral-500">Verifying your email...</p>}
      {isSuccess && (
        <>
          <p className="text-sm text-success">Your email has been verified.</p>
          <Link to="/login" className="text-sm text-black underline w-fit mx-auto">
            Log in
          </Link>
        </>
      )}
      {isError && (
        <p className="text-sm text-error">
          {error?.data?.message || "This verification link is invalid or has expired."}
        </p>
      )}
    </Container>
  );
}

export default VerifyEmailPage;