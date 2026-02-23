import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";

const register = asyncHandler(async (req, res) => {
  const { email, password, role } = req.body;

  if (!email || !password) {
    throw new ApiError(400, "Email and password required");
  }

  const existing = await User.findOne({ email });
  if (existing) {
    throw new ApiError(400, "User already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    email,
    password: hashedPassword,
    role: role || "analyst",
  });

  return res
    .status(201)
    .json(new ApiResponse(201, { id: user._id }, "User registered"));
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(401, "Invalid credentials");
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new ApiError(401, "Invalid credentials");
  }

  const token = jwt.sign(
    { userId: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );

  return res
    .status(200)
    .json(new ApiResponse(200, { token }, "Login successful"));
});

export { register, login };