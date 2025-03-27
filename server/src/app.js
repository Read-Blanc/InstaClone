import User from "../model/user.js";
import createHttpError from "http-errors";
import bcrypt from "bcryptjs";

export const registerUser = async (req, res, next) => {
  const { username, email, fullname, password } = req.body; //get info from client via form
  try {
    if (!username || !email || !fullname || !password) {
      return next(createHttpError(400, "All Fields are required"));
    }
    //check if user already exists in db
    const [existingUsername, existingEmail] = await Promise.all([
      User.findOne({ username: username }),
      User.findOne({ email: email }),
    ]);
    if (existingUsername) {
      return next(createHttpError(409, "Username already exists"));
    }
    if (existingEmail) {
      return next(createHttpError(409, "Email already exists"));
    }
    // proceed to register user if user dont exists
    const salt = await bcrypt.genSalt(10); //encryption mechanism for to handle password
    const hashedPassword = await bcrypt.hash(password, salt); //encrypt the user password
    //proceed to create the user
    const user = await User.create({
      username,
      email,
      fullname,
      password: hashedPassword,
    });
  } catch (error) {}
};
