import "./home.css";
import React, { useContext } from "react";
import { Accordion, Row, Col, Button } from "react-bootstrap";
import { LoginContext } from "../../../contexts/LoginContext";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { updateStatus, getLatestOrders } from "../../../api/orders";
import NoWrapperLoading from "../../loading/NoWrapperLoading";
import { toast } from "react-hot-toast";

function LatestOrders() {
  const { userToken } = useContext(LoginContext);
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery(
    ["latest-orders"],
    () => getLatestOrders(userToken),
    { enabled: !!userToken },
  );

  const confirmMutation = useMutation(
    (id) => updateStatus(userToken, id, "confirmed"),
    {
      onSuccess: (data) => {
        if (data.error) {
          toast.error(data.error);
        } else {
          toast.success("تم تأكيد الطلب");
          queryClient.invalidateQueries(["latest-orders"]);
        }
      },
    },
  );

  if (isLoading || !userToken) {
    return (
      <div className="position-relative py-5 my-5 d-flex justify-content-center">
        <NoWrapperLoading />
      </div>
    );
  }

  if (data.error) {
    return (
      <div>
        <h2 className="m-0 text-danger my-4 fs-5 text-center">{data.error}</h2>
      </div>
    );
  }

  console.log(data.orders);

  const renderedOrders = data.orders.map((order, index) => (
    <div className="order-wrapper p-2 mt-3 rounded" key={index}>
      <Row className="fw-bold mx-2 border-bottom pb-2">
        <Col xs={4}>
          <p className="m-0 text-center">إسم الزبون</p>
        </Col>
        <Col xs={4}>
          <p className="m-0 text-center">السعر النهائي</p>
        </Col>
        <Col xs={4}>
          <p className="m-0 text-center">طريقة الدفع</p>
        </Col>
      </Row>
      <Row className="mx-2">
        <Col>
          <p className="m-0 text-center">{order.user.userName}</p>
        </Col>
        <Col>
          <p className="m-0 text-center">{order.finalPrice}</p>
        </Col>
        <Col>
          <p className="m-0 text-center">{order.paymentType}</p>
        </Col>
      </Row>
      <Accordion className="mt-2">
        <Accordion.Item key={index} eventKey={index}>
          <Accordion.Header className="d-flex justify-content-between">
            <h3 className="fs-5 m-0">المنتجات</h3>
          </Accordion.Header>
          <Accordion.Body>
            <Row className="border-bottom fw-bold">
              <Col
                xs={3}
                className="d-flex justify-content-center align-items-center"
              >
                <p>المنتج</p>
              </Col>
              <Col
                xs={3}
                className="d-flex justify-content-center align-items-center"
              >
                <p>رقم المنتج</p>
              </Col>
              <Col
                xs={1}
                className="d-flex justify-content-center align-items-center"
              >
                <p>الكمية</p>
              </Col>
              <Col
                xs={2}
                className="d-flex justify-content-center align-items-center"
              >
                <p>السعر</p>
              </Col>
              <Col
                xs={3}
                className="d-flex justify-content-center align-items-center"
              >
                <p>السعر الكلي</p>
              </Col>
            </Row>
            {order?.products.map((product, index) => (
              <Row key={index} className="mt-2">
                <Col
                  xs={3}
                  className="d-flex justify-content-center align-items-center"
                >
                  <p className="m-0">{product.productName}</p>
                </Col>
                <Col
                  xs={3}
                  className="d-flex justify-content-center align-items-center"
                >
                  <p className="m-0 text-center">{product.itemNo}</p>
                </Col>
                <Col
                  xs={1}
                  className="d-flex justify-content-center align-items-center"
                >
                  <p className="m-0">{product.quantity}</p>
                </Col>
                <Col
                  xs={2}
                  className="d-flex justify-content-center align-items-center"
                >
                  <p className="m-0">₪{product.unitPrice}</p>
                </Col>
                <Col
                  xs={3}
                  className="d-flex justify-content-center align-items-center"
                >
                  <p className="m-0">₪{product.finalPrice}</p>
                </Col>
              </Row>
            ))}
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
      <div className="d-flex justify-content-around mt-2">
        <Button
          variant="success"
          onClick={() => confirmMutation.mutate(order._id)}
        >
          تأكيد الطلب
          <svg
            viewBox="0 0 24 24"
            width="24px"
            height="24px"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            stroke="#ffffff"
            className="me-2"
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
                d="M4 12.6111L8.92308 17.5L20 6.5"
                stroke="#ffffff"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />{" "}
            </g>
          </svg>
        </Button>
        <Button variant="danger">
          إلغاء الطلب
          <svg
            width="24px"
            height="24px"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="me-2"
          >
            <g id="SVGRepo_bgCarrier" strokeWidth={0} />
            <g
              id="SVGRepo_tracerCarrier"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <g id="SVGRepo_iconCarrier">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M19.207 6.207a1 1 0 0 0-1.414-1.414L12 10.586 6.207 4.793a1 1 0 0 0-1.414 1.414L10.586 12l-5.793 5.793a1 1 0 1 0 1.414 1.414L12 13.414l5.793 5.793a1 1 0 0 0 1.414-1.414L13.414 12l5.793-5.793z"
                fill="#ffffff"
              />
            </g>
          </svg>
        </Button>
      </div>
    </div>
  ));

  return (
    <div>
      <h2 className="fs-4 border-bottom pb-2 my-2 fw-bold">أحدث الطلبيات</h2>
      {data.orders.length > 0 ? (
        <>{renderedOrders}</>
      ) : (
        <p className="text-secondary text-center mt-4 fw-bold">لا يوجد طلبات</p>
      )}
    </div>
  );
}

export default LatestOrders;
