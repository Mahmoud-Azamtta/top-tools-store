import { generalFields } from "../../middleware/validation.js";
import joi from "joi";

export const updateInfoCustomer = joi.object({
  userName: joi.string().alphanum().min(3).max(20).required().messages({
    "string.empty": "userName is required",
  }),
  email: generalFields.email.required(),

  userId: joi.string().hex().min(24).max(24).required(),

  Address: joi
    .object({
      city: joi.string().min(3).max(20),
      street: joi.string().min(3).max(30),
      description: joi.string().min(3).max(200),
    })
    .optional(),
  phoneNumber: joi.string().length(10).optional(),
});

export const CustomerIdvalid = joi.object({
  userId: joi.string().hex().min(24).max(24).required(),
});
