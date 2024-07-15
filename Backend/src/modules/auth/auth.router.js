import { Router } from "express";
import * as AuthController from "./auth.controller.js";
import { asyncHandler } from "../../utls/errorHandling.js";
import { validation } from "../../middleware/validation.js";
import * as validators from "./auth.validation.js";

const router = Router();
router.post(
  "/signup",
  validation(validators.RegisterSchema),
  asyncHandler(AuthController.signUp),
);
router.get("/confirmEmail/:token", asyncHandler(AuthController.confirmEmail));
router.post(
  "/signin",
  validation(validators.LogInSchema),
  asyncHandler(AuthController.signIn),
);
router.patch(
  "/sendcode",
  validation(validators.sendCodevalidation),
  asyncHandler(AuthController.sendCode),
);
router.patch(
  "/forgotPass",
  validation(validators.forgotPasswordvalid),
  asyncHandler(AuthController.forgotPassword),
);
router.delete(
  "/invalidConfirm",
  asyncHandler(AuthController.deleteInvalidConfirm),
);
router.delete("/deleteUsers", asyncHandler(AuthController.deleteUser));
export default router;
