import logo from "../../assets/logo.png";
import { Link } from "react-router";
import { useForm } from "react-hook-form";
import MetaArgs from "../../components/MetaArgs";
import { validateEmail } from "../../utils/formValidate";
import { toast } from "sonner";
import { sendForgotPasswordMail } from "../../api/auth";
import handleError from "../../utils/handleError";

export default function ForgotPassword() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const onFormSubmit = async (data) => {
    try {
      const res = await sendForgotPasswordMail(data);
      if (res.status === 200) {
        toast.success(res.data.message, { id: "forgot" });
      }
    } catch (error) {
      handleError(error);
    }
  };

  return (
    <>
      <MetaArgs
        title="Sign up to InstaShots"
        content="Get access to InstaShots"
      />
      <div className="w-[90%] md:w-[350px] border rounded-md border-[#A1A1A1] py-[20px] px-[28px]">
        <div className="flex justify-center mb-10">
          <Link to="/">
            <img src={logo} className="text-center" />
          </Link>
        </div>
        <div className="text-center mt-4 mb-4 text-xl">
          <h1 className="text-[#8D0D76] font-bold">Forgot Password</h1>
        </div>

        <form onSubmit={handleSubmit(onFormSubmit)}>
          <div className="md:max-w-[400px] mx-auto mt-10">
            <label className="floating-label">
              <span>Email</span>
              <input
                type="text"
                placeholder="Enter Email"
                className="input input-lg"
                id="email"
                {...register("email", {
                  validate: (value) => validateEmail(value),
                })}
              />
            </label>
            {errors.email && (
              <span className="text-red-500">{errors.email.message}</span>
            )}
          </div>

          <div className="md:max-w-[400px] mx-auto">
            {errors.password && (
              <span className="text-red-500">{errors.password.message}</span>
            )}

            <button
              className="text-white mt-5 py-2 bg-[#8D0D76] rounded-[7px] border w-full md:max-w-[330px] h-[50px] text-center mb-2"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span className="loading loading-spinner"></span>
              ) : (
                "Recover"
              )}
            </button>
          </div>
        </form>
      </div>

      <div>
        <button className="md:w-[350px] h-[80px] mt-5 py-4 text-white border border-[#A1A1A1] rounded-[7px] w-full text-center mb-10">
          <span className="text-black">
            Already have an account?
            <Link to="/auth/login" className="text-[#8D0D76] font-bold">
              {" "}
              Log In
            </Link>
          </span>
          <br />
          <div className="mt-2 mb-2">
            <span className="text-black">
              New User?
              <Link to="/auth/register" className="text-[#8D0D76] font-bold">
                {" "}
                Sign Up
              </Link>
            </span>
          </div>
        </button>
      </div>
    </>
  );
}
