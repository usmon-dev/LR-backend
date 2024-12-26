import { Request, Response } from "express";
import { db } from "../config";
import {
  collection,
  addDoc,
  getDocs,
  getDoc,
  doc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  arrayUnion,
} from "firebase/firestore";
import { verifyToken, verifyAdminToken } from "../middleware/middleware";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import "dotenv/config";
import { getFormattedDateAndTime } from "../utils/defaults";

const usersCollection = collection(db, "users");
const JWT_SECRET = process.env.JWT_SECRET || "";

interface User {
  name: string;
  surname: string;
  email: string;
  password: string;
  phoneNumber?: string;
  isAdmin: boolean;
  createdAt: string;
  isVerified: boolean;
}

interface LoginInput {
  email: string;
  password: string;
}

interface JwtPayload {
  uid: string;
  isAdmin: boolean;
}

// Register user
export const registerUser = async (req: Request, res: Response) => {
  try {
    const { name, surname, email, password, isAdmin, phoneNumber } =
      req.body as User;

    // Check if user already exists
    const userQuery = query(usersCollection, where("email", "==", email));
    const userDocs = await getDocs(userQuery);

    if (!userDocs.empty) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const newUser = await addDoc(usersCollection, {
      name,
      surname,
      email,
      password: hashedPassword,
      isAdmin: isAdmin || false,
      createdAt: getFormattedDateAndTime(),
      phoneNumber,
      isVerified: false,
    } as User);

    const token = jwt.sign(
      { uid: newUser.id, isAdmin: isAdmin || false } as JwtPayload,
      JWT_SECRET
    );

    res.status(201).json({ message: "User registered successfully", token });
  } catch (error) {
    res.status(500).json({ message: "Error registering user", error });
  }
};