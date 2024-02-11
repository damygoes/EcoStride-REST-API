import express from "express";
import { userIsUserMiddleware } from "../middlewares/userIsUser";
import {
  createActivity,
  deleteActivity,
  getActivities,
  getActivity,
  seedDatabaseWithMultipleActivities,
  updateActivity,
} from "../services/activity/activity.service";

const activityRouter = express.Router();

// Activity
activityRouter.get("/", getActivities);
activityRouter.get("/:slug", getActivity);
activityRouter.post("/", userIsUserMiddleware, createActivity);
activityRouter.patch("/:slug", userIsUserMiddleware, updateActivity);
activityRouter.delete("/:slug", userIsUserMiddleware, deleteActivity);

// Database Seeding
activityRouter.post(
  "/seed",
  userIsUserMiddleware,
  seedDatabaseWithMultipleActivities
);

export default activityRouter;
