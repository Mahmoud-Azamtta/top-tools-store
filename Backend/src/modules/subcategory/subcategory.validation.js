import joi from "joi";

export const createsubCategory = joi.object({
  name: joi.string().min(3).max(25).required().required(),
  categoryId: joi.string().hex().min(24).max(24).required(),
});

export const validationid = joi.object({
  id: joi.string().hex().min(24).max(24).required(),
});

export const validationsubId = joi.object({
  subcategoryId: joi.string().hex().min(24).max(24).required(),
});

export const updateSub = joi.object({
  name: joi.string().min(3).max(25).required(),
  status: joi.string().valid("Active", "Inactive").default("Active").required(),
  id: joi.string().hex().min(24).max(24).required(),
});
