import Joi from "joi";
import { generalFields } from "../../middleware/validations.middleware.js";

export const courseSchema = {
  body: Joi.object({
    title: generalFields.title.required(),
    instructor: generalFields.id.required(),
  }),
};