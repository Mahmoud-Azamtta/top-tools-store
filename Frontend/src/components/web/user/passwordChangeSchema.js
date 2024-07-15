import * as Yup from 'yup';

const passwordChangeSchema = Yup.object({
  currentPassword: Yup.string()
  .required("كلمة المرور الجديدة مطلوبة")
  .matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/,
    "كلمة المرور يجب أن تكون من 8 خانات على الأقل، وتحتوي على حرف صغير واحد على الأقل، وحرف كبير واحد على الأقل، ورقم واحد على الأقل"
  ),

  newPassword: Yup.string()
    .required("كلمة المرور الجديدة مطلوبة")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/,
      "كلمة المرور يجب أن تكون من 8 خانات على الأقل، وتحتوي على حرف صغير واحد على الأقل، وحرف كبير واحد على الأقل، ورقم واحد على الأقل"
    ),
  checkPassword: Yup.string()
    .required("تأكيد كلمة المرور مطلوب")
    .oneOf([Yup.ref('newPassword'), null], 'كلمات المرور يجب أن تتطابق')
});

export default passwordChangeSchema;
