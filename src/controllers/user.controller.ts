import express from "express";
import { CustomRequest } from "../interfaces/customRequest";
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
userRouter.patch("/:id", isAuthenticated, (req, res) => {
  const customReq = req as CustomRequest;
  updateUserById(customReq, res);
});
userRouter.delete("/:id", isAuthenticated, (req, res) => {
  const customReq = req as CustomRequest;
  deleteUserById(customReq, res);
});

// User Activity

userRouter.get("/:id/bucket-list", isAuthenticated, (req, res) => {
  const customReq = req as CustomRequest;
  getUsersBucketListActivities(customReq, res);
});
userRouter.get("/:id/my-activities", isAuthenticated, (req, res) => {
  const customReq = req as CustomRequest;
  getUsersCreatedActivities(customReq, res);
});
userRouter.delete("/:id/bucket-list/:slug", isAuthenticated, (req, res) => {
  const customReq = req as CustomRequest;
  deleteUserBucketListActivity(customReq, res);
});

userRouter.get("/:id/done-activities", isAuthenticated, (req, res) => {
  const customReq = req as CustomRequest;
  getUsersDoneActivities(customReq, res);
});

userRouter.delete("/:id/done-activities/:slug", isAuthenticated, (req, res) => {
  const customReq = req as CustomRequest;
  deleteUserDoneActivity(customReq, res);
});

userRouter.get("/:id/liked-activities", isAuthenticated, (req, res) => {
  const customReq = req as CustomRequest;
  getUsersLikedActivities(customReq, res);
});

userRouter.delete(
  "/:id/liked-activities/:slug",
  isAuthenticated,
  (req, res) => {
    const customReq = req as CustomRequest;
    deleteUserLikedActivity(customReq, res);
  }
);

export default userRouter;
