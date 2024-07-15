import couponModel from "../../../DB/model/coupon.model.js";
import { AppError } from "../../utls/AppError.js";

export const createCoupon = async (req, res, next) => {
  const { name } = req.body;
  req.body.expireDate = new Date(req.body.expireDate);
  if (await couponModel.findOne({ name })) {
    return next(new AppError(`coupon name already exists`, 409));
  }
  const coupon = await couponModel.create(req.body);
  return res.status(201).json({ message: "success", coupon });
};

export const getCoupons = async (req, res) => {
  const coupons = await couponModel.find();
  return res.status(200).json({ message: "success", coupons });
};

export const updateCoupon = async (req, res, next) => {
  const coupon = await couponModel.findById(req.params.id);
  if (!coupon) {
    return next(new AppError(`coupon not found`, 404));
  }
  if (req.body.name) {
    if (
      await couponModel
        .findOne({ name: req.body.name, _id: { $ne: req.params.id } })
        .select("name")
    ) {
      return next(new AppError(`coupon ${req.body.name} already exists`, 409));
    }
    coupon.name = req.body.name;
  }
  if (req.body.amount) {
    coupon.amount = req.body.amount;
  }
  if (req.body.expireDate) {
    coupon.expireDate = req.body.expireDate;
  }

  await coupon.save();
  return res.status(200).json({ message: "success", coupon });
};

export const DeleteCoupon = async (req, res, next) => {
  const { id } = req.params;
  const coupon = await couponModel.findOneAndDelete({ _id: id });
  if (!coupon) {
    return next(new AppError(`coupon not found`, 404));
  }
  return res.status(200).json({ message: "success" });
};
