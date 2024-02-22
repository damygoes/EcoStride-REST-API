import { Request, Response } from "express";
import mongoose from "mongoose";
import { CustomRequest } from "../../interfaces/customRequest";
import { CommentModel, TransformedCommentUser } from "../../models/Comment";
import { ReplyModel } from "../../models/Reply";
import { fetchRepliesForComment } from "../../utils/fetchRepliesForComment";

export const createComment = async (
  req: CustomRequest,
  res: Response
): Promise<Response<any, Record<string, any>> | undefined> => {
  const session = await mongoose.startSession(); // Start a new session for the transaction
  try {
    session.startTransaction(); // Start the transaction

    const userSessionId = req.user?._id;
    const { slug } = req.params;

    if (!userSessionId) {
      await session.abortTransaction(); // Abort the transaction
      session.endSession(); // End the session
      return res.status(403).json({ message: "Unauthorized" });
    }

    if (!slug) {
      await session.abortTransaction(); // Abort the transaction
      session.endSession(); // End the session
      return res.status(400).json({ message: "Activity slug is required" });
    }

    const isReply = !!req.body.parentId;
    if (isReply) {
      const parentComment = await CommentModel.findById(req.body.parentId)
        .session(session)
        .lean();
      if (!parentComment) {
        await session.abortTransaction(); // Abort the transaction
        session.endSession(); // End the session
        return res.status(404).json({ message: "Parent comment not found" });
      }

      const newReplyData = {
        ...req.body,
        activitySlug: slug,
        userId: userSessionId,
      };

      // Create the reply
      const newReply = await ReplyModel.create([newReplyData], {
        session: session,
      });

      // Update the parent comment to include this new reply's ID in its replies array
      await CommentModel.findByIdAndUpdate(
        req.body.parentId,
        { $push: { replies: newReply[0]._id } },
        { session: session }
      );

      await session.commitTransaction(); // Commit the transaction
      session.endSession(); // End the session
      res.status(201).json(newReply[0]);
    } else {
      // Logic to handle new comment creation
      const newComment = await CommentModel.create(
        [{ ...req.body, activitySlug: slug, userId: userSessionId }],
        { session: session }
      );
      await session.commitTransaction(); // Commit the transaction
      session.endSession(); // End the session
      res.status(201).json(newComment[0]);
    }
  } catch (error) {
    await session.abortTransaction(); // Abort the transaction in case of error
    session.endSession(); // Always end the session
    const message = (error as Error).message;
    res.status(500).json({ error: message });
  }
};

export const updateComment = async (
  req: CustomRequest,
  res: Response
): Promise<Response<any, Record<string, any>> | undefined> => {
  try {
    const userSessionId = req.user?._id;
    const { id } = req.params; // Comment ID from URL parameters

    if (!userSessionId) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    // Service method now needs to check if the user is authorized to update this comment
    const updatedComment = await CommentModel.findOneAndUpdate(
      { id: id },
      { $set: req.body },
      { new: true }
    );

    if (!updatedComment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    res.status(200).json(updatedComment);
  } catch (error) {
    const message = (error as Error).message;
    res.status(500).json({ error: message });
  }
};

export const deleteComment = async (req: CustomRequest, res: Response) => {
  try {
    const userSessionId = req.user?._id;
    const { id } = req.params;

    if (!userSessionId) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    // First, delete the comment itself
    const deletedComment = await CommentModel.findOneAndDelete({
      _id: id,
      userId: userSessionId,
    });

    if (!deletedComment) {
      return res.status(404).json({
        message: "Comment not found or user not authorized to delete",
      });
    }

    // Then, delete all replies to the comment
    await CommentModel.deleteMany({ parentId: id });

    res.status(204).send();
  } catch (error) {
    const message = (error as Error).message;
    res.status(500).json({ error: message });
  }
};

export const getComments = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;

    const comments = await CommentModel.find({ activitySlug: slug })
      .populate("userId", "firstName lastName avatar")
      .lean();

    const transformedComments: Comment[] = await Promise.all(
      comments.map(async (comment): Promise<Comment> => {
        let userId = TransformedCommentUser(comment.userId);

        const replies = await fetchRepliesForComment(comment._id.toString());

        // Construct the transformed comment, initially as any to bypass strict type checks
        const transformedComment: any = {
          ...comment,
          id: comment._id.toString(),
          userId: userId,
          replies: replies,
        };

        // Clean up fields not part of the Comment type
        delete transformedComment._id;
        delete transformedComment.__v;

        // Cast to Comment type
        return transformedComment as Comment;
      })
    );

    res.status(200).json(transformedComments);
  } catch (error) {
    const message = (error as Error).message;
    res.status(500).json({ error: message });
  }
};

export const getComment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const comment = await CommentModel.findById(id).populate("userId", "name");

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    // Optionally, fetch replies
    const replies = await CommentModel.find({ parentId: id }).exec();

    res.status(200).json({ ...comment, replies });
  } catch (error) {
    const message = (error as Error).message;
    res.status(500).json({ error: message });
  }
};
