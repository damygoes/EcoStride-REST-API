import express from "express";
import { CustomRequest } from "../interfaces/customRequest";
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
activityRouter.post("/", isAuthenticated, (req, res) => {
  const customReq = req as CustomRequest;
  createActivity(customReq, res);
});
activityRouter.patch("/:slug", isAuthenticated, (req, res) => {
  const customReq = req as CustomRequest;
  updateActivity(customReq, res);
});
activityRouter.delete("/:slug", isAuthenticated, (req, res) => {
  const customReq = req as CustomRequest;
  deleteActivity(customReq, res);
});
activityRouter.post("/:slug", isAuthenticated, (req, res) => {
  const customReq = req as CustomRequest;
  handleUserActionOnActivity(customReq, res);
});
activityRouter.get("/:slug/likes", getActivityLikes);

// Mount the commentRouter for paths that involve comments on activities
activityRouter.use("/:slug/comments", commentRouter);

export default activityRouter;
