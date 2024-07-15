import { Router } from "express";
import * as reviewController from "./review.controller.js";
import { auth } from "../../middleware/auth.js";
import { asyncHandler } from "../../utls/errorHandling.js";
import { endpoints } from "./review.endPoint.js";
import fileUpload, { fileValidation } from "../../utls/multer.js";
import { validation } from "../../middleware/validation.js";
import { createReviews } from "./review.validation.js";

const router = Router({ mergeParams: true });

router.post(
  "/",
  auth(endpoints.create),
  fileUpload(fileValidation.image).single("image"),
  validation(createReviews),
  asyncHandler(reviewController.createReview),
);

export default router;

