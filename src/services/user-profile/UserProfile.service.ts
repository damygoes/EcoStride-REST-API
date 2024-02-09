import { Request, Response } from "express";
import { UserProfileModel } from "../../models/UserProfile";

export const getUserProfile = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const userProfile = await UserProfileModel.findOne({ userId: id });
    if (!userProfile) {
      return res.status(404).json({ message: "User profile not found" });
    }
    res.json(userProfile);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createUserProfile = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { body } = req;
  const isProfileExist = await UserProfileModel.exists({ userId: id });
  if (isProfileExist) {
    return res.status(200).json({
      message:
        "User profile exists already, try updating instead of creating a new one",
    });
  }
  try {
    const userProfile = await UserProfileModel.create({
      userId: id,
      ...body,
    });
    res.status(201).json(userProfile);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateUserProfile = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { body } = req;
  try {
    const userProfile = await UserProfileModel.findOneAndUpdate(
      { userId: id },
      { ...body, updatedAt: new Date() },
      { new: true }
    );
    if (!userProfile) {
      return res.status(404).json({ message: "User profile not found" });
    }
    res.json(userProfile);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteUserProfile = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const userProfile = await UserProfileModel.findOneAndDelete({ userId: id });
    if (!userProfile) {
      return res.status(404).json({ message: "User profile not found" });
    }
    res.json(userProfile);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
