import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { useAuth } from "../../store";
import handleError from "../../utils/handleError";
import { verifyEmailAccount } from "../../api/auth";
import MetaArgs from "../../components/MetaArgs";
import { DataSpinner } from "../../components/Spinner";
import { toast } from "sonner";

export default function VerifyAccount() {
  const [isLoading, setIsLoading] = useState();
  const [isSuccess, setIsSuccess] = useState(false); // ✅ fixed
  const { accessToken } = useAuth();
  console.log("Access Token:", accessToken); // ✅ added log for accessToken
  const { userId, verificationToken } = useParams();
  console.log("User ID:", userId); // ✅ added log for userId
  console.log("Verification Token:", verificationToken); // ✅ added log for verificationToken

  const navigate = useNavigate(); // ✅ lowercase

  useEffect(() => {
    let isMounted = true;
    const verify = async () => {
      try {
        const res = await verifyEmailAccount(
          userId,
          verificationToken,
          accessToken
        );

        if (isMounted && res.status === 200) {
          setIsSuccess(true);
          setIsSuccess(res.data.success);
          toast.success(res.data.message);
          setTimeout(() => {
            window.location.href = "/"; // Redirect to login page
          }, 2000); // Redirect after 2 seconds
        }
      } catch (error) {
        if (isMounted) {
          handleError(error);
        }
      }
    };
    verify();
    return () => {
      isMounted = false; // Cleanup function to prevent state updates on unmounted component
    };
  }, [accessToken, userId, verificationToken]);

  if (isLoading) {
    return <DataSpinner />;
  }

  return (
    <>
      <MetaArgs
        title="Verify your email account"
        content="Verify your email account"
      />

      <div className="flex justify-center flex-col items-center min-h-screen gap-4 px-4 text-center">
        {isSuccess ? (
          <>
            <h1 className="text-2xl">
              You have successfully verified your account.
            </h1>
            {/* <button
              className="btn bg-[#8D0D76] w-[250px] text-white"
              onClick={() => navigate("/")}
            >
              Go back
            </button> */}
            <p className="text-gray-600">Redirecting you to the homepage...</p>
          </>
        ) : (
          <>
            <h1 className="text-4xl font-bold mb-4">
              There was a problem verifying your account
            </h1>
            <button
              className="btn bg-[#8D0D76] w-[250px] text-white"
              onClick={() => navigate("/verify-email")}
            >
              Try Again
            </button>
          </>
        )}
      </div>
    </>
  );
}
