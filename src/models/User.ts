import mongoose, { Schema } from "mongoose";

const UserSchema = new Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    avatar: { type: String },
    role: { type: String, default: "USER" },
    authenticated: {
      sessionToken: { type: String, select: false },
    },
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

// Define a virtual 'id' property
UserSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

const UserModel = mongoose.model("User", UserSchema);

export { UserModel };
