import mongoose, { Schema, model, Types } from "mongoose";
import { addressSchema } from "./user.model.js";

const orderSchema = new Schema(
  {
    userId: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },

    couponId: {
      type: Types.ObjectId,
      ref: "Coupon",
    },
    products: [
      {
        productName: { type: String },
        productId: { type: Types.ObjectId, ref: "Product", required: true },
        quantity: { type: Number, default: 1, required: true },
        unitPrice: { type: Number, required: true },
        finalPrice: { type: Number, required: true },
      },
    ],
    finalPrice: {
      type: Number,
      required: true,
    },
    Address: addressSchema,
    phoneNumber: { type: String, required: true },
    paymentType: {
      type: String,
      default: "cash",
      enum: ["card", "cash"],
    },
    couponName: {
      type: String,
      requierd: true,
    },
    completed: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      default: "pending",
      enum: ["pending", "cancelled", "confirmed", "delivered"],
    },
    note: { type: String },
    updatedBy: { type: Types.ObjectId, ref: "User" },
  },
  {
    timestamps: true,
  },
);

const orderModel = mongoose.models.Order || model("Order", orderSchema);
export default orderModel;

