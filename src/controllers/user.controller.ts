import express from "express";
import { isAuthenticated } from "../middlewares/isUserAuthenticated";
import {
  deleteUserBucketListActivity,
  deleteUserDoneActivity,
  deleteUserLikedActivity,
  getUsersBucketListActivities,
  getUsersCreatedActivities,
  getUsersDoneActivities,
  getUsersLikedActivities,
} from "../services/activity/activity.service";
import {
  deleteUserById,
  getCurrentUser,
  getUserById,
  getUsers,
  updateUserById,
} from "../services/user/user.service";

const userRouter = express.Router();

// User
userRouter.get("/", getUsers);
userRouter.get("/current-user", isAuthenticated, getCurrentUser);
userRouter.get("/:id", getUserById);
userRouter.patch("/:id", isAuthenticated, updateUserById);
userRouter.delete("/:id", isAuthenticated, deleteUserById);

// User Activity

userRouter.get(
  "/:id/bucket-list",
  isAuthenticated,
  getUsersBucketListActivities
);
userRouter.get(
  "/:id/my-activities",
  isAuthenticated,
  getUsersCreatedActivities
);
userRouter.delete(
  "/:id/bucket-list/:slug",
  isAuthenticated,
  deleteUserBucketListActivity
);

userRouter.get("/:id/done-activities", isAuthenticated, getUsersDoneActivities);

userRouter.delete(
  "/:id/done-activities/:slug",
  isAuthenticated,
  deleteUserDoneActivity
);

userRouter.get(
  "/:id/liked-activities",
  isAuthenticated,
  getUsersLikedActivities
);

userRouter.delete(
  "/:id/liked-activities/:slug",
  isAuthenticated,
  deleteUserLikedActivity
);

export default userRouter;
