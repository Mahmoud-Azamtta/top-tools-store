import { useLocation, useNavigate } from "react-router-dom";
import { Row, Col, Accordion, Button } from "react-bootstrap";
import { useMutation, useQueryClient } from "react-query";
import { useContext } from "react";
import { LoginContext } from "../../../contexts/LoginContext";
import { canclOrder, updateStatus } from "../../../api/orders";
import toast from "react-hot-toast";

function OrdersSet({ orders, ordersStatus }) {
  const location = useLocation();
  const navigate = useNavigate();
  console.log(orders);

  const queryClient = useQueryClient();

  const handleOrderUpdateNavigation = (id) => {
    navigate(`update/${id}`, { state: { from: location } });
  };

  const { userToken } = useContext(LoginContext);

  const cancelMutation = useMutation(
    (orderId) => canclOrder(userToken, orderId),
    {
      onSuccess: (data) => {
        if (data.error) {
          toast.error(data.error);
        } else {
          toast.success("تم الغاء الطلب بنجاح");
          queryClient.invalidateQueries(["orders"]);
        }
      },
    },
  );

  const updateMutation = useMutation(
    ({ orderId, status }) => updateStatus(userToken, orderId, status),
    {
      onSuccess: (data) => {
        if (data.error) {
          toast.error(data.error);
        } else {
          toast.success("تم تعديل حالة الطلب");
          queryClient.invalidateQueries(["orders"]);
        }
      },
    },
  );

  const handleStatusChange = (status, id) => {
    if (status === "pending")
      updateMutation.mutate({
        orderId: id,
        status: "confirmed",
      });
    else
      updateMutation.mutate({
        orderId: id,
        status: "delivered",
      });
  };

  if (!orders) {
    return <p className="text-center text-secondary">لا يوجد طلبيات...</p>;
  }

  const renderedOrders = orders.map((order, index) => (
    <div
      className="order-wrapper px-4 py-3 mt-3 rounded border shadow-sm"
      key={index}
    >
      <Row className="mx-2 fw-bold border-bottom mb-1 pb-1">
        <Col xs={3}>
          <p className="m-0 text-center">اسم الزبون</p>
        </Col>
        <Col xs={3}>
          <p className="m-0 text-center">طريقة الدفع</p>
        </Col>
        <Col xs={3}>
          <p className="m-0 text-center">رقم الهاتف</p>
        </Col>
        <Col xs={3}>
          <p className="m-0 text-center">السعر النهائي</p>
        </Col>
      </Row>

      <Row className="mx-2">
        <Col xs={3}>
          <p className="m-0 text-center">{order.customerName}</p>
        </Col>
        <Col xs={3}>
          <p className="m-0 text-center">{order.paymentType}</p>
        </Col>
        <Col xs={3}>
          <p className="m-0 text-center">{order.phoneNumber}</p>
        </Col>
        <Col xs={3}>
          <p className="m-0 text-center">{order.finalPrice}₪</p>
        </Col>
      </Row>

      <Accordion className="mt-2">
        <Accordion.Item key={index} eventKey={index}>
          <Accordion.Header className="d-flex justify-content-between">
            <h3 className="fs-5 m-0">المنتجات</h3>
          </Accordion.Header>
          <Accordion.Body>
            <Row className="border-bottom mb-1 pb-1 fw-bold">
              <Col
                xs={3}
                className="d-flex justify-content-center align-items-center"
              >
                <p className="m-0">المنتج</p>
              </Col>
              <Col
                xs={3}
                className="d-flex justify-content-center align-items-center"
              >
                <p className="m-0">رقم المنتج</p>
              </Col>
              <Col
                xs={2}
                className="d-flex justify-content-center align-items-center"
              >
                <p className="m-0">الكمية</p>
              </Col>
              <Col
                xs={2}
                className="d-flex justify-content-center align-items-center"
              >
                <p className="m-0">سعر الحبة</p>
              </Col>
              <Col
                xs={2}
                className="d-flex justify-content-center align-items-center"
              >
                <p className="m-0">السعر اكلي</p>
              </Col>
            </Row>
            {order.products.map((product, index) => (
              <Row key={index} className="">
                <Col
                  xs={3}
                  className="my-1 d-flex justify-content-center align-items-center"
                >
                  <p className="m-0">{product.productName}</p>
                </Col>
                <Col
                  xs={3}
                  className="my-1 d-flex justify-content-center align-items-center"
                >
                  <p className="m-0 text-center">{product.itemNo}</p>
                </Col>
                <Col
                  xs={2}
                  className="my-1 d-flex justify-content-center align-items-center"
                >
                  <p className="m-0">{product.quantity}</p>
                </Col>
                <Col
                  xs={2}
                  className="my-1 d-flex justify-content-center align-items-center"
                >
                  <p className="m-0">₪{product.unitPrice}</p>
                </Col>
                <Col
                  xs={2}
                  className="my-1 d-flex justify-content-center align-items-center"
                >
                  <p className="m-0">₪{product.finalPrice}</p>
                </Col>
              </Row>
            ))}
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>

      <div className="address mt-4 py-2 pe-4 bg-white rounded border">
        <p>
          <span className="fw-bold">العنوان: </span>
          {order.Address.city} / {order.Address.street}
        </p>
        <p className="m-0">
          <span className="fw-bold">
            الوصف: <br />
          </span>
          {order.Address.description}
        </p>
      </div>

      <div className="d-flex justify-content-end gap-3 mt-3">
        <Button
          variant="danger"
          onClick={() => cancelMutation.mutate(order._id)}
        >
          {order.status === "delivered" ? "حذف معلومات الطلب" : "إلغاء الطلب"}
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

        {(order.status === "pending" || order.status === "confirmed") && (
          <Button
            variant={order.status === "pending" ? "success" : "primary"}
            onClick={() => handleStatusChange(order.status, order._id)}
          >
            {order.status === "confirmed" ? "تم التوصيل" : "تأكيد الطلب"}
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
                <path
                  d="M4 12.6111L8.92308 17.5L20 6.5"
                  stroke="#ffffff"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </g>
            </svg>
          </Button>
        )}
      </div>
    </div>
  ));

  return <>{renderedOrders}</>;
}

export default OrdersSet;
