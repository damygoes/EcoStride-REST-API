import mongoose from "mongoose";

export interface CommentInterface {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId | any; // Use `any` or a more specific type if `userId` is populated
  activitySlug: string;
  text: string;
  parentId?: mongoose.Types.ObjectId;
  replies?: Comment[]; // This is added dynamically, so it might not be part of your mongoose schema
}
