import { Request, Response } from "express";
import { CustomRequest } from "../../interfaces/customRequest";
import { UserModel } from "../../models/User";

export const getUsers = async (
  req: CustomRequest,
  res: Response
): Promise<void> => {
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

export const getCurrentUser = async (
  req: Request,
  res: Response
): Promise<Response<any, Record<string, any>>> => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    // Assuming req.user contains the necessary user information
    // Adjust the response as needed based on your user model
    res.json({ user: req.user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateUserById = async (
  req: CustomRequest,
  res: Response
): Promise<Response<any, Record<string, any>>> => {
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
    res.status(500).json({ error: error.message });
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
    if (error.name === "MongoServerError" && error.code === 11000) {
      res.status(409).json({ error: "Email already exists" });
    } else if (error.name === "ValidationError") {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: "Internal server error" });
    }
  }
};

export const deleteUserById = async (
  req: CustomRequest,
  res: Response
): Promise<Response<any, Record<string, any>>> => {
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
    res.status(500).json({ error: error.message });
  }
};

// // User Profile
// export const getUserProfile = async (req: CustomRequest, res: Response) => {
//   const userIdFromToken = req.user?.userId;
//   const userId = req.params.id;

//   if (!userIdFromToken) {
//     res.status(403).json({ message: "User ID not found in token" });
//     return;
//   }

//   if (userIdFromToken !== userId) {
//     return res
//       .status(403)
//       .json({ message: "You are not authorized to view this profile" });
//   }

//   try {
//     const user = await UserModel.findById(userId, "profile");
//     if (!user.profile || user.profile === undefined) {
//       return res.status(404).json({ message: "Profile is empty" });
//     }

//     res.json(user.profile);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// export const createUserProfile = async (req: CustomRequest, res: Response) => {
//   const userIdFromToken = req.user?.userId;
//   const userId = req.params.id;
//   const profileData = req.body;

//   if (!userIdFromToken) {
//     return res.status(403).json({ message: "Authentication required" });
//   }

//   if (userIdFromToken !== userId) {
//     return res.status(403).json({
//       message: "You are not authorized to create a profile for this User",
//     });
//   }

//   // Validate the profile data
//   const validationResult = userProfileValidationSchema.validate(profileData);
//   if (validationResult.error) {
//     return res.status(400).json({ error: validationResult.error.message });
//   }

//   try {
//     const user = await UserModel.findById(userIdFromToken);
//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     // Update or set the profile data
//     user.profile = validationResult.value;
//     const updatedUser = await user.save();

//     res.status(201).json(updatedUser);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// export const deleteUserProfile = async (req: CustomRequest, res: Response) => {
//   const userIdFromToken = req.user?._id.toString();
//   const userId = req.params.id;

//   if (!userIdFromToken) {
//     return res.status(403).json({ message: "Authentication required" });
//   }

//   if (userIdFromToken !== userId) {
//     return res.status(403).json({
//       message: "You are not authorized to delete this profile",
//     });
//   }

//   if (!userIdFromToken) {
//     return res.status(403).json({ message: "Authentication required" });
//   }

//   try {
//     const user = await UserModel.findById(userIdFromToken);
//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     // Remove the profile data
//     user.profile = undefined;
//     await user.save();

//     res.status(204).send();
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };
