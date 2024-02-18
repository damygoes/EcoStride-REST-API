import express from "express";
import { isAuthenticated } from "../middlewares/isUserAuthenticated";
import {
  createComment,
  deleteComment,
  getComment,
  getComments,
  updateComment,
} from "../services/comment/comment.service";

const commentRouter = express.Router({ mergeParams: true }); // Important for accessing params from parent router

// :slug is accessible due to mergeParams: true
commentRouter.get("/", getComments); // Fetch all comments for a specific activity
commentRouter.get("/:id", getComment); // Fetch a specific comment for an activity
commentRouter.post("/", isAuthenticated, createComment); // Create a new comment for an activity
commentRouter.patch("/:id", isAuthenticated, updateComment); // Update an existing comment
commentRouter.delete("/:id", isAuthenticated, deleteComment); // Delete an existing comment

export default commentRouter;
