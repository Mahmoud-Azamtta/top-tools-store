import "./auth.css";
import { useEffect, useState, useContext } from "react";
import { useFormik } from "formik";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import Input from "../../../shared/Input/Input";
import { Button, Form } from "react-bootstrap";
import { loginschema as validationSchema } from "../validation/Validate";
import { useMutation } from "react-query";
import { login } from "../../../api/auth";
import OverlayLoading from "../../loading/OverlayLoading";
import { toast } from "react-hot-toast";
import { LoginContext } from "../../../contexts/LoginContext";
import { motion } from "framer-motion";
import BottomUpFade from "../../../animations/BottomUpFade";

function Login() {
  const [backendError, setBackendError] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [searchParams, _] = useSearchParams();
  const [isSubmitted, setSubmitted] = useState(false);
  const navigate = useNavigate();

  const { isAdmin, saveUser } = useContext(LoginContext);

  const toastMessage = searchParams.get("message");

  useEffect(() => {
    if (toastMessage) {
      if (toastMessage === "registered")
        toast.success(
          "تم انشاء حسابك بنجاح, قم بتأكيد البريد الالكتروني قبل تسجيل الدخول",
          {
            duration: 6000,
          },
        );
      else if (toastMessage === "un-auth")
        toast.error("يجب عليك تسجيل الدخول اولا", {
          duration: 6000,
        });
    }
  }, [toastMessage]);

  const mutation = useMutation((userData) => login(userData), {
    onSuccess: (data) => {
      if (data.error) {
        toast.error("فشلت العملية");
        setBackendError(data.error);
      } else {
        saveUser(data.refreshToken, rememberMe ? "loc-strg" : "cookies");
        setSubmitted(true);
        toast.success("تمت العملية بنجاح");
      }
    },
  });

  useEffect(() => {
    if (isSubmitted) {
      if (isAdmin()) {
        navigate("/dashboard");
      } else {
        navigate("/");
      }
    }
  }, [isAdmin, navigate, isSubmitted]);

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    onSubmit: (values) => {
      mutation.mutate(values);
    },
    validationSchema,
  });

  const inputs = [
    {
      id: "email",
      type: "email",
      name: "email",
      title: "البريد الالكتروني",
      placeholder: "أدخل البريد الالكتروني",
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
      title: "كلمة المرور",
      placeholder: "أدخل كلمة المرور",
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
  ];

  const renderedInputs = inputs.map((input, index) => (
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
        <h2 className="auth-title pb-2">تسجيل الدخول</h2>
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
          {renderedInputs}
          <Link
            to={"/auth/send-code"}
            className="d-block my-2 auth-link link-offset-2"
          >
            هل نسيت كلمة المرور؟
          </Link>
          <div className="d-flex gap-2">
            <Form.Check
              type="checkbox"
              name="remember-me"
              className="custom-check"
              checked={rememberMe}
              onChange={() => setRememberMe(!rememberMe)}
            />
            <p
              className="custom-checkbox-label"
              onClick={() => setRememberMe(!rememberMe)}
            >
              هل تريد حفظ عملية تسجيلك؟
            </p>
          </div>
          <Button
            className="auth-button"
            as="input"
            type="submit"
            value="تسجيل الدخول"
          />
        </form>
        <div className="link-side mt-3 pt-2 d-flex justify-content-center align-items-center">
          <Link to={"/auth/register"} className="auth-link link-offset-2">
            قم بإنشاء حساب
          </Link>
        </div>
      </BottomUpFade>
    </section>
  );
}

export default Login;
