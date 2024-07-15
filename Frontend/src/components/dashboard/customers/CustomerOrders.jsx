import React, { useContext, useState } from "react";
import { Container, Table, Button } from "react-bootstrap";
import { getOrdersCustomer } from "../../../api/customers.js";
import { useQuery } from "react-query";
import { LoginContext } from "../../../contexts/LoginContext.jsx";
import { useParams } from "react-router-dom";
import moment from "moment";
import Loading from "../../loading/Loading.jsx";

const CustomerOrders = () => {
  const [isLoggedin, setIsLoggedin] = useState(false);
  const { userToken } = useContext(LoginContext);
  const [showProducts, setShowProducts] = useState({});
  const statusTranslations = {
    pending: "معلقة",
    cancelled: "ملغية",
    confirmed: "مؤكدة",
    onWay: "في الطريق",
    delivered: "تم التسليم",
  };

  const { customerId } = useParams();

  const {
    data: orderData,
    isLoading: orderLoading,
    error: customerError,
  } = useQuery(
    ["order", userToken],
    () => getOrdersCustomer(userToken, customerId),
    {
      enabled: !!userToken,
    }
  );

  console.log(orderData);

  const sampleOrders = [
    {
      id: 1,
      date: "2024-04-09",
      products: [
        { id: 1, name: "المنتج 1", price: 10, quantity: 2 },
        { id: 2, name: "المنتج 2", price: 15, quantity: 1 },
      ],
      status: "قيد المعالجة",
      totalPrice: 35,
    },
    {
      id: 2,
      date: "2024-04-08",
      products: [{ id: 3, name: "المنتج 3", price: 20, quantity: 1 }],
      status: "تم الشحن",
      totalPrice: 20,
    },
    {
      id: 3,
      date: "2024-04-10",
      products: [
        { id: 4, name: "المنتج 4", price: 25, quantity: 3 },
        { id: 5, name: "المنتج 5", price: 30, quantity: 2 },
      ],
      status: "جاري الشحن",
      totalPrice: 135,
    },
  ];

  const toggleProducts = (orderId) => {
    setShowProducts((prev) => ({
      ...prev,
      [orderId]: !prev[orderId],
    }));
  };
  if (orderLoading) {
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
    <Container className="py-4 mt-5">
      <h2 className="text-center mb-4">طلبيات الزبون</h2>
      <Table bordered responsive className="text-center ">
        <thead className="table-dark">
          <tr>
            <th>#</th>
            <th>التاريخ</th>
            <th>الحالة</th>
            <th>السعر الإجمالي</th>
            <th> المنتجات</th>
          </tr>
        </thead>
        <tbody>
          {orderData?.orders?.map((order, index) => (
            <React.Fragment key={order._id}>
              <tr>
                <td>{index}</td>
                <td>{moment(order.createdAt).format("DD/MM/YY")}</td>
                <td>{statusTranslations[order.status]}</td>
                <td>{order.finalPrice} ₪</td>
                <td>
                  <Button
                    variant="warning"
                    onClick={() => toggleProducts(order._id)}
                  >
                    {showProducts[order._id]
                      ? "إخفاء المنتجات"
                      : "عرض المنتجات"}
                  </Button>
                </td>
              </tr>
              {showProducts[order._id] && (
                <tr>
                  <td colSpan="5">
                    <Table bordered className="table-warning shadow">
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>المنتج</th>
                          <th>السعر النهائي</th>
                          <th>الكمية</th>
                        </tr>
                      </thead>
                      <tbody>
                        {order?.products?.map((product, index) => (
                          <tr key={product.productId}>
                            <td>{index}</td>
                            <td>
                            <img
                                src={product.image?.secure_url}
                                width={"110px"}
                                height={"110px"}
                                alt="productImg"
                              />
                              <p>
                                {" "}
                                {product.productName} - {product.itemNo}
                              </p>
                            
                            </td>
                            <td>{product.finalPrice} ₪</td>
                            <td>{product.quantity}</td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default CustomerOrders;
