import axiosInstance from "../utils/axiosInstance";

export const registerUser = async (formData) => {
  return await axiosInstance.post("/auth/register", formData);
};

export const loginUser = async (formData) => {
  return await axiosInstance.post("/auth/login", formData);
};

export const authenticateUser = async (token) => {
  console.log("Token being sent:", token);
  return await axiosInstance.get("/auth/user", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const resendEmailVerifyLink = async (token) => {
  return await axiosInstance.post(
    "/auth/resend-verification",
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

export const verifyEmailAccount = async (userId, verificationToken, Token) => {
  return await axiosInstance.patch(
    `/auth/verify-account/${userId}/${verificationToken}`,
    {},
    {
      headers: {
        Authorization: `Bearer ${Token}`,
      },
    }
  );
};

export const sendForgotPasswordMail = async (formData) => {
  return await axiosInstance.post("/auth/forgot-password", formData);
};

export const resetPassword = async (userId, passwordToken, formData) => {
  return await axiosInstance.patch(
    `/auth/reset-password/${userId}/${passwordToken}`,
    formData
  );
};

export const logout = async () => {
  return await axiosInstance.post("/auth/logout", {});
};
