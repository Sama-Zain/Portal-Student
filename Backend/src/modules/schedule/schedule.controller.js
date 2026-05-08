import { Router } from "express";
import * as scheduleService from "./schedule.service.js";
import { authentication } from "../../middleware/auth.middleware.js";

const router = Router();
router.get(
  "/",
  authentication(),
  scheduleService.getSchedule
);

export default router;