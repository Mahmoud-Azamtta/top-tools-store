import React, { useContext, useState } from "react";
import { Button, Container, Table } from "react-bootstrap";
import { LoginContext } from "../../../contexts/LoginContext.jsx";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { getUserData } from "../../../api/user.js";
import moment from "moment";
import Loading from "../../loading/Loading.jsx";
import { cancleOrderUser } from "../../../api/orders.js";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
function OrdersInfo() {
  const { userToken } = useContext(LoginContext);
  const queryClient = useQueryClient();
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [indexOrder, setIndexOrder] = useState(0);

  const statusTranslations = {
    pending: "معلقة",
    cancelled: "ملغية",
    confirmed: "مؤكدة",
    onWay: "في الطريق",
    delivered: "تم التسليم",
  };

  const {
    data: userData,
    isLoading: userDataLoading,
    error: userDataError,
  } = useQuery(["userData", userToken], () => getUserData(userToken), {
    enabled: !!userToken,
  });

  const cancleOrderMutation = useMutation(
    ({ userToken, orderId }) => cancleOrderUser(userToken, orderId),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["userData", userToken]);
        toast.success("تم إالغاء طلبيتك بنجاح ..");
      },
      onError: (error) => {
        console.error("Error deleting customer:", error);
      },
    }
  );

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

  // const sampleOrders = [
  //   {
  //     id: 1,
  //     date: "2024-04-09",
  //     products: [
  //       { id: 1, name: "المنتج 1", price: 10, quantity: 2 },
  //       { id: 2, name: "المنتج 2", price: 15, quantity: 1 },
  //     ],
  //     status: "قيد المعالجة",
  //     totalPrice: 35,
  //   },
  //   {
  //     id: 2,
  //     date: "2024-04-08",
  //     products: [{ id: 3, name: "المنتج 3", price: 20, quantity: 1 }],
  //     status: "تم الشحن",
  //     totalPrice: 20,
  //   },
  // ];

  const handleOrderClick = (orderId) => {
    const order = userData?.orders.find((order) => order._id === orderId);
    setSelectedOrder(order);
  };
  const handleCansceledOrder = (orderId) => {
    //console.log(orderId)
    cancleOrderMutation.mutate({ userToken, orderId });
  };

  return (
    <Container className="py-5">
      <h2 className="text-main-dark">معلومات الطلبات</h2>
      <hr />
      <div className="table-responsive text-center ">
        <Table striped hover responsive>
          <thead>
            <tr>
              <th># رقم الطلب</th>
              <th>تاريخ الطلب</th>
              <th>السعر الإجمالي</th>
              <th>حالة الطلب</th>
            </tr>
          </thead>
          <tbody>
            {userData?.orders.map((order, index) => (
              <tr
                key={order._id}
                onClick={() => {
                  handleOrderClick(order._id);
                  setIndexOrder(index);
                }}
                style={{ cursor: "pointer" }}
              >
                <td>{index}</td>
                <td>{moment(order.createdAt).format("DD/MM/YY")}</td>
                <td> {order.finalPrice} ₪ </td>
                <td>
                  {statusTranslations[order.status] || order.status}
                  {order.status == "pending" && (
                    <Button
                      onClick={() => handleCansceledOrder(order._id)}
                      className="bg-main-dark border-0 d-flex m-auto"
                    >
                      إلغاء الطلبية
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      {selectedOrder && (
        <div className="py-4">
          <h4 className="text-main-dark">الطلب # {indexOrder}</h4>
          <p>
            <strong>تاريخ الطلب:</strong>{" "}
            {moment(selectedOrder.createdAt).format("DD/MM/YY")}
          </p>
          <div className="table-responsive">
            <Table hover responsive className="text-center m-auto ">
              <thead className="bg-main-dark">
                <tr>
                  <th> المنتج</th>
                  <th>السعر</th>
                  <th>الكمية</th>
                </tr>
              </thead>
              <tbody >
                {selectedOrder.products.map((product) => (
                  <tr key={product.productId }>
                    <td>
                      <img
                        src={product.image?.secure_url}
                        width={"110px"}
                        height={"110px"}
                        alt="productImg"
                      />
                      <br />
                      <Link
                        to={`/${product.slug}`}
                        className="text-dark text-decoration-none fw-bold"
                      >
                        {product.productName}{" "}
                      </Link>
                      - {product.itemNo}
                    </td>
                    <td>{product.unitPrice} ₪</td>
                    <td>{product.quantity}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </div>
      )}
    </Container>
  );
}

export default OrdersInfo;
