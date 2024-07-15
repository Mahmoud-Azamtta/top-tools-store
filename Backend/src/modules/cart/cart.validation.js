import joi from "joi";

export const createCartvalid = joi.object({
  productId: joi.string().hex().min(24).max(24).required(),
  itemNo: joi.string().min(3).max(25).required(),
  total: joi.number().positive(),
});
export const removeItem = joi.object({
  productId: joi.string().hex().min(24).max(24).required(),
  itemNo: joi.string().min(3).max(25).required(),
});
export const updateQuantityvalid = joi.object({
  quantity: joi.number().integer().min(1).required(),
  operator: joi.string().valid("+", "-").required(),
  productId: joi.string().hex().min(24).max(24).required(),
  itemNo: joi.string().min(3).max(25).required(),
});

