import mongoose, { Schema } from "mongoose";

export const validActivityTypes = ["Run", "Bike", "Hike"];
export const validRouteTypes = ["Flat", "Rolling", "Hilly"];
export const validDifficultyLevels = [
  "Easy",
  "Moderate",
  "Hard",
  "Very Hard",
  "Extremely Hard",
];
export const validClimbCategories = [
  "Four",
  "Three",
  "Two",
  "One",
  "Hors Categorie (HC)",
];

const ActivitySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    slug: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    distance: { type: Number, required: true },
    elevationGain: { type: Number, required: true },
    minimumGrade: { type: Number },
    maximumGrade: { type: Number },
    averageGrade: { type: Number, required: true },
    timeToComplete: { type: Number },
    difficultyLevel: {
      type: String,
      required: true,
      enum: validDifficultyLevels,
    },
    activityType: {
      type: String,
      required: true,
      enum: validActivityTypes,
    },
    routeType: {
      type: String,
      required: true,
      enum: validRouteTypes,
    },
    climbCategory: {
      type: String,
      enum: validClimbCategories,
    },
    photos: { type: [String] },
    tags: { type: [String] },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    address: {
      type: Schema.Types.ObjectId,
      ref: "Address",
      required: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    startCoordinate: {
      type: Schema.Types.ObjectId,
      ref: "StartCoordinate",
    },
    endCoordinate: {
      type: Schema.Types.ObjectId,
      ref: "EndCoordinate",
    },
    isCreatedByAdmin: { type: Boolean, default: false },
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

const ActivityModel = mongoose.model("Activity", ActivitySchema);

export { ActivityModel };
