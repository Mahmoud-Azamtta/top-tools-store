import joi from "joi";

export const generalFields = {
  email: joi.string().email().required().messages({
    "string.empty": "email is required",
    "string.email": "plz enter a valid email",
  }),
  password: joi
    .string()
    .pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)[a-zA-Z\\d]{8,100}$"))
    .required()
    .messages({
      "string.empty": "password is required",
      "string.pattern.base":
        "كلمة المرور يجب أن تكون من 8 خانات على الأقل، وتحتوي على حرف صغير واحد على الأقل، وحرف كبير واحد على الأقل، ورقم واحد على الأقل",
    }),
  file: joi.object({
    size: joi.number().max(50000000).required(),
    path: joi.string().required(),
    filename: joi.string().required(),
    destination: joi.string().required(),
    mimetype: joi.string().required(),
    encoding: joi.string().required(),
    originalname: joi.string().required(),
    fieldname: joi.string().required(),
    dest: joi.string(),
  }),
};

export const validation = (schema) => {
  return (req, res, next) => {
    const inputsData = { ...req.body, ...req.params, ...req.query };
    if (req.file || req.files) {
      inputsData.file = req.file || req.files;
    }
    const validationResult = schema.validate(inputsData, { abortEarly: false });
    if (validationResult.error?.details) {
      return res.status(400).json({
        message: "validation error",
        validationError: validationResult.error?.details,
      });
    }
    next();
  };
};
