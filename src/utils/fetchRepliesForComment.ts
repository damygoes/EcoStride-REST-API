import { ReplyModel } from "../models/Reply";
import { TransformedCommentUser } from "../types/Comment";
import { Reply } from "../types/Reply";

export const fetchRepliesForComment = async (
  commentId: string
): Promise<Reply[]> => {
  const replies = await ReplyModel.find({ parentId: commentId })
    .populate("userId", "firstName lastName avatar")
    .lean();

  return replies.map((reply) => ({
    id: reply._id.toString(),
    userId: TransformedCommentUser(reply.userId),
    text: reply.text as string, // Cast to string if necessary
    createdAt: new Date(reply.createdAt), // Ensure conversion to Date
    updatedAt: new Date(reply.updatedAt), // Ensure conversion to Date
    activitySlug: reply.activitySlug as string, // Cast to string if necessary
    parentId: reply.parentId?.toString(),
  }));
};
