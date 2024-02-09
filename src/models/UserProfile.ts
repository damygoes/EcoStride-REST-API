import mongoose, { Schema } from "mongoose";

const UserProfileSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    bio: String,
    age: Number,
    ftp: Number,
    bikeWeight: Number,
    bodyWeight: Number,
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
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

const UserProfileModel = mongoose.model("UserProfile", UserProfileSchema);

export { UserProfileModel };
