import "./auth.css";
import { useState } from "react";
import { useFormik } from "formik";
import { Link, useNavigate } from "react-router-dom";
import Input from "../../../shared/Input/Input";
// import LoaderButton from "../../../shared/LoaderButton/LoaderButton";
import { registerschema as validationSchema } from "../validation/Validate";
import { Form, Row, Col, Button, Alert } from "react-bootstrap";
import Dropdown from "../../../animations/Dropdown";
import { useMutation } from "react-query";
import { register } from "../../../api/auth";
import OverlayLoading from "../../loading/OverlayLoading";
import { toast } from "react-hot-toast";
import BottomUpFade from "../../../animations/BottomUpFade";

function Register() {
  const [backendError, setBackendError] = useState("");
  const [isAddressActive, setIsAddressActive] = useState(false);
  const navigate = useNavigate();

  const mutation = useMutation((userData) => register(userData), {
    onSuccess: (data) => {
      if (data.error) {
        toast.error("فشلت العملية");
        setBackendError(data.error);
      } else {
        toast.success("تمت العملية بنجاح");
        navigate(`/auth/login?message=registered`);
      }
    },
  });

  const onSubmit = (values) => {
    let normalizedValues = values;
    if (values.addressRequired) {
      normalizedValues = {
        ...values,
        Address: {
          city: values.city,
          street: values.street,
          description: values.description,
        },
      };
    }
    delete normalizedValues.city;
    delete normalizedValues.street;
    delete normalizedValues.description;
    delete normalizedValues.addressRequired;

    mutation.mutate(normalizedValues);
  };

  const formik = useFormik({
    initialValues: {
      email: "",
      userName: "",
      password: "",
      checkPassword: "",
      city: "",
      street: "",
      description: "",
      addressRequired: false,
    },
    onSubmit,
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
      id: "userName",
      type: "text",
      name: "userName",
      title: "إسم المستخدم",
      placeholder: "أدخل اسم المستخدم",
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
              d="M5 21C5 17.134 8.13401 14 12 14C15.866 14 19 17.134 19 21M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z"
              stroke="#f19f18"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            ></path>{" "}
          </g>
        </svg>
      ),
      value: formik.values.userName,
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
    <section className=" auth-wrapper min-vh-100">
      <BottomUpFade className="auth-card bg-white auth-card border shadow-sm rounded position-relative">
        <h2 className="auth-title pb-2">إنشاء حساب جديد</h2>
        {backendError && (
          <p className="error-message my-3 text-danger text-center border border-danger rounded py-2">
            {backendError}
          </p>
        )}
        {mutation.isLoading && <OverlayLoading />}
        <form
          className="border-b border-main-dark "
          onSubmit={/* TODO handle submition  */ formik.handleSubmit}
        >
          {renderedInputs}
          <div className="d-flex gap-2">
            <Form.Check
              type="checkbox"
              name="addressRequired"
              className="custom-check"
              value={formik.values.addressRequired}
              onChange={formik.handleChange}
            />
            <p
              className="custom-checkbox-label"
              onClick={() => {
                formik.setFieldValue(
                  "addressRequired",
                  !formik.values.addressRequired, // FIXME: Works fine but the actuall check box does not get checked
                );
              }}
            >
              هل تريد ادخال العنوان؟ (إختياري, بإمكانك ادخال العنوان عند اول
              عملية طلب)
            </p>
          </div>
          <Dropdown condition={formik.values.addressRequired}>
            <Row className="mb-3 border-top p-2">
              <Col xs={6}>
                <Input
                  placeholder="قم بإدخال المدينة"
                  type="text"
                  name="city"
                  id="city"
                  value={formik.values.city}
                  errorMessage={formik.errors.city}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  isTouched={formik.touched.city}
                  title="المدينة"
                  icon={
                    <svg
                      fill="#f19f18"
                      width="18px"
                      height="18px"
                      viewBox="0 0 32 32"
                      version="1.1"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g id="SVGRepo_bgCarrier" strokeWidth="{0}" />
                      <g
                        id="SVGRepo_tracerCarrier"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <g id="SVGRepo_iconCarrier">
                        <path d="M16.114-0.011c-6.559 0-12.114 5.587-12.114 12.204 0 6.93 6.439 14.017 10.77 18.998 0.017 0.020 0.717 0.797 1.579 0.797h0.076c0.863 0 1.558-0.777 1.575-0.797 4.064-4.672 10-12.377 10-18.998 0-6.618-4.333-12.204-11.886-12.204zM16.515 29.849c-0.035 0.035-0.086 0.074-0.131 0.107-0.046-0.032-0.096-0.072-0.133-0.107l-0.523-0.602c-4.106-4.71-9.729-11.161-9.729-17.055 0-5.532 4.632-10.205 10.114-10.205 6.829 0 9.886 5.125 9.886 10.205 0 4.474-3.192 10.416-9.485 17.657zM16.035 6.044c-3.313 0-6 2.686-6 6s2.687 6 6 6 6-2.687 6-6-2.686-6-6-6zM16.035 16.044c-2.206 0-4.046-1.838-4.046-4.044s1.794-4 4-4c2.207 0 4 1.794 4 4 0.001 2.206-1.747 4.044-3.954 4.044z" />
                      </g>
                    </svg>
                  }
                />
              </Col>
              <Col xs={6}>
                <Input
                  placeholder="قم بإدخال الشارع"
                  type="text"
                  name="street"
                  id="street"
                  value={formik.values.street}
                  errorMessage={formik.errors.street}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  isTouched={formik.touched.street}
                  title="الشارع"
                  icon={
                    <svg
                      fill="#f19f18"
                      width="18px"
                      height="18px"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g id="SVGRepo_bgCarrier" strokeWidth={0} />
                      <g
                        id="SVGRepo_tracerCarrier"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <g id="SVGRepo_iconCarrier">
                        <path d="M7.97,2.242l-5,20A1,1,0,0,1,2,23a1.025,1.025,0,0,1-.244-.03,1,1,0,0,1-.727-1.212l5-20a1,1,0,1,1,1.94.484Zm10-.484a1,1,0,1,0-1.94.484l5,20A1,1,0,0,0,22,23a1.017,1.017,0,0,0,.243-.03,1,1,0,0,0,.728-1.212ZM12,1a1,1,0,0,0-1,1V6a1,1,0,0,0,2,0V2A1,1,0,0,0,12,1Zm0,7.912a1,1,0,0,0-1,1v4.176a1,1,0,1,0,2,0V9.912A1,1,0,0,0,12,8.912ZM12,17a1,1,0,0,0-1,1v4a1,1,0,0,0,2,0V18A1,1,0,0,0,12,17Z" />
                      </g>
                    </svg>
                  }
                />
              </Col>
              <Col xs={12}>
                <Form.Group>
                  <Form.Label className="text-main-dark">الوصف</Form.Label>
                  <Form.Control
                    className={`address-description-textarea ${
                      formik.touched.description &&
                      formik.errors.description &&
                      "error-style"
                    }`}
                    name="description"
                    id="description"
                    value={formik.values.description}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    as="textarea"
                    rows={3}
                    placeholder="وصف العنوان..."
                  />
                </Form.Group>
                {formik.touched.description && formik.errors.description && (
                  <Form.Control.Feedback type="invlaid" className="text-danger">
                    {formik.errors.description}
                  </Form.Control.Feedback>
                )}
              </Col>
            </Row>
          </Dropdown>
          <Button
            as="input"
            className="auth-button"
            type="submit"
            value="إنشاء حساب"
          />
        </form>
        <div className="link-side mt-3 pt-2 d-flex justify-content-center align-items-center">
          <Link to={"/auth/login"} className="auth-link link-offset-2">
            هل تملك حساب؟ قم بتسجيل الدخول
          </Link>
        </div>
      </BottomUpFade>
    </section>
  );
}

export default Register;
