import { Router } from "express";
import * as userService from "./user.service.js";
import { authentication, authorization } from "../../middleware/auth.middleware.js";
import { validation } from "../../middleware/validations.middleware.js";
import { RoleEnum } from "../../utils/enums/user.enum.js";
import * as userValidation  from "./user.validations.js";

const router = Router();


// 👤 Get profile
router.get(
  "/profile",
  authentication(),
  userService.getProfile
); //http://localhost:3000/api/user/profile


// ✏️ Update profile
router.put(
  "/profile",
  authentication(),
  userService.updateProfile
); //http://localhost:3000/api/user/profile

// 👥 Get all users (admin)
router.get(
  "/",
  authentication(),
  authorization({ role: [RoleEnum.ADMIN] }), 
  userService.getAllUsers
); //http://localhost:3000/api/user/

// add user (admin)
router.post(
  "/add-user",
  validation(userValidation.addUserSchema
  ),
  authentication(),
  authorization({ role: [RoleEnum.ADMIN] }),
  userService.addUser
); //http://localhost:3000/api/user/



export default router;