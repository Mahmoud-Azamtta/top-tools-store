import { Router } from "express";
import * as customerController from "./customer.controller.js";
import { auth } from "../../middleware/auth.js";
import { endPoint } from "./customer.endPoint.js";
import { asyncHandler } from "../../utls/errorHandling.js";
import { validation } from "../../middleware/validation.js";
import * as validators from "./customer.validation.js";

const router = Router();

router.get(
  "/search",
  auth(endPoint.getAll),
  asyncHandler(customerController.searchCustomer),
);
router.get(
  "/",
  auth(endPoint.getAll),
  asyncHandler(customerController.getCustomer),
);
router.patch(
  "/:userId",
  auth(endPoint.update),
  validation(validators.updateInfoCustomer),
  asyncHandler(customerController.updateCustomerInfo),
);
router.delete(
  "/:userId",
  auth(endPoint.delete),
  validation(validators.CustomerIdvalid),
  asyncHandler(customerController.deleteCustomer),
);
router.get(
  "/:userId",
  auth(endPoint.getAll),
  validation(validators.CustomerIdvalid),
  asyncHandler(customerController.getCustomerOrders),
);

export default router;

