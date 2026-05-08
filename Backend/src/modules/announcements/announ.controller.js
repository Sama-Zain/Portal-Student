import { Router } from "express";
import * as announService from "./announ.service.js";
import * as announValidation from "./announ.validations.js";
import { validation } from "../../middleware/validations.middleware.js";
import { authentication } from "../../middleware/auth.middleware.js";
import { authorization } from "../../middleware/auth.middleware.js";
import { RoleEnum } from "../../utils/enums/user.enum.js";

const router = Router();

// 📢 Get all (students)
router.get(
  "/",
  authentication(),
  announService.getAnnouncements
);

// 📢 Create (faculty/admin)
router.post(
  "/",
  authentication(),
  authorization({ role: [RoleEnum.ADMIN] }),
  validation(announValidation.createAnnouncementSchema),
  announService.createAnnouncement
);

// ✏️ Update
router.put(
  "/:id",
  authentication(),
  authorization({ role: [RoleEnum.ADMIN] }),
  validation(announValidation.updateAnnouncementSchema),
  announService.updateAnnouncement
);

// ❌ Delete
router.delete(
  "/:id",
  authentication(),
  authorization({ role: [RoleEnum.ADMIN] }),
  validation(announValidation.deleteAnnouncementSchema),
  announService.deleteAnnouncement
);

export default router;