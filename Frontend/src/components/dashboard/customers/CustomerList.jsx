import React, { useContext, useState } from "react";
import {
  Container,
  Row,
  Col,
  Table,
  Button,
  Modal,
  Form,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import "./customers.css";
import { LoginContext } from "../../../contexts/LoginContext.jsx";
import { useMutation, useQuery, useQueryClient } from "react-query";
import Loading from "../../loading/Loading.jsx";
import { deleteCustomer, getCustomer, updateCustomer, searchCustomer } from "../../../api/customers.js";
import customerValidationSchema from './customerValidationSchema.js'; 


const CustomerList = () => {
  const [customers, setCustomers] = useState([]);
  const [searchCustomers, setSearchCustomers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [editCustomer, setEditCustomer] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  const { userToken } = useContext(LoginContext);
  const queryClient = useQueryClient();

  // const validationSchema = Yup.object({
  //   userName: Yup.string()
  //     .matches(/^[a-zA-Z0-9]+$/, "اسم المستخدم يجب أن يحتوي على حروف وأرقام فقط")
  //     .min(3, "اسم المستخدم يجب أن يكون على الأقل 3 حروف")
  //     .max(20, "اسم المستخدم يجب أن يكون أقل من 20 حرف")
  //     .required("اسم المستخدم مطلوب"),
  //   email: Yup.string()
  //     .email("رجاءً إدخال بريد إلكتروني صحيح")
  //     .required("البريد الإلكتروني مطلوب"),
  //   city: Yup.string()
  //     .min(3, "المدينة يجب أن تكون على الأقل 3 حروف")
  //     .max(20, "المدينة يجب أن تكون أقل من 20 حرف"),
  //   street: Yup.string()
  //     .min(3, "الشارع يجب أن يكون على الأقل 3 حروف")
  //     .max(30, "الشارع يجب أن يكون أقل من 30 حرف"),
  //   description: Yup.string()
  //     .min(3, "الوصف يجب أن يكون على الأقل 3 حروف")
  //     .max(200, "الوصف يجب أن يكون أقل من 200 حرف"),
  //     phoneNumber: Yup.string()
  //     .length(10, "رقم الهاتف يجب أن يكون 10 أرقام"),
  // });

  const {
    data: customerData,
    isLoading: customerLoading,
    error: customerError,
  } = useQuery(["customer", userToken], () => getCustomer(userToken), {
    enabled: !!userToken,
    onSuccess: (data) => {
      setCustomers(data.users);
      setSearchCustomers(data.users);
    },
  });

  const removeCustomerMutation = useMutation(
    ({ userToken, customerId }) => deleteCustomer(userToken, customerId),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["customer", userToken]);
      },
      onError: (error) => {
        console.error("Error deleting customer:", error);
      }
    }
  );

  const editCustomerMutation = useMutation(
    ({ userToken, customerId, values }) => updateCustomer(
      userToken,
      customerId,
      values.userName,
      values.email,
      values.city,
      values.street,
      values.description,
      values.phoneNumber
    ),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["customer", userToken]);
        handleCloseEditModal();
      },
      onError: (error) => {
        console.error("Error updating customer:", error);
      }
    }
  );

  const searchCustomerQuery = useMutation(
    ({userToken, searchQuery}) => searchCustomer(userToken, searchQuery),
    {
      onSuccess: (data) => {
        console.log(data)
        setSearchCustomers(data);
      },
    }

  );

  const handleDeleteCustomer = (customerId) => {
    removeCustomerMutation.mutate({ userToken, customerId });
  };

  const handleEditCustomer = (customer) => {
    setEditCustomer(customer);
    setShowEditModal(true);
  };

  const handleCloseEditModal = () => {
    setEditCustomer(null);
    setShowEditModal(false);
  };

  const handleSearch = () => {
    console.log("Search Query:", searchQuery);
    if (searchQuery === "") {
      setSearchCustomers(customers);
    } else {
      searchCustomerQuery.mutate({userToken, searchQuery});
    }
  };

  const formik = useFormik({
    initialValues: {
      userName: editCustomer ? editCustomer.userName : "",
      email: editCustomer ? editCustomer.email : "",
      city: editCustomer ? editCustomer.Address?.city : "",
      street: editCustomer ? editCustomer.Address?.street : "",
      description: editCustomer ? editCustomer.Address?.description : "",
      phoneNumber: editCustomer ? editCustomer.phoneNumber : "",
    },
    validationSchema: customerValidationSchema,
    onSubmit: (values) => {
      editCustomerMutation.mutate({ userToken, customerId: editCustomer._id, values });
    },
    enableReinitialize: true,
  });

  if (customerLoading) {
    return <Loading />;
  }

  if (customerError) {
    return (
      <section className="vh-100 d-flex justify-content-center align-items-center fs-1">
        <h2>خطأ في استرجاع البيانات ...</h2>
      </section>
    );
  }

  return (
    <Container className="py-4">
      <h2 className="border-bottom pb-3">الزبائن</h2>
      <Row>
        <Col>
          <Form.Group as={Row} controlId="formSearch" className="mt-5 mb-3">
            <Col xs={5} className="search-customer">
              <Form.Control
                type="text"
                placeholder="ابحث عن الزبون ..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="shadow-none"
              />
            </Col>
            <Col xs={2} className="d-flex align-items-start position-relative">
              <Button
                onClick={handleSearch}
                className="position-absolute start-100 rounded-end-0 bg-main-dark border-0"
              >
                <svg
                  width="20px"
                  height="20px"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  stroke="#ffffff"
                >
                  <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                  <g
                    id="SVGRepo_tracerCarrier"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  ></g>
                  <g id="SVGRepo_iconCarrier">
                    <path
                      d="M15.7955 15.8111L21 21M18 10.5C18 14.6421 14.6421 18 10.5 18C6.35786 18 3 14.6421 3 10.5C3 6.35786 6.35786 3 10.5 3C14.6421 3 18 6.35786 18 10.5Z"
                      stroke="#ffffff"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    ></path>
                  </g>
                </svg>
              </Button>
            </Col>
          </Form.Group>

          <Table responsive className="text-center table-hover ">
            <thead>
              <tr>
                <th>#</th>
                <th>الاسم</th>
                <th>البريد الإلكتروني</th>
                <th>العنوان</th>
                <th>الهاتف</th>
                <th>إجمالي الطلبيات</th>
                <th>الإجراءات</th>
              </tr>
            </thead>
            <tbody className="body-list-customer">
              {searchCustomers?.map((customer, index) => (
                <tr key={customer._id} className="">
                  <td>{index + 1}</td>
                  <td>{customer.userName}</td>
                  <td>{customer.email}</td>
                  <td>{customer.Address?.city} - {customer.Address?.street}</td>
                  <td>{customer.phoneNumber ? customer.phoneNumber :'-'}</td>
                  <td>
                    {customer.numOfOrder}
                    <Link
                      size="sm"
                      to={`/dashboard/customers/customerOrders/${customer._id}`}
                      className="float-center mx-3"
                      title="إظهار طلبات هذا الزبون"
                    >
                      <svg
                        width="22px"
                        height="22px"
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
                          <g id="Edit / Show">
                            <g id="Vector">
                              <path
                                d="M3.5868 13.7788C5.36623 15.5478 8.46953 17.9999 12.0002 17.9999C15.5308 17.9999 18.6335 15.5478 20.413 13.7788C20.8823 13.3123 21.1177 13.0782 21.2671 12.6201C21.3738 12.2933 21.3738 11.7067 21.2671 11.3799C21.1177 10.9218 20.8823 10.6877 20.413 10.2211C18.6335 8.45208 15.5308 6 12.0002 6C8.46953 6 5.36623 8.45208 3.5868 10.2211C3.11714 10.688 2.88229 10.9216 2.7328 11.3799C2.62618 11.7067 2.62618 12.2933 2.7328 12.6201C2.88229 13.0784 3.11714 13.3119 3.5868 13.7788Z"
                                stroke="#000"
                                strokeWidth="2.57"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                              <path
                                d="M10 12C10 13.1046 10.8954 14 12 14C13.1046 14 14 13.1046 14 12C14 10.8954 13.1046 10 12 10C10.8954 10 10 10.8954 10 12Z"
                                stroke="#000"
                                strokeWidth={2}
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </g>
                          </g>
                        </g>
                      </svg>
                    </Link>
                  </td>
                  <td>
                    <Button
                      variant="dark"
                      size="sm"
                      onClick={() => handleEditCustomer(customer)}
                      className="ms-2"
                      title="تعديل معلومات الزبون"
                    >
                      <svg
                        width="15px"
                        height="15px"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
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
                            fill="#ffffff"
                            fillRule="evenodd"
                            d="M15.198 3.52a1.612 1.612 0 012.223 2.336L6.346 16.421l-2.854.375 1.17-3.272L15.197 3.521zm3.725-1.322a3.612 3.612 0 00-5.102-.128L3.11 12.238a1 1 0 00-.253.388l-1.8 5.037a1 1 0 001.072 1.328l4.8-.63a1 1 0 00.56-.267L18.8 7.304a3.612 3.612 0 00.122-5.106zM12 17a1 1 0 100 2h6a1 1 0 100-2h-6z"
                          ></path>{" "}
                        </g>
                      </svg>
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDeleteCustomer(customer._id)}
                      title="حذف الزبون"
                    >
                      <svg
                        width="15px"
                        height="15px"
                        viewBox="0 0 1024 1024"
                        className="icon"
                        version="1.1"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="#000000"
                      >
                        <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                        <g
                          id="SVGRepo_tracerCarrier"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        ></g>
                        <g id="SVGRepo_iconCarrier">
                          <path
                            d="M960 160h-291.2a160 160 0 0 0-313.6 0H64a32 32 0 0 0 0 64h896a32 32 0 0 0 0-64zM512 96a96 96 0 0 1 90.24 64h-180.48A96 96 0 0 1 512 96zM844.16 290.56a32 32 0 0 0-34.88 6.72A32 32 0 0 0 800 320a32 32 0 1 0 64 0 33.6 33.6 0 0 0-9.28-22.72 32 32 0 0 0-10.56-6.72zM832 416a32 32 0 0 0-32 32v96a32 32 0 0 0 64 0v-96a32 32 0 0 0-32-32zM832 640a32 32 0 0 0-32 32v224a32 32 0 0 1-32 32H256a32 32 0 0 1-32-32V320a32 32 0 0 0-64 0v576a96 96 0 0 0 96 96h512a96 96 0 0 0 96-96v-224a32 32 0 0 0-32-32z"
                            fill="#ffffff"
                          ></path>
                          <path
                            d="M384 768V352a32 32 0 0 0-64 0v416a32 32 0 0 0 64 0zM544 768V352a32 32 0 0 0-64 0v416a32 32 0 0 0 64 0zM704 768V352a32 32 0 0 0-64 0v416a32 32 0 0 0 64 0z"
                            fill="#ffffff"
                          ></path>
                        </g>
                      </svg>
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Col>
      </Row>

      <Modal show={showEditModal} onHide={handleCloseEditModal}>
        <Modal.Header>
          <Modal.Title className="m-auto">تعديل بيانات الزبون</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={formik.handleSubmit}>
            <Form.Group controlId="formCustomerName" className="mb-3">
              <Form.Label>اسم الزبون:</Form.Label>
              <Form.Control
                type="text"
                name="userName"
                value={formik.values.userName}
                onChange={formik.handleChange}
                isInvalid={formik.touched.userName && formik.errors.userName}
              />
              <Form.Control.Feedback type="invalid">
                {formik.errors.userName}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group controlId="formCustomerEmail" className="mb-3">
              <Form.Label>البريد الإلكتروني:</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={formik.values.email}
                onChange={formik.handleChange}
                isInvalid={formik.touched.email && formik.errors.email}
              />
              <Form.Control.Feedback type="invalid">
                {formik.errors.email}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group controlId="formCustomerCity" className="mb-3">
              <Form.Label>المدينة:</Form.Label>
              <Form.Control
                type="text"
                name="city"
                value={formik.values.city}
                onChange={formik.handleChange}
                isInvalid={formik.touched.city && formik.errors.city}
              />
              <Form.Control.Feedback type="invalid">
                {formik.errors.city}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group controlId="formCustomerStreet" className="mb-3">
              <Form.Label>الشارع:</Form.Label>
              <Form.Control
                type="text"
                name="street"
                value={formik.values.street}
                onChange={formik.handleChange}
                isInvalid={formik.touched.street && formik.errors.street}
              />
              <Form.Control.Feedback type="invalid">
                {formik.errors.street}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group controlId="formCustomerDescription" className="mb-3">
              <Form.Label>الوصف:</Form.Label>
              <Form.Control
                type="text"
                name="description"
                value={formik.values.description}
                onChange={formik.handleChange}
                isInvalid={formik.touched.description && formik.errors.description}
              />
              <Form.Control.Feedback type="invalid">
                {formik.errors.description}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group controlId="formCustomerPhone" className="mb-3">
              <Form.Label>الهاتف:</Form.Label>
              <Form.Control
                type="text"
                name="phoneNumber"
                value={formik.values.phoneNumber}
                onChange={formik.handleChange}
                isInvalid={formik.touched.phoneNumber && formik.errors.phoneNumber}
              />
              <Form.Control.Feedback type="invalid">
                {formik.errors.phoneNumber}
              </Form.Control.Feedback>
            </Form.Group>
            
            <Modal.Footer />
            <Button variant="warning" type="submit">
              حفظ
            </Button>
            <Button
              variant="secondary"
              className="me-2"
              onClick={handleCloseEditModal}
            >
              إلغاء
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default CustomerList;
