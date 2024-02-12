import { Request, Response } from "express";
import { CustomRequest } from "../../interfaces/customRequest";
import { UserModel } from "../../models/User";
import { userProfileValidationSchema } from "../../validations/userProfileValidator";

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
  const userIdFromToken = req.user?.userId;

  if (userIdFromToken !== id) {
    return res
      .status(403)
      .json({ message: "You can only delete your own record" });
  }

  try {
    const deletedUser = await UserModel.findByIdAndDelete(id);
    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(deletedUser);
  } catch (error) {
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
    let updateObject = { ...userUpdateData };
    // Explicitly prevent updating certain fields if necessary
    delete updateObject.id; // Prevent changing the ID
    delete updateObject.authenticated; // Prevent direct updates to authentication details
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

// User Profile
export const getUserProfile = async (req: CustomRequest, res: Response) => {
  const userIdFromToken = req.user?.userId;
  const userId = req.params.id;

  if (!userIdFromToken) {
    res.status(403).json({ message: "User ID not found in token" });
    return;
  }

  if (userIdFromToken !== userId) {
    return res
      .status(403)
      .json({ message: "You are not authorized to view this profile" });
  }

  try {
    const user = await UserModel.findById(userId, "profile");
    if (!user.profile || user.profile === undefined) {
      return res.status(404).json({ message: "Profile is empty" });
    }

    res.json(user.profile);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createUserProfile = async (req: CustomRequest, res: Response) => {
  const userIdFromToken = req.user?.userId;
  const userId = req.params.id;
  const profileData = req.body;

  if (!userIdFromToken) {
    return res.status(403).json({ message: "Authentication required" });
  }

  if (userIdFromToken !== userId) {
    return res.status(403).json({
      message: "You are not authorized to create a profile for this User",
    });
  }

  // Validate the profile data
  const validationResult = userProfileValidationSchema.validate(profileData);
  if (validationResult.error) {
    return res.status(400).json({ error: validationResult.error.message });
  }

  try {
    const user = await UserModel.findById(userIdFromToken);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update or set the profile data
    user.profile = validationResult.value;
    const updatedUser = await user.save();

    res.status(201).json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateUserProfile = async (req: CustomRequest, res: Response) => {
  const id = req.params.id;
  const userIdFromToken = req.user?.userId;
  const profileUpdateData = req.body;

  const validationResult =
    userProfileValidationSchema.validate(profileUpdateData);
  if (validationResult.error) {
    return res.status(400).json({ error: validationResult.error.message });
  }

  // Check for a valid user ID in the token
  if (!userIdFromToken) {
    return res.status(403).json({ message: "User ID not found in token" });
  }

  // Ensure the user can only update their own profile
  if (id !== userIdFromToken) {
    return res
      .status(403)
      .json({ message: "You can only update your own profile" });
  }

  try {
    // Constructing dynamic $set object for updating only provided fields
    const updateObject = Object.keys(validationResult.value).reduce(
      (acc: { [key: string]: any }, key) => {
        acc[`profile.${key}`] = validationResult.value[key];
        return acc;
      },
      {}
    );

    const updatedUserProfile = await UserModel.findByIdAndUpdate(
      userIdFromToken,
      { $set: updateObject },
      { new: true }
    );

    if (!updatedUserProfile) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(updatedUserProfile);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteUserProfile = async (req: CustomRequest, res: Response) => {
  const userIdFromToken = req.user?.userId;
  const userId = req.params.id;

  if (!userIdFromToken) {
    return res.status(403).json({ message: "Authentication required" });
  }

  if (userIdFromToken !== userId) {
    return res.status(403).json({
      message: "You are not authorized to delete this profile",
    });
  }

  if (!userIdFromToken) {
    return res.status(403).json({ message: "Authentication required" });
  }

  try {
    const user = await UserModel.findById(userIdFromToken);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Remove the profile data
    user.profile = undefined;
    await user.save();

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NWM5ZjVmMWIzOTdmN2EyODI2OTM3NTQiLCJpYXQiOjE3MDc3MzQ1MTMsImV4cCI6MTcwNzgyMDkxM30.E9L31AGCQN-qBUdT_IyzvotWLE01yWwfIPOQAEyfxpM
