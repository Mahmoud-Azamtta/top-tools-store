import { Router } from "express";
import * as cartController from "./cart.controller.js";
import { auth } from "../../middleware/auth.js";
import { asyncHandler } from "../../utls/errorHandling.js";
import { endpoints } from "./cart.endPoint.js";
import * as validators from "./cart.validation.js";
import { validation } from "../../middleware/validation.js";
const router = Router();

router.get("/", auth(endpoints.get), asyncHandler(cartController.getCart));
router.post(
  "/",
  auth(endpoints.create),
  validation(validators.createCartvalid),
  asyncHandler(cartController.createCart),
);
router.put(
  "/clearCart",
  auth(endpoints.clear),
  asyncHandler(cartController.clearCart),
);
router.patch(
  "/:productId",
  auth(endpoints.delete),
  validation(validators.removeItem),
  asyncHandler(cartController.removeItem),
);
router.patch(
  "/updateQuantity/:productId",
  auth(endpoints.update),
  validation(validators.updateQuantityvalid),
  asyncHandler(cartController.updateQuantity),
);
export default router;

