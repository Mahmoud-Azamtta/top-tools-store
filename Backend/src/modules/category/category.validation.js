import joi from "joi";
import { generalFields } from "../../middleware/validation.js";

export const createCategory = joi.object({
  name: joi.string().min(3).max(25).required(),
  file: generalFields.file.required(),
});
export const updateCategory = joi.object({
  name: joi.string().min(3).max(25).required(),
  status: joi.string().valid("Active", "Inactive").default("Active").required(),
  id: joi.string().hex().min(24).max(24).required(),
  file: generalFields.file,
});
export const Categoryid = joi.object({
  categoryId: joi.string().hex().min(24).max(24).required(),
});

