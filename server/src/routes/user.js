import express from "express";
import {
  registerUser,
  loginUser,
  authenticateUser,
  resendEmailVerificationLink,
  verifyEmail,
  sendForgotPasswordmail,
  resetPassword,
  logout,
} from "../controller/user.js";
import { verifyToken, authorizeRoles } from "../middleware/auth.js";
import { rateLimiter } from "../middleware/RateLimiter.js";
import { clearCache, cacheMiddleware } from "../middleware/cache.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", rateLimiter, loginUser);
router.post(
  "/resend-verification",
  rateLimiter,
  verifyToken,
  authorizeRoles("user", "admin"),
  resendEmailVerificationLink
);
router.post("/forgot-password", sendForgotPasswordmail);
router.patch("/reset-password/:userId/:verificationToken", resetPassword);

router.get(
  "/user",
  verifyToken,
  authorizeRoles("user", "admin"),
  cacheMiddleware("auth_User", 600),
  authenticateUser
);

router.patch(
  "/verify-account/:userId/:verificationToken",
  verifyToken,
  (req, res, next) => {
    clearCache("auth_User", true);
    next();
  },
  authorizeRoles("user", "admin"),
  verifyEmail
);

router.post(
  "/logout",
  (req, res, next) => {
    clearCache(null, true);
    next();
  },
  logout
);
export default router;
