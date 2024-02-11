import mongoose, { Schema } from "mongoose";

const AddressSchema = new Schema(
  {
    city: { type: String, required: true },
    state: { type: String, required: true },
    country: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
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

const AddressModel = mongoose.model("Address", AddressSchema);

export { AddressModel };
