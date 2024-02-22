import mongoose, { Schema } from "mongoose";
import { CommentUser } from "./Comment";

export type Reply = {
  id: string;
  activitySlug: string;
  userId: CommentUser | string;
  parentId: string | null | undefined;
  text: string;
  createdAt: Date;
  updatedAt: Date;
};

const ReplySchema = new Schema(
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
    parentId: {
      type: Schema.Types.ObjectId,
      ref: "Comment",
    },
    text: {
      type: String,
      required: true,
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

ReplySchema.index({ activitySlug: 1 }); // Add index to activitySlug for faster querying
const ReplyModel = mongoose.model("Reply", ReplySchema);

export { ReplyModel };
