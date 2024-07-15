import mongoose, { Schema, model, Types } from "mongoose";

const reviewSchema = new Schema(
  {
    comment: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
    },
    productId: {
      type: Types.ObjectId,
      ref: "Product",
      required: true,
    },
    userId: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },
    image: {
      type: Object,
    },
  },
  {
    timestamps: true,
  },
);

const reviewModel = mongoose.models.Review || model("Review", reviewSchema);
export default reviewModel;

