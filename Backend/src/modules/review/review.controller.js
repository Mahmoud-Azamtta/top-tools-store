import mongoose from "mongoose";
import orderModel from "../../../DB/model/order.model.js";
import reviewModel from "../../../DB/model/review.model.js";
import { AppError } from "../../utls/AppError.js";
import cloudinary from "../../utls/cloudinary.js";

export const createReview = async (req, res, next) => {
  const { productId } = req.params;
  const { comment, rating } = req.body;

  const order = await orderModel.findOne({
    userId: req.user._id,
    status: "delivered",
    "products.productId": productId,
  });
  if (!order) {
    return next(new AppError(`can't review this order`, 400));
  }
  const checkReview = await reviewModel.findOne({
    userId: req.user._id,
    productId: productId,
  });
  if (checkReview) {
    return next(new AppError(`already review this order`, 400));
  }
  if (req.file) {
    const { secure_url, public_id } = await cloudinary.uploader.upload(
      req.file.path,
      { folder: `${process.env.APP_NAME}/${productId}/reviews` },
    );
    req.body.image = { secure_url, public_id };
  }
  const review = await reviewModel.create({
    comment,
    rating,
    productId,
    userId: req.user._id,
    image: req.body.image,
  });
  return res.status(200).json({ message: "success", review });
};

export const getAvgRating = async (productId) => {
  const result = await reviewModel.aggregate([
    { $match: { productId: new mongoose.Types.ObjectId(productId) } },
    {
      $group: {
        _id: "$productId",
        averageRating: { $avg: "$rating" },
      },
    },
  ]);

  return result.length > 0 ? result[0].averageRating : 0;
};
