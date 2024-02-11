import Joi from "joi";

export const addressValidationSchema = Joi.object({
  city: Joi.string().required(),
  state: Joi.string().required(),
  country: Joi.string().required(),
});
