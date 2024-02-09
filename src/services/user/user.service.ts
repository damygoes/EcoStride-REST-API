import { Request, Response } from "express";
import mongoose from "mongoose";
import { UserModel } from "../../models/User";
import { UserProfileModel } from "../../models/UserProfile";

interface CustomRequest extends Request {
  user?: {
    userId: string;
    // Include other properties as needed
  };
}

export type User = {
  firstName: string;
  lastName: string;
  email: string;
  avatar: string;
  role: string;
  authenticated: {
    sessionToken: string;
  };
  createdAt?: Date;
  updatedAt?: Date;
};

export const getUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await UserModel.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getUserById = async (
  req: Request,
  res: Response
): Promise<Response<any, Record<string, any>>> => {
  const { id } = req.params;
  try {
    const user = await UserModel.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({ message: "Invalid user ID format" });
    }
    res.status(500).json({ error: error.message });
  }
};

export const getUserByEmail = async (email: string) => {
  if (!email) {
    throw new Error("Email is required");
  }
  return UserModel.findOne({
    email,
  });
};

export const getUserBySessionToken = async (sessionToken: string) => {
  return UserModel.findOne({
    "authenticated.sessionToken": sessionToken,
  });
};

export const createUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const user = new UserModel(req.body);
    const newUser = await user.save();
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteUserById = async (req: CustomRequest, res: Response) => {
  const { id } = req.params;
  const userIdFromToken = req.user?.userId;

  if (userIdFromToken !== id) {
    return res
      .status(403)
      .json({ message: "You can only delete your own record" });
  }

  // Start a session and transaction
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    // Delete operations within the transaction
    const deletedUser = await UserModel.findByIdAndDelete(id, {
      session,
    }).exec();
    if (!deletedUser) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: "User not found" }).end();
    }

    // Assuming the UserProfile uses the same user ID to link
    await UserProfileModel.deleteOne({ userId: id }, { session }).exec();

    // If you have other collections to delete, add them here using the same session

    // Commit the transaction
    await session.commitTransaction();
    session.endSession();

    res.status(204).send(); // No content to send back, just indicate success
  } catch (error) {
    // If an error occurs, abort the transaction and log the error
    await session.abortTransaction();
    session.endSession();
    res.status(500).json({ error: error.message });
  }
};

export const updateUserById = async (req: CustomRequest, res: Response) => {
  const id = req.params.id;
  const userIdFromToken = req.user?.userId;
  const userUpdateData = req.body;

  // Check if the user ID from the token matches the requested record's ID
  if (userIdFromToken !== id) {
    return res
      .status(403)
      .json({ message: "You can only update your own record" });
  }

  try {
    const updatedUser = await UserModel.findByIdAndUpdate(id, userUpdateData, {
      new: true,
    });

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
