import { Router } from "express";
import * as gradeService from "./grade.service.js";
import * as gradeValidation from "./grade.validations.js";
import { validation } from "../../middleware/validations.middleware.js";
import { authentication, authorization } from "../../middleware/auth.middleware.js";
import { RoleEnum } from "../../utils/enums/user.enum.js";

const router = Router();

router.get(
  "/",
  authentication(),
  gradeService.getGrades
);

router.post(
  "/",
  authentication(),
    authorization({ role: [RoleEnum.ADMIN]}), 
  validation(gradeValidation.gradeSchema),
  gradeService.uploadGrade
);

export default router;