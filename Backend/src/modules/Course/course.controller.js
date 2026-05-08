
import { Router } from "express";
import * as courseService from "./course.service.js";
import * as courseValidation from "./course.validations.js";
import { validation } from "../../middleware/validations.middleware.js";
import { authentication } from "../../middleware/auth.middleware.js";
const router = Router();
router.post(
  "/enroll",
  authentication(),
  validation(courseValidation.enrollSchema),
  courseService.enrollCourse
);
router.delete(
  "/withdraw",
  authentication(),
  validation(courseValidation.withdrawSchema),
  courseService.withdrawCourse
);
router.get(
  "/my-courses",
  authentication(),
  courseService.getMyCourses
);
export default router;