import * as Yup from 'yup';

const customerValidationSchema = Yup.object({
  userName: Yup.string()
    .matches(/^[a-zA-Z0-9]+$/, "اسم المستخدم يجب أن يحتوي على حروف وأرقام فقط")
    .min(3, "اسم المستخدم يجب أن يكون على الأقل 3 حروف")
    .max(20, "اسم المستخدم يجب أن يكون أقل من 20 حرف")
    .required("اسم المستخدم مطلوب"),
  email: Yup.string()
    .email("رجاءً إدخال بريد إلكتروني صحيح")
    .required("البريد الإلكتروني مطلوب"),
  city: Yup.string()
    .min(3, "المدينة يجب أن تكون على الأقل 3 حروف")
    .max(20, "المدينة يجب أن تكون أقل من 20 حرف"),
  street: Yup.string()
    .min(3, "الشارع يجب أن يكون على الأقل 3 حروف")
    .max(30, "الشارع يجب أن يكون أقل من 30 حرف"),
  description: Yup.string()
    .min(3, "الوصف يجب أن يكون على الأقل 3 حروف")
    .max(200, "الوصف يجب أن يكون أقل من 200 حرف"),
  phoneNumber: Yup.string()
    .length(10, "رقم الهاتف يجب أن يكون 10 أرقام"),
});

export default customerValidationSchema;
