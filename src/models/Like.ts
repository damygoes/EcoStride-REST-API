import mongoose, { Schema } from "mongoose";

const LikeSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    activityId: {
      type: Schema.Types.ObjectId,
      ref: "Activity",
      required: true,
    },
    likedAt: { type: Date, default: Date.now },
  },
  {
    toJSON: {
      virtuals: true, // Ensure virtuals are included in JSON output
      versionKey: false, // Do not include the __v field
      transform: (doc, ret) => {
        delete ret._id; // Exclude _id from JSON output
      },
    },
  }
);

const LikeModel = mongoose.model("Like", LikeSchema);

export { LikeModel };
