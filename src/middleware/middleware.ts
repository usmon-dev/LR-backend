import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import "dotenv/config";

const secretKey: string = process.env.JWT_SECRET || "";

interface DecodedUser {
  uid: string;
  isAdmin?: boolean;
}

export const apiKeyMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const apiKey = req.header("X-API-Key");

  if (!apiKey || apiKey !== process.env.API_SECRET_KEY) {
    res.status(401).send("Forbidden");
  } else {
    next();
  }
};

export const verifyToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.header("Authorization");

  if (!token) {
    return res.status(401).json({ error: "No token provided user" });
  }

  try {
    const decoded = jwt.verify(token, secretKey) as DecodedUser;
    (req as any).uid = decoded.uid;
    next();
  } catch (error) {
    return res.status(401).json({ error: "Invalid token" });
  }
};

export const verifyAdminToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.header("Authorization");

  if (!token) {
    return res.status(401).json({ error: "No token provided admin" });
  }

  try {
    const decoded = jwt.verify(token, secretKey) as DecodedUser;
    if (!decoded.isAdmin) {
      return res
        .status(403)
        .json({ error: "Access denied. Admin privileges required." });
    }
    (req as any).uid = decoded.uid;
    next();
  } catch (error) {
    return res.status(401).json({ error: "Invalid token" });
  }
};
