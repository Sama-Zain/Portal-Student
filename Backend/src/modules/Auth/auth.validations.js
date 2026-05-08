import Joi from "joi";
import { generalFields } from "../../middleware/validations.middleware.js";
export const registerSchema = {
  body: Joi.object({
    userName: generalFields.userName.required(),
    password: generalFields.password.required(),
    role: generalFields.role.required(),
  }),
};
export const loginSchema = {
  body: Joi.object({
    userName: generalFields.userName.required(),
    password: generalFields.password.required(),
  }),
};
