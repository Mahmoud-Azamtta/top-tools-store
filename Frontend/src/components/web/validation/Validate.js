import * as yup from "yup";

export const registerschema = yup.object({
  email: yup
    .string()
    .required("يجب ادخال البريد الالكتروني")
    .email("عنوان البريد الكتروني غير صالح"),
  userName: yup
    .string()
    .min(3, "إسم المستخدم يجب ان يتكون من 3 خانات علة اأقل")
    .required("يجب ادخال اسم المستخدم"),
  password: yup
    .string()
    .min(8, "كلمة المرور يجب ان تتكون من 8 خانات على الأقل")
    .max(100, "عدد خانات كلمة المرور يجب ان يكون اقل من 100")
    .matches(
      /[a-z]/,
      "[a-z] كلمة المرور يجب ان تحتوي على حرف واحد كبير على الأقل",
    )
    .matches(
      /[A-Z]/,
      "[A-Z] كلمة المرور يجب ان تحتوي على حرف واحد صغير على الأقل",
    )
    .matches(/[0-9]/, "[0-9] كلمة المرور يجب ان تحتوي على رقم واحد على الاقل")
    .required("يجب إدخال كلمة المرور"),
  checkPassword: yup
    .string()
    .required("يجب تأكيد كلمة المرور")
    .oneOf([yup.ref("password"), null], "كلمتا السر غير متطابقتان"),
  addressRequired: yup.boolean(), // this field is only used in the frontend
  city: yup.string().when("addressRequired", {
    is: true,
    then: (schema) => schema.required("يجب ادخال هذا الحقل"),
    otherwise: (schema) => schema,
  }),
  street: yup.string().when("addressRequired", {
    is: true,
    then: (schema) => schema.required("يجب ادخال هذا الحقل"),
    otherwise: (schema) => schema,
  }),
  description: yup.string().when("addressRequired", {
    is: true,
    then: (schema) => schema.required("يجب ادخال هذا الحقل"),
    otherwise: (schema) => schema,
  }),
});

export const loginschema = yup.object({
  email: yup
    .string()
    .required("يجب إدخال البريد الالكتروني")
    .email(" بريد الكتروني غير صالح"),
  password: yup
    .string()
    .min(8, "كلمة المرور تتكون من 8 خانات على الاقل")
    .max(100, "عدد خانات كلمة المرور يجب ان يكون اقل من 100")
    .required("يجب إدخال كلمة المرور"),
});

export const resetPassSchema = yup.object({
  email: yup
    .string()
    .required(" يجب إدخال البريد الإلكتروني ")
    .email("البريد الإلكتروني غير صالح"),
});

export const forgetpassSchema = yup.object({
  email: yup
    .string()
    .required("يجب إدخال البريد الالكتروني")
    .email(" البريد الكتروني غير صالح"),
  password: yup
    .string()
    .min(8, "كلمة المرور يجب ان تتكون من 8 خانات على الأقل")
    .max(100, "عدد خانات كلمة المرور يجب ان يكون اقل من 100")
    .matches(
      /[a-z]/,
      "[a-z] كلمة المرور يجب ان تحتوي على حرف واحد كبير على الأقل",
    )
    .matches(
      /[A-Z]/,
      "[A-Z] كلمة المرور يجب ان تحتوي على حرف واحد صغير على الأقل",
    )
    .matches(/[0-9]/, "[0-9] كلمة المرور يجب ان تحتوي على رقم واحد على الاقل")
    .required("يجب إدخال كلمة المرور"),
  checkPassword: yup
    .string()
    .required("يجب تأكيد كلمة المرور")
    .oneOf([yup.ref("password"), null], "كلمتا السر غير متطابقتان"),
  code: yup
    .string()
    .required("يجب إدخال رمز التحقق")
    .length(4, "يجب أن يكون الرمز مكونًا من 4 أحرف"),
});

export const sendOrder = yup.object({
  city: yup
    .string()
    .max(50, "تعديت الحد الاعلى لعدد الحروف")
    .required("هذا الحقل مطلوب"),
  street: yup
    .string()
    .max(100, "تعديت الحد الاعلى لعدد الحروف")
    .required("هذا الحقل مطلوب"),
  description: yup
    .string()
    .max(200, "تعديت الحد الاعلى لعدد الحروف")
    .required("هذا الحقل مطلوب"),
  phoneNumber: yup
    .string()
    .matches(/^\d{10,15}$/, "الرقم غير صالح")
    .required("الرقم مطلوب"),
  couponName: yup.string().min(3, "كوبون غير صالح").max(25, "كوبون غير صالح"),
  note: yup.string(),
});

export const addReview = yup.object({
  comment: yup
    .string()
    .required("  يُرجى كتابة التعليق الخاص بك")
    .min(4, "يجب أن يكون التعليق على الأقل 4 أحرف"),
  rating: yup
    .number()
    .required("التقييم مطلوب")
    .min(1, "يجب أن يكون التقييم على الأقل 1")
    .max(5, "الحد الأقصى هو 5"),
});
