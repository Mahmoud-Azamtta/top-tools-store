import joi from "joi";

export const productIdValid = joi.object({
  productId: joi.string().hex().min(24).max(24).required(),
});
