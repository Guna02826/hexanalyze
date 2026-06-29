import bcrypt from "bcryptjs";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { AuthRequest } from "../middleware/auth.middleware.js";
import User from "../models/User.model.js";
import { generateAccessToken, generateRefreshToken } from "../utils/generateToken.js";

const setRefreshTokenCookie = (res: Response, refreshToken: string) => {
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
};

export const registerUser = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { name, email, password } = req.body;

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    res.status(400).json({ message: "User already Exists!" });
    return;
  } else {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUserPayload = { name: name, email: email, password: hashedPassword };
    const user = await User.create(newUserPayload);
    
    const accessToken = generateAccessToken(user.id);
    const refreshToken = generateRefreshToken(user.id);
    
    setRefreshTokenCookie(res, refreshToken);

    res.status(201).json({
      _id: user._id,
      name: name,
      email: email,
      token: accessToken,
    });
  }
};

export const loginUser = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  const existingUser = await User.findOne({ email });

  if (!existingUser) {
    res.status(400).json({ message: "Invalid Email!" });
  } else {
    const isPasswordValid = await bcrypt.compare(password, existingUser.password);

    if (isPasswordValid) {
      const accessToken = generateAccessToken(existingUser.id);
      const refreshToken = generateRefreshToken(existingUser.id);
      
      setRefreshTokenCookie(res, refreshToken);

      res.status(200).json({
        _id: existingUser.id,
        name: existingUser.name,
        email: existingUser.email,
        token: accessToken,
      });
    } else {
      res.status(400).json({ message: "Invalid Credentials!" });
    }
  }
};

export const loginDemoUser = async (req: AuthRequest, res: Response) => {
  req.body.email = "demo@aijobanalyzer.com";
  req.body.password = "demoPassword123";

  return loginUser(req, res);
};



export const refreshAccessToken = async (req: Request, res: Response): Promise<void> => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    res.status(401).json({ message: "No refresh token provided" });
    return;
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET as string) as { id: string };
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      res.status(401).json({ message: "Invalid refresh token" });
      return;
    }

    const accessToken = generateAccessToken(user.id);
    res.status(200).json({ token: accessToken });
  } catch {
    res.status(401).json({ message: "Invalid or expired refresh token" });
  }
};

export const logoutUser = async (req: Request, res: Response): Promise<void> => {
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });
  res.status(200).json({ message: "Logged out successfully" });
};
