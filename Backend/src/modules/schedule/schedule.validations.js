import Joi from "joi";
import { generalFields } from "../../middleware/validations.middleware.js";

export const scheduleSchema = {
  body: Joi.object({
    course: generalFields.id.required(),
  }),
};