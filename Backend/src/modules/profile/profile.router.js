import { Router } from "express";
import * as profileController from "./profile.controller.js";
import { auth } from "../../middleware/auth.js";
import { asyncHandler } from "../../utls/errorHandling.js";
import { endPoint } from "./profile.endPoint.js";
import { validation } from "../../middleware/validation.js";
import { UpdateInfoUser, updatePassword } from "./profile.validation.js";

const router = Router();

router.get(
  "/",
  auth(endPoint.get),
  asyncHandler(profileController.getUserDate),
);
router.patch(
  "/",
  auth(endPoint.Update),
  validation(UpdateInfoUser),
  asyncHandler(profileController.updateUserDate),
);
router.patch(
  "/updatePassword",
  auth(endPoint.Update),
  validation(updatePassword),
  asyncHandler(profileController.updatePassword),
);
export default router;

