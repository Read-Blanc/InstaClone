import logo from "../../assets/logo.png";
import { Link, useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import MetaArgs from "../../components/MetaArgs";
import { validatePassword } from "../../utils/formValidate";
import { useParams } from "react-router";
import { useState } from "react";
import { resetPassword } from "../../api/auth";

export default function ResetPassword() {
  const [isVisible, setIsVisible] = useState(false);
  const { userId, passwordToken } = useParams();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const navigate = useNavigate(); // Use navigate hook to handle routing

  const togglePassword = () => {
    setIsVisible((prev) => !prev);
  };

  const onFormSubmit = async (data) => {
    if (data.newPassword !== data.confirmPassword) {
      toast.error("New passwords do not match", { id: "reset" });
      return;
    }
    try {
      const res = await resetPassword(userId, passwordToken, data);
      if (res.status === 200) {
        toast.success(res.data.message, { id: "reset" });
        navigate("/auth/login");
      }
    } catch (error) {
      handleError(error);
    }
  };
  // Handle form submission

  return (
    <>
      <MetaArgs
        title="Reset your InstaShot password"
        content="Reset password page"
      />

      <div className="w-[90%] md:w-[350px] border rounded-md border-[#A1A1A1] py-[20px] px-[28px]">
        <div className="flex justify-center mb-10">
          <Link to="/">
            <img src={logo} className="text-center" />
          </Link>
        </div>
        <div className="text-center mt-4 mb-4 text-xl">
          <h1 className="text-[#8D0D76] font-bold">Reset Password</h1>
          <p className="text-base mt-5 text-justify">
            Enter your Email to recover your account
          </p>
        </div>
        <form
          onSubmit={handleSubmit(onFormSubmit)}
          className="md:max-w-[400px] mx-auto"
        >
          <div className="mb-4 relative">
            <label className="floating-label">
              <span> New Password</span>
              <input
                type={isVisible ? "text" : "password"} // Toggle password visibility
                placeholder="New Password"
                className="input input-lg w-full"
                id="newpassword"
                {...register("newPassword", {
                  validate: (value) =>
                    validatePassword(value, "New Password is required"),
                })}
              />
            </label>
            <button
              className="absolute inset-y-0 right-2 text-sm cursor-pointer"
              onClick={togglePassword}
              type="button"
            >
              {isVisible ? "Hide" : "Show"}
            </button>
            <div>
              {errors.newPassword && (
                <span className="text-red-500 text-xs">
                  {errors.newPassword.message}
                </span>
              )}
            </div>
          </div>
          <div className="mb-4 relative">
            <label className="floating-label">
              <span>Confirm Password</span>
              <input
                type={isVisible ? "text" : "password"} // Toggle password visibility
                placeholder="Confirm Password"
                className="input input-lg w-full"
                id="confirmpassword"
                {...register("confirmPassword", {
                  validate: (value) =>
                    validatePassword(value, "Confirm Password is required"),
                })}
              />
            </label>
            <button
              className="absolute inset-y-0 right-2 text-sm cursor-pointer"
              onClick={togglePassword}
              type="button"
            >
              {isVisible ? "Hide" : "Show"}
            </button>
            <div>
              {errors.confirmPassword && (
                <span className="text-red-500 text-xs">
                  {errors.confirmPassword.message}
                </span>
              )}
            </div>
          </div>

          <div className="md:max-w-[400px] mx-auto">
            <button
              className="text-white mt-5 py-2 bg-[#8D0D76] rounded-[7px] border w-full md:max-w-[330px] h-[50px] text-center mb-2"
              type="submit"
              disabled={isSubmitting}
            >
              Reset Password
            </button>
          </div>
        </form>
        <div className="text-center mt-4 mb-4 text-base">
          <p className="text-base mt-5 text-justify">
            Already have an account?{" "}
            <Link to="/auth/login" className="text-[#8D0D76] font-semibold">
              Login
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}
