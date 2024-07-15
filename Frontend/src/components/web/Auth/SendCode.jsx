import React, { useState, useEffect } from "react";
import { Container, Form, Button, Col, Placeholder } from "react-bootstrap";
import Input from "../../../shared/Input/Input.jsx";
import { useFormik } from "formik";
import { resetPassSchema } from "../validation/Validate.js";
import { toast } from "react-hot-toast";
import { useMutation } from "react-query";
import { sendCode } from "../../../api/auth";
import OverlayLoading from "../../loading/OverlayLoading";
import { useNavigate } from "react-router-dom";
import BottomUpFade from "../../../animations/BottomUpFade.jsx";

const SendCode = () => {
  const [backendError, setBackendError] = useState(null);
  const navigate = useNavigate();

  const mutation = useMutation((email) => sendCode(email), {
    onSuccess: (data) => {
      if (data.error) {
        console.log("Error:", data.error);
        setBackendError(data.error);
      } else {
        toast.success(
          "أرسلنا رمز تأكيد الملكية الى البريد الاكتروني الخاص بك!",
          { duration: 6000 },
        );
        navigate("/auth/forget-password");
      }
    },
  });

  const formik = useFormik({
    initialValues: {
      email: "",
    },
    onSubmit: (values) => {
      mutation.mutate(values);
    },
    validationSchema: resetPassSchema,
  });

  const inputs = [
    //داينمك
    {
      id: "email",
      type: "email",
      name: "email",
      title: "البريد الالكتروني",
      placeholder: "ادخل البريد الالكتروني",
      icon: (
        <svg
          width="18px"
          height="18px"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g id="SVGRepo_bgCarrier" strokeWidth={0} />
          <g
            id="SVGRepo_tracerCarrier"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <g id="SVGRepo_iconCarrier">
            {" "}
            <path
              d="M16 12C16 14.2091 14.2091 16 12 16C9.79086 16 8 14.2091 8 12C8 9.79086 9.79086 8 12 8C14.2091 8 16 9.79086 16 12ZM16 12V13.5C16 14.8807 17.1193 16 18.5 16V16C19.8807 16 21 14.8807 21 13.5V12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21H16"
              stroke="#f19f18"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />{" "}
          </g>
        </svg>
      ),
      value: formik.values.email,
    },
  ];

  const renderInputs = inputs.map((input, index) => (
    <Input
      key={index}
      errorMessage={formik.errors[input.name]}
      onChange={formik.handleChange}
      onBlur={formik.handleBlur}
      isTouched={formik.touched[input.name]}
      {...input}
    />
  ));

  return (
    <section className="auth-wrapper min-vh-100">
      <BottomUpFade className="auth-card bg-white border shadow-sm rounded position-relative">
        <h2 className="auth-title pb-2">تحقق الملكية</h2>
        {backendError && (
          <p className="error-message my-3 text-danger text-center border border-danger rounded py-2">
            {backendError}
          </p>
        )}
        {mutation.isLoading && <OverlayLoading />}
        <form
          className="border-b border-main-dark "
          onSubmit={formik.handleSubmit}
        >
          {renderInputs}

          <Button
            disabled={!formik.isValid || !formik.dirty}
            className="auth-button m-auto mt-3 d-block"
            as="input"
            type="submit"
            value="إرسال البريد الالكتروني"
          />
        </form>
      </BottomUpFade>
    </section>
  );
};

export default SendCode;
