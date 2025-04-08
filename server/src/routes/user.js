import express from "express";
import { registerUser, loginUser,  authenticateUser , resendEmailVerificationLink, verifyEmail, sendForgotPasswordmail, resetPassword} from "../controller/user.js";
import { verifyToken, authorizeRoles } from "../middleware/auth.js";

const router = express.Router();

router.post("/register", registerUser); 
router.post("/login", loginUser);
router.post("/resend-verification", verifyToken, authorizeRoles("user", "admin"), resendEmailVerificationLink);
router.post("/forgot-password", sendForgotPasswordmail);
router.post("/reset-password/:userId/:verificationToken", verifyToken, authorizeRoles("user", "admin"), resetPassword);

// get
router.get("/user", verifyToken, authorizeRoles("user", "admin"), authenticateUser);

// router.patch("/user", verifyToken, authorizeRoles("user", "admin"));

router.patch("/verify-account/:userId/:verificationToken", verifyToken, authorizeRoles("admin"), verifyEmail );

export default router;
