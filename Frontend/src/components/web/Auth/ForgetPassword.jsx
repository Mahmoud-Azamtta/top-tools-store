import React, { useState } from "react";
import { Button } from "react-bootstrap";
import Input from "../../../shared/Input/Input.jsx";
import { useFormik } from "formik";
import { forgetpassSchema } from "../validation/Validate.js";
import { toast } from "react-hot-toast";
import { useMutation } from "react-query";
import { resetPassword } from "../../../api/auth";
import OverlayLoading from "../../loading/OverlayLoading";
import { useNavigate } from "react-router-dom";
import BottomUpFade from "../../../animations/BottomUpFade.jsx";

const ForgetPassword = () => {
  const [backendError, setBackendError] = useState("");
  const navigate = useNavigate();

  const mutation = useMutation((values) => resetPassword(values), {
    onSuccess: (data) => {
      console.log(data);
      if (data.error) {
        toast.error("فشلت العملية");
        setBackendError(data.error);
      } else {
        toast.success("تم تغيير كلمة المرور بنجاح");
        navigate("/auth/login");
      }
    },
  });

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      checkPassword: "",
      code: "",
    },
    onSubmit: (values) => {
      const submittedData = { ...values };
      delete submittedData.checkPassword;
      mutation.mutate(submittedData);
    },
    validationSchema: forgetpassSchema,
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
    {
      id: "password",
      type: "password",
      name: "password",
      title: " كلمة المرور الجديدة",
      placeholder: "ادخل كلمة المرور",
      icon: (
        <svg
          width="18px"
          height="18px"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
          <g
            id="SVGRepo_tracerCarrier"
            strokeLinecap="round"
            strokeLinejoin="round"
          ></g>
          <g id="SVGRepo_iconCarrier">
            {" "}
            <path
              d="M12 14.5V16.5M7 10.0288C7.47142 10 8.05259 10 8.8 10H15.2C15.9474 10 16.5286 10 17 10.0288M7 10.0288C6.41168 10.0647 5.99429 10.1455 5.63803 10.327C5.07354 10.6146 4.6146 11.0735 4.32698 11.638C4 12.2798 4 13.1198 4 14.8V16.2C4 17.8802 4 18.7202 4.32698 19.362C4.6146 19.9265 5.07354 20.3854 5.63803 20.673C6.27976 21 7.11984 21 8.8 21H15.2C16.8802 21 17.7202 21 18.362 20.673C18.9265 20.3854 19.3854 19.9265 19.673 19.362C20 18.7202 20 17.8802 20 16.2V14.8C20 13.1198 20 12.2798 19.673 11.638C19.3854 11.0735 18.9265 10.6146 18.362 10.327C18.0057 10.1455 17.5883 10.0647 17 10.0288M7 10.0288V8C7 5.23858 9.23858 3 12 3C14.7614 3 17 5.23858 17 8V10.0288"
              stroke="#f19f18"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            ></path>{" "}
          </g>
        </svg>
      ),
      value: formik.values.password,
    },
    {
      id: "checkPassword",
      type: "password",
      name: "checkPassword",
      title: "تأكيد كلمة المرور",
      placeholder: "اعِد كتابة كلمة المرور",
      icon: (
        <svg
          width="18px"
          height="18px"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
          <g
            id="SVGRepo_tracerCarrier"
            strokeLinecap="round"
            strokeLinejoin="round"
          ></g>
          <g id="SVGRepo_iconCarrier">
            {" "}
            <path
              d="M12 14.5V16.5M7 10.0288C7.47142 10 8.05259 10 8.8 10H15.2C15.9474 10 16.5286 10 17 10.0288M7 10.0288C6.41168 10.0647 5.99429 10.1455 5.63803 10.327C5.07354 10.6146 4.6146 11.0735 4.32698 11.638C4 12.2798 4 13.1198 4 14.8V16.2C4 17.8802 4 18.7202 4.32698 19.362C4.6146 19.9265 5.07354 20.3854 5.63803 20.673C6.27976 21 7.11984 21 8.8 21H15.2C16.8802 21 17.7202 21 18.362 20.673C18.9265 20.3854 19.3854 19.9265 19.673 19.362C20 18.7202 20 17.8802 20 16.2V14.8C20 13.1198 20 12.2798 19.673 11.638C19.3854 11.0735 18.9265 10.6146 18.362 10.327C18.0057 10.1455 17.5883 10.0647 17 10.0288M7 10.0288V8C7 5.23858 9.23858 3 12 3C14.7614 3 17 5.23858 17 8V10.0288"
              stroke="#f19f18"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            ></path>{" "}
          </g>
        </svg>
      ),
      value: formik.values.checkPassword,
    },
    {
      id: "code",
      type: "text",
      name: "code",
      title: "رمز التحقق",
      placeholder: "ادخل رمز التحقق",
      icon: (
        <svg
          fill="#f19f18"
          version="1.1"
          id="Capa_1"
          xmlns="http://www.w3.org/2000/svg"
          xmlnsXlink="http://www.w3.org/1999/xlink"
          width="18px"
          height="18px"
          viewBox="0 0 612 612"
          xmlSpace="preserve"
          stroke="#f19f18"
        >
          <g id="SVGRepo_bgCarrier" strokeWidth={0} />
          <g
            id="SVGRepo_tracerCarrier"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <g id="SVGRepo_iconCarrier">
            <g>
              <path d="M310.634,43.714H297.17c-7.194,0-13.026-5.833-13.026-13.026V30.25C284.144,13.543,270.6,0,253.893,0h-0.699 c-16.707,0-30.25,13.543-30.25,30.25v0.438c0,7.194-5.833,13.027-13.026,13.027h-13.464c-14.341,0-25.966,11.625-25.966,25.966 v0.525c0,14.341,11.625,25.966,25.966,25.966h114.183c14.34,0,25.965-11.626,25.965-25.966V69.68 C336.601,55.34,324.976,43.714,310.634,43.714z M253.543,43.714c-7.243,0-13.114-5.872-13.114-13.114 c0-7.243,5.872-13.115,13.114-13.115c7.243,0,13.114,5.872,13.114,13.115C266.657,37.843,260.786,43.714,253.543,43.714z M311.929,550.8H91.8c-19.314,0-34.971-15.657-34.971-34.971V96.171c0-19.314,15.657-34.971,26.228-34.971h70.854 c-0.591,2.904-0.91,5.914-0.91,9.008c0,23.958,19.492,43.45,43.454,43.45h114.178c23.963,0,43.453-19.492,43.453-43.979 c0-2.903-0.311-5.733-0.855-8.479h53.312c28.059,0,43.715,15.657,43.715,34.971v262.728c-2.906-0.181-5.791-0.442-8.742-0.442 c-12.094,0-23.771,1.704-34.973,4.604V157.371H100.543v349.715h201.528C303.029,522.453,306.387,537.162,311.929,550.8z M441.515,384.686c-62.771,0-113.656,50.887-113.656,113.657S378.743,612,441.515,612s113.656-50.887,113.656-113.657 S504.286,384.686,441.515,384.686z M515.782,474.991l-69.943,78.686c-3.445,3.877-8.244,5.865-13.076,5.865 c-3.838,0-7.697-1.255-10.916-3.833l-43.715-34.971c-7.539-6.028-8.764-17.034-2.727-24.573c6.027-7.547,17.037-8.769,24.576-2.731 l30.748,24.598l58.916-66.28c6.408-7.215,17.465-7.872,24.684-1.451C521.55,456.721,522.198,467.769,515.782,474.991z M362.829,306 H135.515c-4.829,0-8.743-3.915-8.743-8.743v-8.743c0-4.829,3.915-8.743,8.743-8.743h227.314c4.828,0,8.744,3.915,8.744,8.743v8.743 C371.571,302.085,367.657,306,362.829,306z M362.829,227.314H135.515c-4.829,0-8.743-3.915-8.743-8.743v-8.743 c0-4.829,3.915-8.743,8.743-8.743h227.314c4.828,0,8.744,3.915,8.744,8.743v8.743C371.571,223.4,367.657,227.314,362.829,227.314z M319.114,375.943h-183.6c-4.829,0-8.743-3.915-8.743-8.743v-8.743c0-4.829,3.915-8.743,8.743-8.743h183.6 c4.83,0,8.744,3.914,8.744,8.743v8.743C327.856,372.028,323.944,375.943,319.114,375.943z M301.629,454.629H135.515 c-4.829,0-8.743-3.915-8.743-8.743v-8.743c0-4.829,3.915-8.743,8.743-8.743h166.115c4.829,0,8.743,3.914,8.743,8.743v8.743 C310.372,450.714,306.458,454.629,301.629,454.629z" />
            </g>
          </g>
        </svg>
      ),
      value: formik.values.code,
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
        <h2 className="auth-title pb-2">تغيير كلمة المرور</h2>
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
            value="تأكيد"
          />
        </form>
      </BottomUpFade>
    </section>
  );
};

export default ForgetPassword;
