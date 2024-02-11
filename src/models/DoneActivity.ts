import mongoose, { Schema } from "mongoose";

const DoneActivitySchema = new Schema(
  {
    activityId: {
      type: Schema.Types.ObjectId,
      ref: "Activity",
      required: true,
    },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    doneAt: { type: Date, default: Date.now },
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

const DoneActivityModel = mongoose.model("DoneActivity", DoneActivitySchema);

export { DoneActivityModel };
