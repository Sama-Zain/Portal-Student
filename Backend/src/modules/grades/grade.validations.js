import Joi from "joi";
import { generalFields } from "../../middleware/validations.middleware.js";

export const gradeSchema = {
  body: Joi.object({
    student: generalFields.id.required(),
    course: generalFields.id.required(),
    grade: generalFields.grade.required(),
  }),
};