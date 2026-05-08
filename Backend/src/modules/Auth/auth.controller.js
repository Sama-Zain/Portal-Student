import { Router } from "express";
import * as authService from "./auth.service.js";
import * as authValidation from "./auth.validations.js";
import { validation } from "../../middleware/validations.middleware.js";
import { authentication } from "../../middleware/auth.middleware.js";

const router = Router();


router.post(
  "/register",
  validation(authValidation.registerSchema),
  authService.register
); //http://localhost:3000/api/auth/register

router.post(
  "/login",
  validation(authValidation.loginSchema),
  authService.login
); //http://localhost:3000/api/auth/login
router.patch(
  "/logout",
  authentication(),
  authService.logout
); //http://localhost:3000/api/auth/logout

export default router;