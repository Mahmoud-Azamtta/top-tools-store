import mongoose, { Schema, model, Types } from "mongoose";

const cartSchema = new Schema(
  {
    userId: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    products: [
      {
        productId: { type: Types.ObjectId, ref: "Product", required: true },
        itemNo: { type: String, required: true },
        quantity: { type: Number, default: 1 },
        finalPrice: { type: Number },
        price: { type: Number, required: true },
        discount: { type: Number, default: 0 },
      },
    ],
    total: {
      type: Number,
    },
  },
  {
    timestamps: true,
  },
);

const cartModel = mongoose.models.Cart || model("Cart", cartSchema);
export default cartModel;

