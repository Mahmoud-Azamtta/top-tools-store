import { Router } from "express";
import * as favoriteController from "./favorite.controller.js";
import { auth } from "../../middleware/auth.js";
import { asyncHandler } from "../../utls/errorHandling.js";
import { endpoints } from "./favorite.endPoint.js";
import { validation } from "../../middleware/validation.js";
import { productIdValid } from "./favorite.validation.js";

const router = Router();

router.get(
  "/",
  auth(endpoints.get),
  asyncHandler(favoriteController.getFavorites),
);
router.post(
  "/",
  auth(endpoints.create),
  validation(productIdValid),
  asyncHandler(favoriteController.createFavList),
);
router.put(
  "/clearFavList",
  auth(endpoints.clear),
  asyncHandler(favoriteController.clearFavList),
);
router.patch(
  "/:productId",
  auth(endpoints.delete),
  validation(productIdValid),
  asyncHandler(favoriteController.removeItem),
);

export default router;

