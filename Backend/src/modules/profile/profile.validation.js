import joi from "joi";
import { generalFields } from "../../middleware/validation.js";
export const UpdateInfoUser = joi.object({
  userName: joi.string().alphanum().min(3).max(20).required(),
  email: generalFields.email.required(),

  Address: joi
    .object({
      city: joi.string().min(3).max(20),
      street: joi.string().min(3).max(30),
      description: joi.string().min(3).max(200),
    })
    .optional(),
  phoneNumber: joi.string().length(10).optional(),
});

export const updatePassword = joi.object({
  currentPassword: generalFields.password,
  newPassword: generalFields.password,
  checkPassword: joi.valid(joi.ref("newPassword")).required(),
});
