import joi from "joi";
export const CreateCoupon = joi.object({
  name: joi.string().min(3).max(25).required(),
  amount: joi.number().positive(),
  expireDate: joi.date().greater("now").required(),
});

export const updateCoupon = joi.object({
  id: joi.string().hex().min(24).max(24).required(),
  name: joi.string().min(3).max(25).required(),
  amount: joi.number().positive().required(),
  expireDate: joi.date().greater("now").required(),
});
export const deletcouponValid = joi.object({
  id: joi.string().hex().min(24).max(24),
});

