import { CommentUser } from "./Comment";

export type Reply = {
  id: string;
  activitySlug: string;
  userId: CommentUser | string;
  parentId: string;
  text: string;
  createdAt: Date;
  updatedAt: Date;
};
