import mongoose, { Document, Schema } from "mongoose";

interface IProfile {
  bio?: string;
  age?: number;
  ftp?: number;
  bodyWeight?: number;
  bikeWeight?: number;
  // Add other profile fields as necessary
}

// Define an interface for the update object that allows dynamic profile keys
export interface IUserUpdateObject {
  [key: string]: any; // Allows dynamic keys, but consider defining more specific types
}

export type USER_ROLE = "USER" | "ADMIN";

export interface IUser extends Document {
  userId: string;
  googleId: string;
  firstName: string;
  lastName: string;
  email: string;
  avatar?: string;
  role?: USER_ROLE;
  profile?: IProfile;
}

const UserSchema: Schema = new Schema(
  {
    googleId: { type: String, required: true, unique: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: (v: string) => /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v),
        message: (props: any) => `${props.value} is not a valid email address!`,
      },
    },
    avatar: { type: String },
    role: { type: String },
    profile: {
      bio: { type: String },
      age: { type: Number },
      bodyWeight: { type: Number },
      bikeWeight: { type: Number },
      ftp: { type: Number },
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true, // Ensure virtuals are included in JSON output
      versionKey: false, // Do not include the __v field
      transform: (doc, ret) => {
        delete ret._id; // Exclude _id from JSON output
      },
    },
  }
);

export const UserModel = mongoose.model<IUser>("User", UserSchema);

// import mongoose, { Schema } from "mongoose";

// const ProfileSchema = new Schema(
//   {
//     bio: String,
//     age: Number,
//     ftp: Number,
//     bikeWeight: Number,
//     bodyWeight: Number,
//   },
//   {
//     toJSON: {
//       virtuals: true, // Ensure virtuals are included in JSON output
//       versionKey: false, // Do not include the __v field
//       transform: (doc, ret) => {
//         delete ret._id; // Exclude _id from JSON output
//       },
//     },
//   }
// );

// const UserSchema = new Schema(
//   {
//     firstName: { type: String, required: true },
//     lastName: { type: String, required: true },
//     email: {
//       type: String,
//       required: true,
//       unique: true,
//       validate: {
//         validator: function (v: string) {
//           return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v);
//         },
//         message: (props: any) => `${props.value} is not a valid email address!`,
//       },
//     },
//     avatar: { type: String },
//     role: { type: String, enum: ["USER", "ADMIN"], default: "USER" },
//     accessToken: { type: String },
//     refreshToken: { type: String },
//     accessTokenExpiry: { type: Date },
//     googleId: { type: String },
//     profile: ProfileSchema,
//     createdAt: { type: Date, default: Date.now },
//     updatedAt: { type: Date, default: Date.now },
//   },
//   {
//     toJSON: {
//       virtuals: true, // Ensure virtuals are included in JSON output
//       versionKey: false, // Do not include the __v field
//       transform: (doc, ret) => {
//         delete ret._id; // Exclude _id from JSON output
//       },
//     },
//   }
// );

// // Define a virtual 'id' property
// UserSchema.virtual("id").get(function () {
//   return this._id.toHexString();
// });

// const UserModel = mongoose.model("User", UserSchema);

// export { UserModel };
