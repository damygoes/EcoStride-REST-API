import mongoose, { Schema } from "mongoose";

const BucketListSchema = new Schema(
  {
    activityId: {
      type: Schema.Types.ObjectId,
      ref: "Activity",
      required: true,
    },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    addedAt: { type: Date, default: Date.now },
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

const BucketListModel = mongoose.model("BucketList", BucketListSchema);

export { BucketListModel };
