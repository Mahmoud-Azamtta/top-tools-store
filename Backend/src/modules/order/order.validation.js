import joi from "joi";

export const updateStatus = joi.object({
  status: joi
    .string()
    .valid("pending", "cancelled", "confirmed", "onWay", "delivered")
    .required(),
  orderId: joi.string().min(24).max(24).required(),
});

export const validationid = joi.object({
  id: joi.string().hex().min(24).max(24),
});

export const createOrder = joi.object({
  Address: joi
    .object({
      city: joi.string().min(3).max(20),
      street: joi.string().min(3).max(30),
      description: joi.string().min(3).max(200),
    })
    .required(),
  phoneNumber: joi.string().min(10).required(),
  couponName: joi.string().min(3).max(25).optional(),
});
export const IdCancel = joi.object({
  orderId: joi.string().hex().min(24).max(24),
});
export const updateOrderval = joi.object({
  orderId: joi.string().hex().min(24).max(24),
  Address: joi
    .object({
      city: joi.string().min(3).max(20),
      street: joi.string().min(3).max(30),
      description: joi.string().min(3).max(200),
    })
    .required(),
  phoneNumber: joi.string().min(10).required(),
});

