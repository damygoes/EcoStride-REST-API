import mongoose, { Schema } from "mongoose";

const StartCoordinateSchema = new Schema(
  {
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    activityId: {
      type: Schema.Types.ObjectId,
      ref: "Activity",
    },
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

const StartCoordinateModel = mongoose.model(
  "StartCoordinate",
  StartCoordinateSchema
);

export { StartCoordinateModel };
