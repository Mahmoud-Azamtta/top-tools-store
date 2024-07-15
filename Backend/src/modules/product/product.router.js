import { Router } from "express";
import * as productController from "./product.controller.js";
import fileUpload, { fileValidation } from "../../utls/multer.js";
import { asyncHandler } from "../../utls/errorHandling.js";
import { validation } from "../../middleware/validation.js";
import * as validator from "./product.validation.js";
import { auth } from "../../middleware/auth.js";
import { endPoint } from "./product.endPoint.js";
import reviewRouter from "./../review/review.router.js";
const router = Router({ mergeParams: true });
router.use("/:productId/review", reviewRouter);
router.post(
  "/",
  auth(endPoint.create),
  fileUpload(fileValidation.image).single("image"),
  validation(validator.createProduct),
  asyncHandler(productController.createProduct),
);

router.get(
  "/getAllProducts",
  auth(endPoint.get),

  asyncHandler(productController.getAllProducts),
);

router.get(
  "/",
  auth(endPoint.get),
  asyncHandler(productController.getAllProductsSub),
);
router.get("/getActive", asyncHandler(productController.getActiveProducts));
router.get(
  "/getActiveSub",
  asyncHandler(productController.getActiveProductsSub),
);

router.get(
  "/getSpecific/:id",
  validation(validator.validationid),
  asyncHandler(productController.getDetailProduct),
);

router.get("/getSpecial", asyncHandler(productController.getProductsSpecial));
router.get("/getPopular", asyncHandler(productController.getPopularProducts));
router.get(
  "/getDiscount",
  validation(validator.validationid),
  asyncHandler(productController.getAllProductsDiscount),
);
router.get(
  "/lessStock",
  auth(endPoint.get),
  validation(validator.validationid),
  asyncHandler(productController.getLessTenProducts),
);
router.get(
  "/unpopularProducts",
  auth(endPoint.get),
  validation(validator.validationid),
  asyncHandler(productController.getUnpopularProducts),
);

router.get("/getLastest", asyncHandler(productController.getLatestProducts));

router.patch(
  "/:id",
  auth(endPoint.update),
  fileUpload(fileValidation.image).single("image"),
  validation(validator.updateProduct),
  asyncHandler(productController.updateProduct),
);
router.patch(
  "/changeStatus/:id",
  auth(endPoint.changeStatus),
  validation(validator.updateProductStatus),
  asyncHandler(productController.updateProductStatus),
);
router.delete(
  "/:id",
  auth(endPoint.delete),
  validation(validator.validationid),
  asyncHandler(productController.deleteProduct),
);
router.get(
  "/get-recommended",
  auth(endPoint.getRecommended),
  productController.getRecommended,
);
export default router;
