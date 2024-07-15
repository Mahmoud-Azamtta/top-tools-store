import { Router } from "express";
import * as subcategoryController from "./subcategory.controller.js";
import fileUpload, { fileValidation } from "../../utls/multer.js";
import { asyncHandler } from "../../utls/errorHandling.js";
import { validation } from "../../middleware/validation.js";
import * as validator from "./subcategory.validation.js";
import { auth } from "../../middleware/auth.js";
import productRouter from "./../product/product.router.js";
import { endPoint } from "./subcategory.endPoint.js";

const router = Router({ mergeParams: true });

router.use("/:id/product", productRouter);
router.post(
  "/",
  auth(endPoint.create),
  validation(validator.createsubCategory),
  asyncHandler(subcategoryController.createSubCategory),
);
router.get(
  "/",
  auth(endPoint.getAll),
  validation(validator.validationid),
  asyncHandler(subcategoryController.getAllSubCategories),
);
router.get(
  "/Active",
  validation(validator.validationid),
  asyncHandler(subcategoryController.getActivesubCategory),
);
router.get(
  "/getSpecific/:id",
  validation(validator.validationid),
  asyncHandler(subcategoryController.getDetailsubCategories),
);
router.get(
  "/getsubWithOutCateg",
  auth(endPoint.getAll),
  asyncHandler(subcategoryController.getAllSubWithOutCategory),
);
router.patch(
  "/:id",
  auth(endPoint.update),
  validation(validator.updateSub),
  asyncHandler(subcategoryController.updatesubCategories),
);

router.delete(
  "/:subcategoryId",
  auth(endPoint.delete),
  validation(validator.validationsubId),
  asyncHandler(subcategoryController.deletesubCategories),
);

export default router;

