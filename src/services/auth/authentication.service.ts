import dotenv from "dotenv";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import { UserModel } from "../../models/User";
import { verifyGoogleToken } from "../../utils/verifyGoogleToken";
import { getUserByEmail } from "../user/user.service";
dotenv.config();

export const authenticateUser = async (req: Request, res: Response) => {
  try {
    const { token } = req.body;
    const userDetails = await verifyGoogleToken(token);
    let user = await getUserByEmail(userDetails.email);
    if (!user) {
      user = new UserModel({
        ...userDetails,
        id: uuidv4(),
        role: "USER",
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      await user.save();
    }

    const newToken = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET_KEY, // JWT_SECRET in the .env is for signing the token to ensure it's not tampered with.
      {
        expiresIn: "24h",
      }
    );

    // Transform the user object for the response
    const responseUser = {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      avatar: user.avatar,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    const responseObject = {
      token: newToken,
      user: responseUser,
    };
    return res.status(200).json(responseObject);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
