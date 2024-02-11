import express from "express";
import { userIsUserMiddleware } from "../middlewares/userIsUser";
import {
  getUsersBucketListActivities,
  getUsersCreatedActivities,
  getUsersDoneActivities,
} from "../services/activity/activity.service";
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

// TOKEn for user testing account:
// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NWM3OGUwOTNiNjhjYTI0ZDJlNWQwOWEiLCJpYXQiOjE3MDc1NzY4NDEsImV4cCI6MTcwNzY2MzI0MX0.wLA4pkMQ8Lts2lnamjTv6M9OAyy-lYJQIGiCE7-BsDA
