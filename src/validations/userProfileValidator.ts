import Joi from "joi";

export const userProfileValidationSchema = Joi.object({
  bio: Joi.string(),
  age: Joi.number(),
  ftp: Joi.number(),
  bikeWeight: Joi.number(),
  bodyWeight: Joi.number(),
}).strict();
