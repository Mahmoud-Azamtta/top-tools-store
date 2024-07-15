import React, { useContext } from 'react';
import { Formik, Form } from 'formik';
import { Button, Form as BSForm } from 'react-bootstrap';
import { useMutation } from 'react-query';
import { updatePassword } from '../../../api/user';
import { LoginContext } from '../../../contexts/LoginContext';
import { toast } from "react-hot-toast";
import passwordChangeSchema from './passwordChangeSchema'; //

function PasswordChange() {
  const { userToken } = useContext(LoginContext);

  const updatePasswordMutation = useMutation(newPasswordData => {
    return updatePassword(userToken, newPasswordData);
  });

  return (
    <Formik
      initialValues={{
        currentPassword: '',
        newPassword: '',
        checkPassword: '',
      }}
      validationSchema={passwordChangeSchema}
      onSubmit={(values, { setSubmitting, setFieldError }) => {
        updatePasswordMutation.mutate(values, {
          onSuccess: (data) => {
            // Now correctly capturing the response data
            console.log('Success Data:', data);
            if(data && data.message) {
                toast.success('تم تحديث كلمة السر بنجاح')
                sets
            }
            setSubmitting(false);
          },
          onError: (error) => {
            console.error('Mutation Error:', error);

            const errorMessage = error?.response?.data?.message || "Unknown error occurred";
            console.error('Parsed Error Message:', errorMessage);

            if (errorMessage === "Incorrect current password") {
              setFieldError('currentPassword', 'كلمة المرور الحالية غير صحيحة');
            } else if (errorMessage === "Newpassword and currentPassword same") {
              setFieldError('newPassword', 'كلمة المرور الجديدة لا يجب أن تكون مطابقة للكلمة الحالية');
            } else if (errorMessage === "User not found") {
              alert('المستخدم غير موجود');
            } else {
              alert('فشل في تحديث كلمة المرور. الخطأ: ' + errorMessage);
            }
            setSubmitting(false);
          }
        });
      }}
    >
      {({
        values,
        errors,
        touched,
        handleChange,
        handleBlur,
        handleSubmit,
        isSubmitting,
        setFieldError,
      }) => (
        <Form onSubmit={handleSubmit}>
          <BSForm.Group controlId="currentPassword">
            <BSForm.Label>كلمة المرور الحالية</BSForm.Label>
            <BSForm.Control
              type="password"
              name="currentPassword"
              value={values.currentPassword}
              onChange={handleChange}
              onBlur={handleBlur}
              isInvalid={touched.currentPassword && !!errors.currentPassword}
            />
            <BSForm.Control.Feedback type="invalid">
              {errors.currentPassword}
            </BSForm.Control.Feedback>
          </BSForm.Group>

          <BSForm.Group controlId="newPassword">
            <BSForm.Label>كلمة المرور الجديدة</BSForm.Label>
            <BSForm.Control
              type="password"
              name="newPassword"
              value={values.newPassword}
              onChange={handleChange}
              onBlur={handleBlur}
              isInvalid={touched.newPassword && !!errors.newPassword}
            />
            <BSForm.Control.Feedback type="invalid">
              {errors.newPassword}
            </BSForm.Control.Feedback>
          </BSForm.Group>

          <BSForm.Group controlId="checkPassword">
            <BSForm.Label>تأكيد كلمة المرور الجديدة</BSForm.Label>
            <BSForm.Control
              type="password"
              name="checkPassword"
              value={values.checkPassword}
              onChange={handleChange}
              onBlur={handleBlur}
              isInvalid={touched.checkPassword && !!errors.checkPassword}
            />
            <BSForm.Control.Feedback type="invalid">
              {errors.checkPassword}
            </BSForm.Control.Feedback>
          </BSForm.Group>

          <Button type="submit" className="mt-3 bg-main-dark border-0">
            تغيير كلمة المرور
          </Button>
        </Form>
      )}
    </Formik>
  );
}

export default PasswordChange;
