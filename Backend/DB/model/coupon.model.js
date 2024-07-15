import mongoose, { Schema, model, Types } from "mongoose";

const couponSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    amount: { type: Number, required: true },
    usedBy: [
      {
        type: Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],
    expireDate: { type: Date, required: true },
    createdBy: { type: Types.ObjectId, ref: "User" },
    updatedBy: { type: Types.ObjectId, ref: "User" },
  },
  {
    timestamps: true,
  },
);

const couponModel = mongoose.models.Coupon || model("Coupon", couponSchema);
export default couponModel;
