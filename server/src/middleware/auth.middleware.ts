import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import User, { IUser } from "../models/User.model.js";

export interface AuthRequest extends Request {
  user?: IUser;
}

export const requireAuth = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      const authToken = req.headers.authorization.split(" ")[1];
      const decodedToken = jwt.verify(authToken, process.env.JWT_SECRET as string);
      req.user = await User.findById((decodedToken as jwt.JwtPayload).id).select(
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
