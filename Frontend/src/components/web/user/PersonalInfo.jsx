import React, { useContext, useEffect, useState } from "react";
import { Container, Form, Button, Col, Image, Modal } from "react-bootstrap";
import { editUserData, getUserData } from "../../../api/user.js";
import { useMutation, useQuery, useQueryClient } from "react-query";
import Loading from "../../loading/Loading.jsx";
import { LoginContext } from "../../../contexts/LoginContext.jsx";
import { Formik } from "formik";
import personalInfoValidationSchema from "./personalInfoValidationSchema.js";
import './user.css'

import * as Yup from "yup";
import { Link } from "react-router-dom";
import PasswordChange from "./PasswordChange.jsx";

function PersonalInfo() {
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const { userToken } = useContext(LoginContext);
  const queryClient = useQueryClient();

  const [initialValues, setInitialValues] = useState({
    userName: "",
    email: "",
    city: "",
    street: "",
    description: "",
    phoneNumber: "",
  });

  const {
    data: userData,
    isLoading: userDataLoading,
    error: userDataError,
  } = useQuery(["userData", userToken], () => getUserData(userToken), {
    enabled: !!userToken,
  });

  useEffect(() => {
    if (userData) {
      setInitialValues({
        userName: userData?.user?.userName || "",
        email: userData?.user?.email || "",
        city: userData?.user?.Address?.city || "",
        street: userData?.user?.Address?.street || "",
        description: userData?.user?.Address?.description || "",
        phoneNumber: userData?.user?.phoneNumber || "",
      });
    }
  }, [userData]);

  const editUserDataMutation = useMutation(
    (values) =>
      editUserData(
        userToken,
        values.userName,
        values.email,
        values.city,
        values.street,
        values.description,
        values.phoneNumber
      ),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["userData", userToken]);
      },
    }
  );
  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  if (userDataLoading) {
    return <Loading />;
  }

  if (userDataError) {
    return (
      <section className="vh-100 d-flex justify-content-center align-items-center fs-1">
        <h2>خطأ في استرجاع البيانات ...</h2>
      </section>
    );
  }
  console.log(userData);

  return (
    <section className="py-5 PersonalInfo">
      <h2 className="text-main-dark mb-4">المعلومات الشخصية</h2>
      <hr />
      <Col xs={12} md={12} xl={6} className="">
        {editMode ? (
          <Formik
            initialValues={initialValues}
            validationSchema={personalInfoValidationSchema}
            onSubmit={(values) => {
              editUserDataMutation.mutate(values);
              setEditMode(false);
            }}
          >
            {({ values, errors, touched, handleChange, handleSubmit }) => (
              <Form onSubmit={handleSubmit}>
                <Image
                  src="/public/images/user_profile.jpg"
                  width={"150px"}
                  height={"150px"}
                  roundedCircle
                  className="mb-3"
                />
                <Form.Group controlId="username">
                  <Form.Label>اسم المستخدم</Form.Label>
                  <Form.Control
                    type="text"
                    name="userName"
                    value={values.userName}
                    onChange={handleChange}
                    isInvalid={touched.userName && !!errors.userName}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.userName}
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group controlId="email">
                  <Form.Label>البريد الإلكتروني</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={values.email}
                    readOnly
                  />
                </Form.Group>

                <Form.Label>العنوان</Form.Label>
                <fieldset className="border p-2">
                  <Form.Group className="w-75" controlId="city">
                    <Form.Label>المدينة</Form.Label>
                    <Form.Control
                      type="text"
                      name="city"
                      value={values.city}
                      onChange={handleChange}
                      isInvalid={touched.city && !!errors.city}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.city}
                    </Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group className="w-75" controlId="street">
                    <Form.Label>الشارع</Form.Label>
                    <Form.Control
                      type="text"
                      name="street"
                      value={values.street}
                      onChange={handleChange}
                      isInvalid={touched.street && !!errors.street}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.street}
                    </Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group className="w-75" controlId="description">
                    <Form.Label>وصف العنوان</Form.Label>
                    <Form.Control
                      type="text"
                      name="description"
                      value={values.description}
                      onChange={handleChange}
                      isInvalid={touched.description && !!errors.description}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.description}
                    </Form.Control.Feedback>
                  </Form.Group>
                </fieldset>
                <Form.Group controlId="phoneNumber">
                  <Form.Label>الهاتف</Form.Label>
                  <Form.Control
                    type="text"
                    name="phoneNumber"
                    value={values.phoneNumber}
                    onChange={handleChange}
                    isInvalid={touched.phoneNumber && !!errors.phoneNumber}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.phoneNumber}
                  </Form.Control.Feedback>
                </Form.Group>
                <Button variant="dark" type="submit" className="mt-4">
                  حفظ التغييرات
                </Button>
                <Button
                  variant="secondary"
                  className="mt-4 me-3"
                  onClick={() => setEditMode(false)}
                >
                  إلغاء
                </Button>
              </Form>
            )}
          </Formik>
        ) : (
          <div>
            <Image
              src="/src/components/web/user/user_profile.jpg"
              width={"150px"}
              height={"150px"}
              roundedCircle
              className="mb-3"
            />
            <p>
              <strong>اسم المستخدم:</strong> {userData?.user?.userName}
            </p>
            <p>
              <strong>البريد الإلكتروني:</strong> {userData?.user?.email}
            </p>
            <p>
              <strong>المدينة:</strong> {userData?.user?.Address?.city}
            </p>
            <p>
              <strong>الشارع:</strong> {userData?.user?.Address?.street}
            </p>
            <p>
              <strong>وصف العنوان:</strong>{" "}
              {userData?.user?.Address?.description}
            </p>
            <p>
              <strong>الهاتف:</strong> {userData?.user?.phoneNumber}
            </p>
            <Button variant="dark" onClick={() => setEditMode(true)}>
               تعديل معلوماتي
            </Button>
            <Button variant="secondary" className="me-2 " onClick={handleShowModal}>
              تغيير كلمة المرور
            </Button>
          
          </div>
        )}
      </Col>
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header >
          <Modal.Title>تغيير كلمة المرور</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <PasswordChange />
        </Modal.Body>
      </Modal>
    </section>
  );
}

export default PersonalInfo;
