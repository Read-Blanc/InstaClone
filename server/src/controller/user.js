import User from "../model/user.js";
import createHttpError from "http-errors";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { generateAccessToken } from "../config/generateToken.js";
import { sendMail } from "../config/emailServices.js";

export const registerUser = async (req, res, next) => {
  const { username, email, fullname, password } = req.body; // Get info from client via form
  try {
    // Ensure fields are not empty
    if (
      !username.trim() ||
      !email.trim() ||
      !fullname.trim() ||
      !password.trim()
    ) {
      return next(createHttpError(400, "All fields are required"));
    }

    // Check if user already exists in DB
    const [existingUsername, existingEmail] = await Promise.all([
      User.findOne({ username }),
      User.findOne({ email }),
    ]);

    if (existingUsername) {
      return next(createHttpError(409, "Username already exists"));
    }
    if (existingEmail) {
      return next(createHttpError(409, "Email already exists"));
    }

    // Encrypt the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      username,
      email,
      fullname,
      password: hashedPassword,
    });
    console.log(user._id);

    // Generate verification token
    const verifyAccountToken = crypto.randomBytes(20).toString("hex");
    user.verificationToken = verifyAccountToken;
    user.verificationTokenExpires = Date.now() + 24 * 60 * 60 * 1000;
    await user.save();

    // Specify the verify account link
    const verifyAccountLink = `${process.env.CLIENT_URL}/verify-email/${user._id}/${user.verificationToken}`;

    // Send verification email
    await sendMail({
      fullname: user.fullname,
      intro: [
        "Welcome to Instashots",
        "We are very excited to have you onboard",
      ],
      instructions: `To access our platform, please verify your email using this link: ${verifyAccountLink}. The link will expire after 24 hours.`,
      btnText: "Verify",
      subject: "Email Verification",
      to: user.email,
      link: verifyAccountLink,
    });
    // Generate access token
    const accessToken = generateAccessToken(user._id, user.role);
    // Send a response to the client
    res.status(201).json({
      success: true,
      message: "Account created successfully",
      accessToken,
    });
  } catch (error) {
    next(error);
  }
};

export const loginUser = async (req, res, next) => {
  const { username, password } = req.body;
  try {
    if (!username || !password) {
      return next(createHttpError(400, "Username and password are required"));
    }

    // Find user - password is hidden by default, using select method brings it back
    const user = await User.findOne({ username: username }).select("+password");
    if (!user) {
      return next(createHttpError(404, "Account not found"));
    }

    // Handle password check
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return next(createHttpError(401, "Invalid credentials"));
    }

    // If all checks out, generate and send access token
    const accessToken = generateAccessToken(user._id, user.role);
    res.status(200).json({
      success: true,
      message: "Login successful",
      accessToken, // Return the access token
    });
  } catch (error) {
    next(error);
  }
};

export const authenticateUser = async (req, res, next) => {
  const { id: userId } = req.user;
  try {
    const user = await User.findById(userId).select("-password -__v");
    if (!user) {
      return next(createHttpError(404, "User not found"));
    }
    res.status(200).json({
      success: true,
      message: "User authenticated successfully",
      user,
    });
  } catch (error) {
    next(error);
  }
};

export const resendEmailVerificationLink = async (req, res, next) => {
  const { id: userId } = req.user;
  try {
    const user = await User.findById(userId);

    const verifyAccountToken = crypto.randomBytes(20).toString("hex");
    user.verificationToken = verifyAccountToken;
    user.verificationTokenExpires = Date.now() + 24 * 60 * 60 * 1000;
    await user.save();

    const verifyAccountLink = `${process.env.CLIENT_URL}/verify-email/${user._id}/${user.verificationToken}`;

    try {
      await sendMail({
        fullname: user.fullname,
        intro: [
          "Welcome to Instashots",
          "We are very excited to have you onboard",
        ],
        instructions: `To access our platform, please verify your email using this link: ${verifyAccountLink}. The link will expire after 24 hours.`,
        btnText: "Verify",
        subject: "Email Verification",
        to: user.email,
        link: verifyAccountLink,
      });
    } catch (emailError) {
      return next(createHttpError(500, "Failed to send verification email"));
    }

    const accessToken = generateAccessToken(user._id, user.role);
    res.status(200).json({
      success: true,
      message: "Verification email resent successfully",
      accessToken,
    });
  } catch (error) {
    next(error);
  }
};

export const verifyEmail = async (req, res, next) => {
  const { userId, verificationToken } = req.params;
  try {
    if (!userId || !verificationToken) {
      return next(
        createHttpError(400, "UserId or VerificationToken not provided")
      );
    }
    // Find user
    const user = await User.findOne({
      _id: userId,
      verificationToken: verificationToken,
    }).select("+verificationToken +verificationTokenExpires");
    // Check if user exists
    if (!user) {
      return next(createHttpError(404, "User account not found"));
    }

    // Check if token is expired
    if (user.verificationTokenExpires < Date.now()) {
      user.verificationToken = null;
      user.verificationTokenExpires = null;
      await user.save();
      return next(
        createHttpError(
          410,
          "Verification token has expired, please request a new one"
        )
      );
    } else {
      // Token is valid, verify the account
      user.isVerified = true; // Assuming you have an `isVerified` field to track verification status
      user.verificationToken = null;
      user.verificationTokenExpires = null;
      await user.save();
    }
    res.status(200).json({
      success: true,
      message: "Email verified successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const sendForgotPasswordmail = async (req, res, next) => {
  const { email } = req.body;
  try {
    if (!email) {
      return next(createHttpError(400, "Email not provided"));
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return next(createHttpError(404, "User account not found"));
    }

    // Generate password reset token
    const resetToken = crypto.randomBytes(20).toString("hex");
    user.passwordResetToken = resetToken;
    user.passwordResetTokenExpires = Date.now() + 30 * 60 * 1000; // Token expires in 24 hours
    await user.save();
    // Specify the password reset link
    const resetPasswordLink = `${process.env.CLIENT_URL}/auth/reset-password/${user._id}/${resetToken}`;
    // Send password reset email
    await sendMail({
      fullname: user.fullname,
      intro: [
        "We received a requested a password reset for your account.",
        "If you did not request this, please ignore this email.",
      ],
      instructions: `Click here to reset your password: ${resetPasswordLink}. The link will expire after 30 minutes.`,
      btnText: "Reset Password",
      subject: "Password Reset",
      to: user.email,
    });

    res.status(200).json({
      success: true,
      message: "Password reset link sent successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const resetPassword = async (req, res, next) => {
  const { newPassword, confirmPassword } = req.body;
  const { userId, passwordToken } = req.params;
  try {
    if (!newPassword || !confirmPassword) {
      return next(
        createHttpError(400, "New password and confirm password are required")
      );
    }
    // Find user by userId and passwordToken
    const user = await User.findOne({
      _id: userId,
      passwordResetToken: passwordToken,
    }).select("+passwordResetToken +passwordResetTokenExpires +password");
    // Check if user exists
    if (!user) {
      return next(createHttpError(404, "User account not found"));
    }

    // Check if token is expired
    if (user.passwordResetTokenExpires < Date.now()) {
      user.passwordResetToken = null;
      user.passwordResetTokenExpires = null;
      await user.save();
      return next(
        createHttpError(
          410,
          "Password reset token has expired, please request a new one"
        )
      );
    }
    // Check if new password and confirm password match
    if (newPassword !== confirmPassword) {
      return next(createHttpError(400, "Passwords do not match"));
    }
    // Encrypt the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    user.password = hashedPassword;
    user.passwordResetToken = null; // Clear the password reset token
    user.passwordResetTokenExpires = null; // Clear the password reset token expiration
    await user.save();

    res.status(200).json({
      success: true,
      message: "Password reset successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res, next) => {
  res.status(200).json({ message: "Logged out successfully" });
};
