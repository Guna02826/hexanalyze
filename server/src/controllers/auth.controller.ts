import bcrypt from "bcryptjs";
import { Request, Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware";
import User from "../models/User.model";
import generateToken from "../utils/generateToken";

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
    const token = generateToken(user.id);
    res.status(201).json({
      _id: user._id,
      name: name,
      email: email,
      token: token,
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
      const token = generateToken(existingUser.id);

      res.status(200).json({
        _id: existingUser.id,
        name: existingUser.name,
        email: existingUser.email,
        token: token,
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

export const getCurrentUser = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  const user = req.user;
  if (user) {
    res.status(200).json(user);
  } else {
    res.status(400).json({ message: "User not found!" });
  }
};
