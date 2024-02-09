import express from "express";
import { userIsUserMiddleware } from "../middlewares/userIsUser";
import {
  createUserProfile,
  deleteUserProfile,
  getUserProfile,
  updateUserProfile,
} from "../services/user-profile/UserProfile.service";
import {
  deleteUserById,
  getUserById,
  getUsers,
  updateUserById,
} from "../services/user/user.service";

const userRouter = express.Router();

// User
userRouter.get("/", getUsers);
userRouter.get("/:id", getUserById);
userRouter.patch("/:id", userIsUserMiddleware, updateUserById);
userRouter.delete("/:id", userIsUserMiddleware, deleteUserById);

// User Profile
userRouter.get("/:id/profile", getUserProfile);
userRouter.post("/:id/profile", createUserProfile);
userRouter.patch("/:id/profile", updateUserProfile);
userRouter.delete("/:id/profile", deleteUserProfile);

export default userRouter;
