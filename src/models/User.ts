import mongoose, { Schema } from "mongoose";

const ProfileSchema = new Schema(
  {
    bio: String,
    age: Number,
    ftp: Number,
    bikeWeight: Number,
    bodyWeight: Number,
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

const UserSchema = new Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: function (v: string) {
          return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v);
        },
        message: (props: any) => `${props.value} is not a valid email address!`,
      },
    },
    avatar: { type: String },
    role: { type: String, enum: ["USER", "ADMIN"], default: "USER" },
    authenticated: {
      sessionToken: { type: String, select: false },
    },
    profile: ProfileSchema,
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
