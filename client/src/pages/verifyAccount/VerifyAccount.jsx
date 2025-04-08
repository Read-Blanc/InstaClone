import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { useAuth } from "../../store";
import { useNavigate } from "react-router";
import handleError from "../../utils/handleError";

export default function VerifyAccount() {
  const { accessToken } = useAuth();
  const { userId, verificationToken } = useParams();
  const { isSuccess, setIsSuccess } = useState(false);
  const Navigate = useNavigate();

  useEffect(() => {
    const verify = async () => {
      try {
        const res = await verifyAccount(userId, verificationToken, accessToken);
        if (res.status === 200) {
          setIsSuccess(true);
        }
      } catch (error) {
        handleError(error);
      }
    };
    verify();
  }, [accessToken, userId, verificationToken]);

  return (
    <div className="flex justify-center flex-col items-center min-h-screen gap-4">
      {isSuccess ? (
        <>
          <h1 className="text-2xl">
            You have successfully verified your account.
          </h1>
          <button className="btn bg-[#8D0D76] w-[250px] text-white">
            Go back
          </button>
        </>
      ) : (
        <>
          <h1 className="text-4xl font-bold">
            There was a problem verifying your account
          </h1>
          <button
            className="btn bg-[#8D0D76] w-[250px] text-white"
            onClick={() => Navigate("/verify-email")}
          ></button>
        </>
      )}
    </div>
  );
}
