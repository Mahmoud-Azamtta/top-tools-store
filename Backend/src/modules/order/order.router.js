import { Router } from "express";
import * as orderController from "./order.controller.js";
import { auth } from "../../middleware/auth.js";
import * as validator from "./order.validation.js";
import { asyncHandler } from "../../utls/errorHandling.js";
import { endPoint } from "./order.endPoint.js";
import { validation } from "../../middleware/validation.js";

const router = Router();
router.post(
  "/",
  auth(endPoint.create),
  validation(validator.createOrder),
  asyncHandler(orderController.createOrder),
);
router.post(
  "/orderVisa",
  auth(endPoint.create),
  validation(validator.createOrder),
  asyncHandler(orderController.createOrderVisa),
);
router.post("/confirmOrder/:id"),
  auth(endPoint.confirm),
  validation(validator.validationid),
  asyncHandler(orderController.confirmComplete);
router.delete("/deleteOrder/:orderId"),
  auth(endPoint.delete),
  validation(validator.validationid),
  asyncHandler(orderController.deleteOrder);
router.get(
  "/all",
  auth(endPoint.all),
  validation(validator.validationid),
  asyncHandler(orderController.getAllOrders),
);
router.get(
  "/:id/all",
  auth(endPoint.all),
  validation(validator.validationid),
  asyncHandler(orderController.userOrders),
);
router.get(
  "/pending",
  auth(endPoint.all),
  validation(validator.validationid),
  asyncHandler(orderController.getPendingOrders),
);
router.get(
  "/LatestPendingOrders",
  auth(endPoint.all),
  validation(validator.validationid),
  asyncHandler(orderController.getLatestPendingOrders),
);
router.get(
  "/:id/pendingUser",
  auth(endPoint.all),
  validation(validator.validationid),
  asyncHandler(orderController.userPendingOrders),
);
router.get(
  "/confirmed",
  auth(endPoint.all),
  validation(validator.validationid),
  asyncHandler(orderController.getConfirmedOrders),
);
router.get(
  "/:id/confirmedUser",
  auth(endPoint.all),
  validation(validator.validationid),
  asyncHandler(orderController.userConfirmedOrders),
);
router.get(
  "/delivered",
  auth(endPoint.all),
  validation(validator.validationid),
  asyncHandler(orderController.getDeliveredOrders),
);
router.get(
  "/:id/deliveredUser",
  auth(endPoint.all),
  validation(validator.validationid),
  asyncHandler(orderController.userDeliveredOrders),
);
router.patch(
  "/changeStatus/:orderId",
  auth(endPoint.changeStatus),
  validation(validator.updateStatus),
  asyncHandler(orderController.changeStatus),
);
router.delete(
  "/:orderId",
  auth(endPoint.delete),
  validation(validator.IdCancel),
  asyncHandler(orderController.CancelOrder),
);
router.patch(
  "/updateOrder/:orderId",
  auth(endPoint.update),
  validation(validator.updateOrderval),
  asyncHandler(orderController.updateOrder),
);

export default router;

