import { Request, Response } from "express";
import { CustomRequest } from "../../interfaces/customRequest";
import { UserModel } from "../../models/User";

export const getUsers = async (req: Request, res: Response): Promise<void> => {
  const { role } = req.query;
  // Construct a query object based on provided query parameters
  let queryObject: { [key: string]: any } = {};
  if (role) queryObject["role"] = role.toString().toUpperCase();

  const projection = {
    profile: 0,
  };

  try {
    const users = await UserModel.find(queryObject, projection);
    res.json(users);
  } catch (error) {
    const message = (error as Error).message;
    res.status(500).json({ error: message });
  }
};

export const getUserById = async (
  req: Request,
  res: Response
): Promise<Response<any, Record<string, any>> | undefined> => {
  const { id } = req.params;

  try {
    const user = await UserModel.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    const errorName = (error as Error).name;
    if (errorName === "CastError") {
      return res.status(400).json({ message: "Invalid user ID format" });
    }
    const message = (error as Error).message;
    res.status(500).json({ error: message });
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

export const getCurrentUser = async (
  req: Request,
  res: Response
): Promise<Response<any, Record<string, any>> | undefined> => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    // Assuming req.user contains the necessary user information
    // Adjust the response as needed based on your user model
    res.json({ user: req.user });
  } catch (error) {
    const message = (error as Error).message;
    res.status(500).json({ error: message });
  }
};

export const updateUserById = async (
  req: CustomRequest,
  res: Response
): Promise<Response<any, Record<string, any>> | undefined> => {
  const id = req.params.id;
  const userUpdateData = req.body;
  const userIdFromSession = req.user?._id.toString(); // Ensure this matches the type in your session

  // Check if the session user matches the requested ID
  if (userIdFromSession !== id) {
    return res
      .status(403)
      .json({ message: "You can only update your own record" });
  }

  try {
    const currentUser = await UserModel.findById(id);
    if (!currentUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Directly merge top-level fields from userUpdateData to currentUser
    Object.assign(currentUser, userUpdateData);

    // If there's profile data to update, merge it with existing profile data
    if (userUpdateData.profile) {
      currentUser.profile = {
        ...currentUser.profile,
        ...userUpdateData.profile,
      };
    }

    // Save the changes
    const updatedUser = await currentUser.save();

    res.json(updatedUser);
  } catch (error) {
    console.error("Update user error:", error);
    const message = (error as Error).message;
    res.status(500).json({ error: message });
  }
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
    const errorName = (error as Error).name;
    const errorMessage = (error as Error).message;
    if (errorName === "MongoServerError") {
      res.status(409).json({ error: "Email already exists" });
    } else if (errorName === "ValidationError") {
      res.status(400).json({ error: errorMessage });
    } else {
      res.status(500).json({ error: "Internal server error" });
    }
  }
};

export const deleteUserById = async (
  req: CustomRequest,
  res: Response
): Promise<Response<any, Record<string, any>> | undefined> => {
  const { id } = req.params;
  const userIdFromSession = req.user?._id.toString();

  if (userIdFromSession !== id) {
    return res
      .status(403)
      .json({ message: "You can only delete your own record" });
  }

  try {
    const deletedUser = await UserModel.findByIdAndDelete(id);
    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(204).send(); // No content to send back
  } catch (error) {
    const message = (error as Error).message;
    res.status(500).json({ error: message });
  }
};
