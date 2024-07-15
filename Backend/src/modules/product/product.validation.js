import joi from "joi";
import { generalFields } from "../../middleware/validation.js";

// Define the custom validation method
const validateVariants = (value, helpers) => {
  try {
    let parsed = JSON.parse(value);
    parsed = parsed.items;
    // Check if the parsed value is an array
    if (!Array.isArray(parsed)) {
      return helpers.error("any.invalid", {
        message: "Parsed value is not an array",
      });
    }

    // Define the schema for each item in the array
    const itemSchema = joi.object({
      itemNo: joi.string().min(3).max(25).required(),
      inStoke: joi.number().min(1).max(10000).required(),
      discount: joi.number().min(0).max(100).optional(),
      price: joi.number().min(1).max(10000).required(),
      finalPrice: joi.number().min(3).max(10000),
      attributes: joi.required(),
    });

    // Validate each item in the array.

    let variantsErrors = [];
    let cnt = 1;
    for (const item of parsed) {
      const { error } = itemSchema.validate(item);
      if (error) {
        const itemNo = `Item number ${cnt}`;
        variantsErrors.push({
          message: `${itemNo} has an error: ${error.details[0].message}`,
        });
      }
      cnt++;
    }

    if (variantsErrors.length > 0) {
      return helpers.error("any.invalid", {
        errorMessages: JSON.stringify(variantsErrors),
      });
    }

    return value; // Return the original string if valid
  } catch (err) {
    return helpers.error("any.invalid", { message: "Invalid JSON string" });
  }
};

export const createProduct = joi.object({
  name: joi.string().min(3).max(25).required(),
  categoryId: joi.string().hex().min(24).max(24).required(),
  subcategoryId: joi.string().hex().min(24).max(24).required(),
  brand: joi.string().min(3).max(25),
  special: joi.string().min(3).max(25),
  specifications: joi.string(),
  variants: joi
    .string()
    .custom(validateVariants, "custom validation")
    .required(), // Use the custom validation here
  file: generalFields.file.required(),
  del: joi.boolean().default(false),
});
export const updateProduct = joi.object({
  id: joi.string().hex().min(24).max(24).required(),
  name: joi.string().min(3).max(25).required(),
  categoryId: joi.string().hex().min(24).max(24).required(),
  subcategoryId: joi.string().hex().min(24).max(24).required(),
  brand: joi.string().min(3).max(25),
  specifications: joi.string(),
  variants: joi
    .string()
    .custom(validateVariants, "custom validation")
    .required(),
  file: generalFields.file,
});

export const updateProductStatus = joi.object({
  id: joi.string().hex().min(24).max(24).required(),
  status: joi.string().valid("Active", "Inactive").default("Active").required(),
});

export const validationid = joi.object({
  id: joi.string().hex().min(24).max(24),
});
