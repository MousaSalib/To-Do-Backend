import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export interface AuthRequest extends Request {
  userId?: string;
  userRole?: string;
}

export const protect = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Not authorized, no token" });
    }

    const token = authHeader.split(" ")[1];
    const secret = process.env.JWT_SECRET as string;

    if (!secret)
      return res.status(500).json({ message: "Server config error" });

    const decoded = jwt.verify(token, secret) as {
      id?: string;
      role?: string;
      iat?: number;
      exp?: number;
    };
    if (!decoded?.id) return res.status(401).json({ message: "Invalid token" });

    req.userId = decoded.id;
    req.userRole = decoded.role;

    next();
  } catch (error) {
    return res.status(401).json({ message: "Not authorized", error });
  }
};
