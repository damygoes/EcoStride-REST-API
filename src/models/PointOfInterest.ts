import mongoose, { Schema } from "mongoose";

const PointOfInterestSchema = new Schema(
  {
    name: { type: String, required: true, unique: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    images: { type: [String] },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    addressId: {
      type: Schema.Types.ObjectId,
      ref: "Address",
      required: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
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

const PointOfInterestModel = mongoose.model(
  "PointOfInterest",
  PointOfInterestSchema
);

export { PointOfInterestModel };
