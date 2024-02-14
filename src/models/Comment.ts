import mongoose, { Schema } from "mongoose";

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
