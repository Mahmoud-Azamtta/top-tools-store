import "./orders.css";
import React, { useContext, useEffect, useState } from "react";
import { Nav } from "react-bootstrap";
import { useQuery } from "react-query";
import { Outlet, Link, useSearchParams } from "react-router-dom";
import Loading from "../../loading/Loading";
import { LoginContext } from "../../../contexts/LoginContext";
import { getAllOrders } from "../../../api/orders";
import OrdersSet from "./OrdersSet";

function OrdersList() {
  const [searchParams, _] = useSearchParams();
  const [ordersStatus, setOrdersStatus] = useState(null);

  const { userToken } = useContext(LoginContext);

  useEffect(() => {
    let status = searchParams.get("status");
    if (!status) status = "all";
    setOrdersStatus(status);
  }, [searchParams]);

  const { data, error, isError, isLoading } = useQuery({
    queryFn: () => getAllOrders(userToken, ordersStatus),
    queryKey: ["orders", ordersStatus],
    enabled: !!ordersStatus,
  });

  if (isLoading) {
    return <Loading />;
  }

  if (isError || !data) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <p className="text-danger">{error}</p>
      </div>
    );
  }

  return (
    <section>
      <h2 className="border-bottom pb-2 mt-2">قائمة الطلبيات</h2>
      <Nav justify variant="tabs" defaultActiveKey="/home">
        <Nav.Item>
          <Nav.Link
            as={Link}
            to="."
            className="text-black"
            active={!searchParams.get("status")}
          >
            الكل
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link
            as={Link}
            to=".?status=pending"
            className="text-black"
            active={searchParams.get("status") === "pending"}
          >
            غير مؤكدة
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link
            as={Link}
            to=".?status=confirmed"
            className="text-black"
            active={searchParams.get("status") === "confirmed"}
          >
            مؤكدة
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link
            as={Link}
            to=".?status=delivered"
            className="text-black"
            active={searchParams.get("status") === "delivered"}
          >
            واصل
          </Nav.Link>
        </Nav.Item>
      </Nav>
      <div className="mx-5 my-4">
        <OrdersSet orders={data.orders} ordersStatus={ordersStatus} />
      </div>
      <Outlet />
    </section>
  );
}

export default OrdersList;
