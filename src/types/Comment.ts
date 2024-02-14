import mongoose from "mongoose";

export type Comment = {
  id: string; // Transformed from _id
  activitySlug: string;
  userId: CommentUser | string; // Depending on population
  text: string;
  parentId?: mongoose.Types.ObjectId; // Optional, exists for replies
  createdAt: Date;
  updatedAt: Date;
  replies?: Comment[]; // Optional, for nesting replies
};

export type CommentUser = {
  id: string;
  firstName: string;
  lastName: string;
  avatar: string;
};

export const TransformedCommentUser = (user: any): CommentUser => ({
  id: user._id.toString(),
  firstName: user.firstName,
  lastName: user.lastName,
  avatar: user.avatar,
});
