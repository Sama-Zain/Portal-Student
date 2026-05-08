import Joi from "joi";
import { generalFields } from "../../middleware/validations.middleware.js";

export const announceSchema = {
  body: Joi.object({
    title: generalFields.title.required(),
    content: generalFields.content.required(),
  }),
};