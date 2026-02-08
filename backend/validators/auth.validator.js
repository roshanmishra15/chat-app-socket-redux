import Joi from "joi";

export const registerSchema = Joi.object({
  fullname: Joi.string().min(3).required(),
  email: Joi.string().email().required(),
  mobile: Joi.string().min(10).required(),
  password: Joi.string().min(6).required(),
  confirmPassword: Joi.string()
    .valid(Joi.ref("password"))
    .required()
    .messages({
      "any.only": "Passwords do not match",
    }),
});
