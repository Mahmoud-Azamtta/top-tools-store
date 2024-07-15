import React, { useState } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log(formData);

    setFormData({
      name: "",
      email: "",
      message: "",
    });
  };

  return (
    <Container className="mt-4 py-5 ">
      <h2 className="text-center text-main-dark mb-3 rounded  w-50 m-auto p-2">  تواصل معنا </h2>
      <Row className="justify-content-center">
        <Col xs={12} md={6}>
          <Form
            onSubmit={handleSubmit}
            className="border p-3 mb-5 rounded "
          >
            <Form.Group controlId="formName">
              <Form.Label>الاسم</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="formEmail">
              <Form.Label className="pt-2">البريد الإلكتروني</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="formMessage">
              <Form.Label className="pt-2">الرسالة</Form.Label>
              <Form.Control
                as="textarea"
                rows={5}
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <div className="d-grid gap-2 col-2 mx-auto">
              <Button type="submit" className="my-4 bg-main-dark border-0 ">
                إرسال
              </Button>
            </div>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default Contact;
