import crypto from "crypto";
import jwt from "jsonwebtoken";

export const random = () => crypto.randomBytes(128).toString("base64");

export const generateJWTForUser = (user: any) => {
  // Explicitly specify the type of 'user'
  const userPayload = {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    avatar: user.avatar,
  };
  return jwt.sign(userPayload, process.env.JWT_SECRET, { expiresIn: "12h" });
};
