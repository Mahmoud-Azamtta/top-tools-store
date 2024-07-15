import "./dashboard-layout.css";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import { Container, Offcanvas, Button } from "react-bootstrap";
import { LoginContext } from "../contexts/LoginContext";

const activeStyle = {
  fontWeight: "bold",
  backgroundColor: "#363333",
};

function DashboradLayout() {
  const LARGE_SCREEN_WIDTH = 992;
  const [currentWidth, setCurrentWidth] = useState(window.innerWidth);
  const [show, setShow] = useState(false);
  const { handleLogout } = useContext(LoginContext);
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => {
      setCurrentWidth(window.innerWidth);
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const sidebarContent = (
    <>
      <div className="sidebar-wrapper d-flex flex-column justify-content-between">
        <nav className="dashboard-sidebar-navs mt-3">
          <NavLink
            to="."
            end
            className="d-flex justify-content-between text-decoration-none p-2"
            style={({ isActive }) => (isActive ? activeStyle : null)}
          >
            <span>الرئيسية</span>
            <object
              data="/svgs/home.svg"
              type="image/svg+xml"
              aria-label="home-icon"
            ></object>
          </NavLink>
          <NavLink
            to="categories"
            className="d-flex justify-content-between text-decoration-none p-2 mt-2"
            style={({ isActive }) => (isActive ? activeStyle : null)}
          >
            <span>الأصناف</span>
            <object
              data="/svgs/category.svg"
              type="image/svg+xml"
              aria-label="category-icon"
            ></object>
          </NavLink>
          <NavLink
            to="products"
            className="d-flex justify-content-between text-decoration-none p-2 mt-2"
            style={({ isActive }) => (isActive ? activeStyle : null)}
          >
            <span>المنتجات</span>
            <object
              data="/svgs/products.svg"
              type="image/svg+xml"
              aria-label="products-icon"
            ></object>
          </NavLink>
          <NavLink
            to="customers"
            className="d-flex justify-content-between text-decoration-none p-2 mt-2"
            style={({ isActive }) => (isActive ? activeStyle : null)}
          >
            <span>الزبائن</span>
            <object
              data="/svgs/person-filled.svg"
              type="image/svg+xml"
              aria-label="person-icon"
            ></object>
          </NavLink>
          <NavLink
            to="orders"
            className="d-flex justify-content-between text-decoration-none p-2 mt-2"
            style={({ isActive }) => (isActive ? activeStyle : null)}
          >
            <span>الطلبيات</span>
            <object
              data="/svgs/orders.svg"
              type="image/svg+xml"
              aria-label="box-icon"
            ></object>
          </NavLink>
          <NavLink
            to="coupons"
            className="d-flex justify-content-between text-decoration-none p-2 mt-2"
            style={({ isActive }) => (isActive ? activeStyle : null)}
          >
            <span>الكوبونات</span>
            <object
              data="/svgs/coupon.svg"
              type="image/svg+xml"
              aria-label="coupon-icon"
            ></object>
          </NavLink>
          <NavLink
            to="/"
            className="d-flex justify-content-between text-decoration-none p-2 mt-2"
            style={({ isActive }) => (isActive ? activeStyle : null)}
          >
            <span>صفحة المتجر</span>
            <object
              data="/svgs/store-icon.svg"
              type="image/svg+xml"
              aria-label="store-icon"
            ></object>
          </NavLink>
        </nav>
        <button
          className="btn signout-btn d-flex justify-content-between"
          onClick={() => {
            handleLogout();
            navigate("/");
          }}
        >
          تسجيل الخروج
          <img src="/svgs/logout.svg" alt="logout icon" />
        </button>
      </div>
    </>
  );

  return (
    <section className="d-flex justify-content-between">
      {currentWidth >= LARGE_SCREEN_WIDTH ? (
        <aside className="dashboard-sidebar h-100 position-fixed right-0 px-3">
          <h1 className="fs-4 m-0 mt-2 pb-2 text-center border-bottom">
            لوحة التحكم
          </h1>
          {sidebarContent}
        </aside>
      ) : (
        <Offcanvas
          placement="end"
          show={show}
          className="dark-sidebar"
          backdrop={true}
        >
          <Offcanvas.Header className="offcanvas-sidebar-header d-flex justify-content-between">
            <Offcanvas.Title className="offcanvas-sidebar-title">
              لوحة التحكم
            </Offcanvas.Title>
            <button className="btn" onClick={() => setShow(false)}>
              <img src="/svgs/plus-icon.svg" alt="plus icon" />
            </button>
          </Offcanvas.Header>
          <Offcanvas.Body>{sidebarContent}</Offcanvas.Body>
        </Offcanvas>
      )}
      <main className="dashboard-content me-auto">
        <Container fluid>
          <Outlet />
        </Container>
      </main>
      {currentWidth < LARGE_SCREEN_WIDTH && (
        <Button
          className="position-fixed show-sidebar-btn"
          onClick={() => setShow(true)}
        >
          <svg
            width="24px"
            height="24px"
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
              <path
                d="M4 12H20M12 4V20"
                stroke="#000000"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </g>
          </svg>
        </Button>
      )}
    </section>
  );
}

export default DashboradLayout;
