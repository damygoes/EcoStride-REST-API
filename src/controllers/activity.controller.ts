import express from "express";
import { isAuthenticated } from "../middlewares/isUserAuthenticated";
import {
  createActivity,
  deleteActivity,
  getActivities,
  getActivity,
  getActivityLikes,
  handleUserActionOnActivity,
  updateActivity,
} from "../services/activity/activity.service";
import commentRouter from "./comment.controller";

const activityRouter = express.Router();

// Activity
activityRouter.get("/", getActivities);
activityRouter.get("/:slug", getActivity);
activityRouter.post("/", isAuthenticated, createActivity);
activityRouter.patch("/:slug", isAuthenticated, updateActivity);
activityRouter.delete("/:slug", isAuthenticated, deleteActivity);
activityRouter.post("/:slug", isAuthenticated, handleUserActionOnActivity);
activityRouter.get("/:slug/likes", getActivityLikes);

// Mount the commentRouter for paths that involve comments on activities
activityRouter.use("/:slug/comments", commentRouter);

export default activityRouter;
