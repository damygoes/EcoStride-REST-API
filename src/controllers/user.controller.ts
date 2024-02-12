import express from "express";
import { userIsUserMiddleware } from "../middlewares/userIsUser";
import {
  getUsersBucketListActivities,
  getUsersCreatedActivities,
  getUsersDoneActivities,
} from "../services/activity/activity.service";
import {
  createUserProfile,
  deleteUserById,
  deleteUserProfile,
  getUserById,
  getUserProfile,
  getUsers,
  updateUserById,
  updateUserProfile,
} from "../services/user/user.service";

const userRouter = express.Router();

// User
userRouter.get("/", getUsers);
userRouter.get("/:id", getUserById);
userRouter.patch("/:id", userIsUserMiddleware, updateUserById);
userRouter.delete("/:id", userIsUserMiddleware, deleteUserById);

// User Profile
userRouter.get("/:id/profile", userIsUserMiddleware, getUserProfile);
userRouter.post("/:id/profile", userIsUserMiddleware, createUserProfile);
userRouter.patch("/:id/profile", userIsUserMiddleware, updateUserProfile);
userRouter.delete("/:id/profile", userIsUserMiddleware, deleteUserProfile);

// User Activity
userRouter.get(
  "/:id/my-activities",
  userIsUserMiddleware,
  getUsersCreatedActivities
);
userRouter.get(
  "/:id/my-bucket-list",
  userIsUserMiddleware,
  getUsersBucketListActivities
);
userRouter.get(
  "/:id/done-activities",
  userIsUserMiddleware,
  getUsersDoneActivities
);

export default userRouter;
