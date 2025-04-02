import User from "../model/user.js";
import createHttpError from "http-errors";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { generateAccessToken } from "../config/generateToken.js";
import { sendMail } from "../config/emailServices.js";

export const registerUser = async (req, res, next) => {
  const { username, email, fullname, password } = req.body; // Get info from client via form
  try {
    if (!username || !email || !fullname || !password) {
      return next(createHttpError(400, "All Fields are required"));
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

    // Create user
    const user = await User.create({
      username,
      email,
      fullname,
      password: hashedPassword,
    });

    // Generate verification token
    const verifyAccountToken = crypto.randomBytes(20).toString("hex");
    user.verificationToken = verifyAccountToken;
    user.verificationTokenExpires = Date.now() + 24 * 60 * 60 * 1000;
    await user.save();

    // Specify the verify account link
    const verifyAccountLink = `${process.env.CLIENT_URL}/account/verify-account/${user._id}/${user.verificationToken}`;

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
    });

    // Generate access token
    const accessToken = generateAccessToken(user._id, user._role);

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


