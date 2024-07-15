import React, { useEffect, useState } from "react";
import LoaderButton from "../../../shared/LoaderButton/LoaderButton";
import Input from "../../../shared/Input/Input";
import { Modal, Button, Row, Col, Form } from "react-bootstrap";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useFormik } from "formik";

const orders = [
  {
    id: 1,
    customerName: "محمود",
    phoneNumber: "0595319725",
    finalPrice: 100,
    paymentMethod: "بطاقة ائتمان",
    location: {
      city: "جنين",
      street: "عابا الشرقية",
      description: "بالقرب من الشارع الالتفافي - بجانب المدرسة",
    },
    products: [
      {
        productName: "المنتج 1",
        itemNo: "EP-12345",
        quantity: 1,
        price: 20,
      },
      {
        productName: "المنتج 2",
        itemNo: "EP-12345",
        quantity: 1,
        price: 30,
      },
      {
        productName: "المنتج 3",
        itemNo: "EP-12345",
        quantity: 2,
        price: 15,
      },
      {
        productName: "المنتج 4",
        itemNo: "EP-12345",
        quantity: 4,
        price: 5,
      },
    ],
  },
  {
    id: 2,
    customerName: "محمود",
    phoneNumber: "0595319725",
    location: {
      city: "جنين",
      street: "عابا الشرقية",
      description: "بالقرب من الشارع الالتفافي - بجانب المدرسة",
    },
    finalPrice: 100,
    paymentMethod: "بطاقة ائتمان",
    products: [
      {
        productName: "المنتج 1",
        itemNo: "EP-12345",
        quantity: 1,
        price: 60,
      },
      {
        productName: "المنتج 2",
        itemNo: "EP-12345",
        quantity: 1,
        price: 50,
      },
      {
        productName: "المنتج 4",
        itemNo: "EP-12345",
        quantity: 3,
        price: 10,
      },
    ],
  },
];

function UpdateOrderDialog() {
  const location = useLocation();
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const { id } = useParams();
  const from = location.state?.from || "/dahsboard/orders";
  console.log(from);

  const selectedOrder = orders.find((order) => order.id == id);

  const onSubmit = (data) => {
    console.log(data);
  };

  const locationDetails = useFormik({
    initialValues: {
      city: selectedOrder.location.city,
      street: selectedOrder.location.street,
      description: selectedOrder.location.description,
    },
  });

  const orderDetails = useFormik({
    initialValues: {
      customerName: selectedOrder.customerName,
      phoneNumber: selectedOrder.phoneNumber,
      paymentmethod: selectedOrder.paymentMethod,
      location: { ...locationDetails.values },
    },
    onSubmit,
  });

  useEffect(() => {
    setShow(true);
  }, []);

  useEffect(() => {
    orderDetails.setFieldValue("location", { ...locationDetails.values });
  }, [locationDetails.values]);

  return (
    <Modal
      size="lg"
      show={show}
      onExited={() => {
        navigate(from);
      }}
    >
      <Modal.Header>
        <Modal.Title>تعديل الطلب</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <form>
          <h3 className="fs-5">معلومات الزبون</h3>
          <Row>
            <Col xs={12} md={6}>
              <Input
                name="customerName"
                id="customerName"
                value={orderDetails.values.customerName}
                onChange={orderDetails.handleChange}
                title="إسم الزبون"
              />
            </Col>
            <Col xs={12} md={6}>
              <Input
                name="phoneNumber"
                id="phoneNumber"
                value={orderDetails.values.phoneNumber}
                onChange={orderDetails.handleChange}
                title="رقم الهاتف"
              />
            </Col>
          </Row>

          <h3 className="fs-5 mt-2">العنوان</h3>
          <Row>
            <Col xs={12} md={6}>
              <Input
                name="city"
                id="city"
                value={locationDetails.values.city}
                onChange={locationDetails.handleChange}
                title="المدينة"
              />
            </Col>

            <Col xs={12} md={6}>
              <Input
                name="street"
                id="street"
                value={locationDetails.values.street}
                onChange={locationDetails.handleChange}
                title="الشارع"
              />
            </Col>
          </Row>
          <Form.Group className="mt-3">
            <Form.Label>وصف المنتج (إختياري)</Form.Label>
            <Form.Control
              className="product-description-field"
              as="textarea"
              placeholder="أدخل وصف المنتج هنا"
              onChange={locationDetails.handleChange}
              value={locationDetails.values.description}
            />
          </Form.Group>
        </form>
      </Modal.Body>

      <Modal.Footer>
        <Button
          variant="secondary"
          onClick={() => {
            setShow(false);
          }}
        >
          إغلاق
        </Button>
        <LoaderButton
          onClick={() => {
            orderDetails.submitForm();
          }}
        >
          تأكيد
        </LoaderButton>
      </Modal.Footer>
    </Modal>
  );
}

export default UpdateOrderDialog;
