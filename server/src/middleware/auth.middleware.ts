import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import User, { IUser } from "../models/User.model";

export interface AuthRequest extends Request {
  user?: IUser;
}

export const protect = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      const token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
      req.user = await User.findById((decoded as jwt.JwtPayload).id).select(
        "-password",
      );
      next();
    } catch (error) {
      console.error((error as Error).message);
      res.status(401).json({ message: "Not authorized, token failed" });
    }
  }
  if (
    !req.headers.authorization ||
    !req.headers.authorization.startsWith("Bearer")
  ) {
    res.status(401).json({ message: "Not authorized, no token" });
  }
};
