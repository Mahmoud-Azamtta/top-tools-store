import "./coupons.css";
import {
  Col,
  Container,
  Row,
  Button,
  OverlayTrigger,
  Popover,
} from "react-bootstrap";
import { useQuery } from "react-query";
import { getCoupons } from "../../../api/coupons";
import Loading from "../../loading/Loading";
import ConfrimDeleteDialog from "./ConfrimDeleteDialog";
import { Link, Outlet } from "react-router-dom";
import { useState } from "react";

function Coupons() {
  const [selectedCoupon, setSelectedCoupon] = useState(null);
  // const [selectedId, setSelectedId] = useState(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const { data, isLoading, error } = useQuery(["coupons"], getCoupons);

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return (
      <section>
        <h2>خطأ في استرجاع البيانات</h2>
      </section>
    );
  }

  const formateDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  };

  const renderedData = data.coupons.map((coupon, idx) => (
    <Col key={idx} xs={12} sm={6} md={4} lg={3} className="mt-3">
      <div className="coupon-card text-center shadow-sm">
        <p className="m-0 mt-3 text-decoration-underline">خصم</p>
        <p className="fs-1">{coupon.amount}%</p>
        <h3 className="coupon-name fw-bold fs-4 m-0">{coupon.name}</h3>
        <p className="my-2">
          صالح حتى: <strong>{formateDate(coupon.expireDate)}</strong>
        </p>
        <Button
          as={Link}
          to={`update/${coupon._id}`}
          onClick={() => setSelectedCoupon(data.coupons[idx])}
          variant="secondary"
          className="position-absolute coupon-btn update shadow-sm"
        >
          <svg
            stroke="#fff"
            width="24px"
            height="24px"
            viewBox="0 0 24 24"
            id="update-alt"
            data-name="Flat Line"
            xmlns="http://www.w3.org/2000/svg"
            className="icon flat-line"
          >
            <g id="SVGRepo_bgCarrier" strokeWidth={0} />
            <g
              id="SVGRepo_tracerCarrier"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <g id="SVGRepo_iconCarrier">
              <path
                id="primary"
                d="M5.07,8A8,8,0,0,1,20,12"
                style={{
                  fill: "none",
                  strokeLinecap: "round",
                  strokeLinejoin: "round",
                  strokeWidth: 2,
                }}
              />
              <path
                id="primary-2"
                data-name="primary"
                d="M18.93,16A8,8,0,0,1,4,12"
                style={{
                  fill: "none",
                  strokeLinecap: "round",
                  strokeLinejoin: "round",
                  strokeWidth: 2,
                }}
              />
              <polyline
                id="primary-3"
                data-name="primary"
                points="5 3 5 8 10 8"
                style={{
                  fill: "none",
                  strokeLinecap: "round",
                  strokeLinejoin: "round",
                  strokeWidth: 2,
                }}
              />
              <polyline
                id="primary-4"
                data-name="primary"
                points="19 21 19 16 14 16"
                style={{
                  fill: "none",
                  strokeLinecap: "round",
                  strokeLinejoin: "round",
                  strokeWidth: 2,
                }}
              />
            </g>
          </svg>
        </Button>
        <Button
          variant="danger"
          className="position-absolute coupon-btn delete shadow-sm"
          onClick={() => {
            setSelectedCoupon(data.coupons[idx]);
            setShowDeleteDialog(true);
          }}
        >
          <svg
            width="24px"
            height="24px"
            viewBox="0 0 1024 1024"
            className="icon"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            fill="#fff"
          >
            <g id="SVGRepo_bgCarrier" strokeWidth={0} />
            <g
              id="SVGRepo_tracerCarrier"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <g id="SVGRepo_iconCarrier">
              <path d="M960 160h-291.2a160 160 0 0 0-313.6 0H64a32 32 0 0 0 0 64h896a32 32 0 0 0 0-64zM512 96a96 96 0 0 1 90.24 64h-180.48A96 96 0 0 1 512 96zM844.16 290.56a32 32 0 0 0-34.88 6.72A32 32 0 0 0 800 320a32 32 0 1 0 64 0 33.6 33.6 0 0 0-9.28-22.72 32 32 0 0 0-10.56-6.72zM832 416a32 32 0 0 0-32 32v96a32 32 0 0 0 64 0v-96a32 32 0 0 0-32-32zM832 640a32 32 0 0 0-32 32v224a32 32 0 0 1-32 32H256a32 32 0 0 1-32-32V320a32 32 0 0 0-64 0v576a96 96 0 0 0 96 96h512a96 96 0 0 0 96-96v-224a32 32 0 0 0-32-32z" />
              <path d="M384 768V352a32 32 0 0 0-64 0v416a32 32 0 0 0 64 0zM544 768V352a32 32 0 0 0-64 0v416a32 32 0 0 0 64 0zM704 768V352a32 32 0 0 0-64 0v416a32 32 0 0 0 64 0z" />
            </g>
          </svg>
        </Button>
      </div>
    </Col>
  ));

  return (
    <section>
      <Container fluid>
        <h2 className="border-bottom pb-2 mt-2">الكوبونات</h2>
        <Row className="mb-4">
          <Col xs={12} sm={6} md={4} lg={3} className="mt-3">
            <OverlayTrigger
              trigger={["hover", "focus"]}
              overlay={<Popover className="p-2 mb-1">اضافة كوبون جديد</Popover>}
            >
              <Button
                as={Link}
                to="create"
                className="add-new-btn d-block h-100 d-flex align-items-center"
              >
                <svg
                  className="m-auto"
                  width="64px"
                  height="64px"
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
                      d="M4 12H20M12 4V20"
                      stroke="#f19f18"
                      strokeWidth={1}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />{" "}
                  </g>
                </svg>
              </Button>
            </OverlayTrigger>
          </Col>
          {renderedData}
        </Row>
      </Container>
      <Outlet context={{ data: selectedCoupon }} />
      <ConfrimDeleteDialog
        show={showDeleteDialog}
        setShow={setShowDeleteDialog}
        coupon={selectedCoupon}
      />
    </section>
  );
}

export default Coupons;
