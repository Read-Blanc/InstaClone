import { useAuth } from "../../store";
import handleError from "../../utils/handleError";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { resendEmailVerifyLink } from "../../api/auth";

export default function SendVerifyMail() {
  const [isSubmitting, setIsSubmitting] = useState(false); // ✅ fixed
  const { user, accessToken, handleLogout } = useAuth();

  useEffect(() => {
    const logoutTimer = setTimeout(() => {
      handleLogout();
    }, 30 * 60 * 1000); // 30 minutes

    return () => clearTimeout(logoutTimer);
  }, [handleLogout]);

  const resendMail = async (e) => {
    e.preventDefault(); // ✅ in case used inside form
    setIsSubmitting(true);
    try {
      const res = await resendEmailVerifyLink(accessToken);
      if (res.status === 200) {
        toast.success(res.data.message);
      }
    } catch (error) {
      handleError(error);
      toast.error("An error occurred. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen flex-col text-center px-4">
      <h1 className="text-4xl font-bold">Hi, {user?.fullname}</h1>
      <p className="text-xl font-medium mt-2">
        You have yet to verify your email
      </p>
      <p className="mb-4">
        Please click the button below to send a new verification email
      </p>

      <button
        className="btn bg-[#8D0D76] w-[250px] text-white"
        disabled={isSubmitting}
        onClick={resendMail} // ✅ fixed
      >
        {isSubmitting ? (
          <span className="loading loading-spinner"></span>
        ) : (
          "Send a new verification email"
        )}
      </button>

      <p className="mt-4 text-sm max-w-md">
        If you have not received a verification email, please check your
        spam/junk folder. You will be automatically logged out in 30 minutes if
        you have not verified your email.
      </p>
    </div>
  );
}
