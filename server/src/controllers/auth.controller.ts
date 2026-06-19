import bcrypt from "bcryptjs";
import { Request, Response } from "express";
import User from "../models/User.model";
import generateToken from "../utils/generateToken";

export const registerUser = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { name, email, password } = req.body;

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400).json({ message: "User already Exists!" });
    return;
  } else {
    const hashedPassword = await bcrypt.hash(password, 10);
    const userDetails = { name: name, email: email, password: hashedPassword };
    const user = await User.create(userDetails);
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

  const userExists = await User.findOne({ email });

  if (!userExists) {
    res.status(400).json({ message: "Invalid Email!" });
  } else {
    const validPassword = await bcrypt.compare(password, userExists.password);

    if (validPassword) {
      const token = generateToken(userExists.id);

      res.status(200).json({
        _id: userExists.id,
        name: userExists.name,
        email: userExists.email,
        token: token,
      });
    } else {
      res.status(400).json({ message: "Invalid Credentials!" });
    }
  }
};
