import React, { useContext } from "react";
import { Container, Nav } from "react-bootstrap";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import "./user.css";
import { LoginContext } from "../../../contexts/LoginContext.jsx";

function UserAccountPage() {
  const { handleLogout } = useContext(LoginContext);
  const navigate = useNavigate();
  const handleLogoutNavigate = () => {
    navigate("/auth/login");
  };

  return (
    <section className="wrapper mt-4">
      <Container>
        <Nav variant="tabs" defaultActiveKey="/home" className="mt-4">
          <Nav.Item className="">
            <Nav.Link as={NavLink} to="peronalInfo" className="tab-info">
              <svg
                classname="ms-2"
                width="20px"
                height="20px"
                viewBox="0 0 1024 1024"
                className="icon"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                fill="#000000"
                stroke="#000000"
                strokeWidth="53.248000000000005"
              >
                <g id="SVGRepo_bgCarrier" strokeWidth={0} />
                <g
                  id="SVGRepo_tracerCarrier"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <g id="SVGRepo_iconCarrier">
                  <path
                    d="M519.221 546.818c133.241 0 241.255-108.016 241.255-241.257S652.463 64.305 519.221 64.305 277.966 172.32 277.966 305.561 385.98 546.818 519.221 546.818z m0-442.303c111.034 0 201.046 90.012 201.046 201.046 0 111.036-90.012 201.046-201.046 201.046-111.036 0-201.046-90.01-201.046-201.046 0-111.034 90.011-201.046 201.046-201.046z m190.992 502.617c-121.042-61.357-264.822-62.161-402.09 0C186.281 662.305 86.97 888.597 86.97 888.597v40.209h40.209v-40.209S231.49 690.148 308.123 647.342c99.747-55.722 304.511-56.635 402.09 0 73.324 39.041 180.942 241.255 180.942 241.255v40.209h40.209v-40.209S807.055 656.222 710.213 607.132z"
                    fill="#000000"
                  />
                </g>
              </svg>
              <span className="me-2 text-black">المعلومات الشخصية</span>
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link as={NavLink} to="orders">
              <svg
                classname="ms-2 "
                width="20px"
                height="20px"
                viewBox="0 0 1024 1024"
                fill="#000000"
                className="icon"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                stroke="#000000"
                strokeWidth="13.312000000000001"
              >
                <g id="SVGRepo_bgCarrier" strokeWidth={0} />
                <g
                  id="SVGRepo_tracerCarrier"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <g id="SVGRepo_iconCarrier">
                  <path
                    d="M53.6 1023.2c-6.4 0-12.8-2.4-17.6-8-4.8-4.8-7.2-11.2-6.4-18.4L80 222.4c0.8-12.8 11.2-22.4 24-22.4h211.2v-3.2c0-52.8 20.8-101.6 57.6-139.2C410.4 21.6 459.2 0.8 512 0.8c108 0 196.8 88 196.8 196.8 0 0.8-0.8 1.6-0.8 2.4v0.8H920c12.8 0 23.2 9.6 24 22.4l49.6 768.8c0.8 2.4 0.8 4 0.8 6.4-0.8 13.6-11.2 24.8-24.8 24.8H53.6z m25.6-48H944l-46.4-726.4H708v57.6h0.8c12.8 8.8 20 21.6 20 36 0 24.8-20 44.8-44.8 44.8s-44.8-20-44.8-44.8c0-14.4 7.2-27.2 20-36h0.8v-57.6H363.2v57.6h0.8c12.8 8.8 20 21.6 20 36 0 24.8-20 44.8-44.8 44.8-24.8 0-44.8-20-44.8-44.8 0-14.4 7.2-27.2 20-36h0.8v-57.6H125.6l-46.4 726.4zM512 49.6c-81.6 0-148.8 66.4-148.8 148.8v3.2h298.4l-0.8-1.6v-1.6c0-82.4-67.2-148.8-148.8-148.8z"
                    fill=""
                  />
                </g>
              </svg>
              <span className="me-2 text-black">طلباتي</span>
            </Nav.Link>
          </Nav.Item>
          <Nav.Item className="me-auto">
            <Nav.Link
              as="button"
              className="text-danger fw-bold"
              onClick={() => {
                handleLogout();
                handleLogoutNavigate();
              }}
            >
              <svg
                classname="ms-2 "
                width="20px"
                height="20px"
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
                    d="M21 12L13 12"
                    stroke="#d9534f"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M18 15L20.913 12.087V12.087C20.961 12.039 20.961 11.961 20.913 11.913V11.913L18 9"
                    stroke="#d9534f"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M16 5V4.5V4.5C16 3.67157 15.3284 3 14.5 3H5C3.89543 3 3 3.89543 3 5V19C3 20.1046 3.89543 21 5 21H14.5C15.3284 21 16 20.3284 16 19.5V19.5V19"
                    stroke="#d9534f"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </g>
              </svg>
              <span className="me-2">تسجيل الخروج</span>
            </Nav.Link>
          </Nav.Item>
        </Nav>
        <div className="content">
          <Outlet />
        </div>
      </Container>
    </section>
  );
}

export default UserAccountPage;
