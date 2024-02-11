import Joi from "joi";
import {
  validActivityTypes,
  validClimbCategories,
  validDifficultyLevels,
  validRouteTypes,
} from "../models/Activity";
import { addressValidationSchema } from "./addressValidator";
import { coordinateValidationSchema } from "./coordinateValidator";

export const activityValidationSchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().required(),
  distance: Joi.number().required(),
  elevationGain: Joi.number().required(),
  minimumGrade: Joi.number(),
  maximumGrade: Joi.number(),
  averageGrade: Joi.number().required(),
  timeToComplete: Joi.number(),
  difficultyLevel: Joi.string()
    .valid(...validDifficultyLevels)
    .required(),
  activityType: Joi.string()
    .valid(...validActivityTypes)
    .required(),
  routeType: Joi.string()
    .valid(...validRouteTypes)
    .required(),
  climbCategory: Joi.string()
    .valid(...validClimbCategories)
    .when("activityType", { is: "Bike", then: Joi.required() })
    .when("routeType", { is: "Hilly", then: Joi.required() })
    .when("activityType", {
      is: "Bike",
      otherwise: Joi.forbidden().error(
        new Error('climbCategory can only be specified for "Bike" activities.')
      ),
    })
    .when("routeType", {
      is: "Hilly",
      otherwise: Joi.forbidden().error(
        new Error('climbCategory can only be specified for "Hilly" routes.')
      ),
    }),
  photos: Joi.array().items(Joi.string()),
  tags: Joi.array().items(Joi.string()),
  address: addressValidationSchema.required(),
  startCoordinate: coordinateValidationSchema,
  endCoordinate: coordinateValidationSchema,
});
