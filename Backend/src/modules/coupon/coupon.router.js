import { Router } from "express";
import * as couponController from "./coupon.controller.js";

import { auth } from "../../middleware/auth.js";
import { endPoint } from "./coupon.endPoint.js";
import { asyncHandler } from "../../utls/errorHandling.js";
import { validation } from "../../middleware/validation.js";
import * as validators from "./coupon.validation.js";

const router = Router();

router.post(
  "/",
  auth(endPoint.create),
  validation(validators.CreateCoupon),
  asyncHandler(couponController.createCoupon),
);
router.get("/", asyncHandler(couponController.getCoupons));
router.patch(
  "/:id",
  auth(endPoint.update),
  validation(validators.updateCoupon),
  asyncHandler(couponController.updateCoupon),
);
router.delete(
  "/:id",
  auth(endPoint.delete),
  validation(validators.deletcouponValid),
  asyncHandler(couponController.DeleteCoupon),
);
export default router;

