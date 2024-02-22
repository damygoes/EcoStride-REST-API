import mongoose, { Schema } from "mongoose";

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

const CommentSchema = new Schema(
  {
    activitySlug: {
      type: String,
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
    replies: {
      type: [
        {
          type: Schema.Types.ObjectId,
          ref: "Comment",
        },
      ],
    },
  },
  {
    toJSON: {
      virtuals: true, // Ensure virtuals are included in JSON output
      versionKey: false, // Do not include the __v field
      transform: (doc, ret) => {
        ret.id = ret._id.toString(); // Assign _id's value to id
        delete ret._id; // Exclude _id from JSON output
      },
    },
    timestamps: true, // Include createdAt and updatedAt fields
  }
);

CommentSchema.index({ activitySlug: 1 }); // Add index to activitySlug for faster querying
const CommentModel = mongoose.model("Comment", CommentSchema);

export { CommentModel };
