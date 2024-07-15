import { useEffect, useState, useContext } from "react";
import "./navbar.css";
import {
  Navbar,
  NavDropdown,
  Container,
  Nav,
  Form,
  Button,
} from "react-bootstrap";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { motion, useAnimation } from "framer-motion";
import { LoginContext } from "../../../contexts/LoginContext";
import { CartContext } from "../../../contexts/CartContext.jsx";

const MotionNavbar = motion(Navbar);

function CustomNavbar() {
  const controls = useAnimation();
  const [currentWidth, setCurrentWidth] = useState(window.innerWidth);
  const [scrollY, setScrollY] = useState(0);
  const [isLoggedin, setIsLoggedin] = useState(false);
  const LARGE_SCREEN_WIDTH = 992;
  const [searchValue, setSearchValue] = useState("");
  const navigate = useNavigate();

  const { userToken, handleLogout, isAdmin } = useContext(LoginContext);
  const { countCart } = useContext(CartContext);

  const [expanded, setExpanded] = useState(false);

  const handleToggle = () => setExpanded(!expanded);
  const handleNavLinkClick = () => setExpanded(false);

  // console.log(countCart)

  useEffect(() => {
    const handleResize = () => {
      setCurrentWidth(window.innerWidth);
    };

    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    const handleLogoutNavigate = () => {
      navigate("/auth/login");
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("scroll", handleScroll);

    handleResize();
    handleScroll();

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    controls.start({
      backgroundColor:
        scrollY > 50 ? "rgba(255, 255, 255, 1)" : "rgba(241, 159, 24, 1)",
    });
  }, [scrollY, controls]);

  useEffect(() => {
    if (userToken) setIsLoggedin(true);
    else setIsLoggedin(false);
  }, [userToken]);

  const handleSearch = () => {
    // console.log(searchValue)

    navigate(`/searchProducts`, {
      state: { searchValue },
    });
  };
  const handleSearchValue = (e) => {
    console.log(e.target.value);
    setSearchValue(e.target.value);
  };
  // c
  const handleLogoutNavigate = () => {
    navigate("/auth/login");
  };
  const mobileNavbar = (
    <>
      <Navbar.Brand
        as={Link}
        className="col-4 m-0 fw-bold text-main-light"
        href="/"
      >
        <img
          className="logo"
          src="/images/logo-dark.png"
          alt="Top tools logo"
        />
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="navbarScroll" onClick={handleToggle} />
      <Navbar.Collapse className="d-lg-flex" id="navbarScroll">
        <Form className="d-flex flex-row-reverse mt-3">
          <Form.Control
            type="search"
            placeholder="ابحث ..."
            className="search-bar rounded-0 rounded-start"
            aria-label="Search"
            defaultValue={searchValue}
            onChange={(e) => {
              handleSearchValue(e);
            }}
          />
          <Button
            onClick={() => handleSearch()}
            variant="outline-success search-btn rounded-0 rounded-end d-flex justify-content-center align-items-center"
          >
            <svg
              width="18px"
              height="18px"
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
                  d="M19.9604 11.4802C19.9604 13.8094 19.0227 15.9176 17.5019 17.4512C16.9332 18.0247 16.2834 18.5173 15.5716 18.9102C14.3594 19.5793 12.9658 19.9604 11.4802 19.9604C6.79672 19.9604 3 16.1637 3 11.4802C3 6.79672 6.79672 3 11.4802 3C16.1637 3 19.9604 6.79672 19.9604 11.4802Z"
                  stroke="#333333"
                  strokeWidth={2}
                />{" "}
                <path
                  d="M18.1553 18.1553L21.8871 21.8871"
                  stroke="#333333"
                  strokeWidth={2}
                  strokeLinecap="round"
                />{" "}
              </g>
            </svg>
          </Button>
        </Form>
        <Nav className="me-auto my-2 my-lg-0" navbarScroll>
          <Nav.Link
            as={Link}
            className="text-decoration-none text-black fs-5"
            to={"/"}
            onClick={handleNavLinkClick}
          >
            الرئيسية
          </Nav.Link>
          {isAdmin() && (
            <Nav.Link
              as={Link}
              className="fs-5 text-decoration-none text-black"
              to={"/dashboard"}
              onClick={handleNavLinkClick}
            >
              لوحة التحكم
            </Nav.Link>
          )}
          {isLoggedin ? (
            <>
              {!isAdmin() && (
                <Nav.Link
                  as={Link}
                  className="text-end fs-5 text-decoration-none text-black"
                  to="/user/profile"
                  onClick={handleNavLinkClick}
                >
                  الملف الشخصي
                </Nav.Link>
              )}
              <Nav.Link
                as={Link}
                className="text-end fs-5 text-decoration-none text-black"
                to={!isLoggedin ? "/auth/login?message=un-auth" : "/cart"}
                onClick={handleNavLinkClick}
              >
                السلة
              </Nav.Link>
              <Nav.Link
                as={Link}
                className="text-end fs-5 text-decoration-none text-black"
                to={!isLoggedin ? "/auth/login?message=un-auth" : "/myFav"}
                onClick={handleNavLinkClick}
              >
                المفضلة
              </Nav.Link>
              <Nav.Link
                as="button"
                className="fs-5 fw-bold text-end"
                onClick={() => {
                  handleLogout();
                  handleLogoutNavigate();
                  handleNavLinkClick();
                }}
              >
                تسجيل الخروج
              </Nav.Link>
            </>
          ) : (
            <>
              <Nav.Link
                as={Link}
                className="fs-5 mobile-nav-link text-decoration-none text-black"
                to={"/auth/login"}
                onClick={handleNavLinkClick}
              >
                تسجيل الدخول
              </Nav.Link>
              <Nav.Link
                className="mobile-nav-link fs-5 text-decoration-none text-black"
                to={"/auth/register"}
                onClick={handleNavLinkClick}
              >
                إنشاء حساب
              </Nav.Link>
            </>
          )}
        </Nav>
      </Navbar.Collapse>
    </>
  );

  const wideScreenNavbar = (
    <>
      <Navbar.Brand
        as={Link}
        className="col-4 m-0 nav-logo text-decoration-none fw-bold"
        to="/"
      >
        <div className="logo-wrapper rounded-pill">
          <img
            className="logo"
            src="/images/logo-dark.png"
            alt="Top tools logo"
          />
        </div>
      </Navbar.Brand>
      <Form className="col-4 d-flex flex-row-reverse">
        <Form.Control
          type="search"
          placeholder="ابحث ..."
          className="search-bar rounded-0 rounded-start"
          aria-label="Search"
          defaultValue={searchValue}
          onChange={(e) => {
            handleSearchValue(e);
          }}
        />
        <Button
          onClick={() => handleSearch()}
          variant="outline-success search-btn rounded-0 rounded-end d-flex justify-content-center align-items-center"
        >
          <svg
            width="18px"
            height="18px"
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
                d="M19.9604 11.4802C19.9604 13.8094 19.0227 15.9176 17.5019 17.4512C16.9332 18.0247 16.2834 18.5173 15.5716 18.9102C14.3594 19.5793 12.9658 19.9604 11.4802 19.9604C6.79672 19.9604 3 16.1637 3 11.4802C3 6.79672 6.79672 3 11.4802 3C16.1637 3 19.9604 6.79672 19.9604 11.4802Z"
                stroke="#333333"
                strokeWidth={2}
              />{" "}
              <path
                d="M18.1553 18.1553L21.8871 21.8871"
                stroke="#333333"
                strokeWidth={2}
                strokeLinecap="round"
              />{" "}
            </g>
          </svg>
        </Button>
      </Form>
      <Nav className="ms-auto col-4 d-flex justify-content-end">
        <NavDropdown
          id="auth-dropdown"
          className="auth-dropdown"
          title={
            <span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                width="24px"
                height="24px"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="dropdown-svg ms-1"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 
                         1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                />
              </svg>
              <span>{!isLoggedin ? "تسجيل الدخول" : "الملف الشخصي"}</span>
            </span>
          }
        >
          {isLoggedin ? (
            <>
              {!isAdmin() && (
                <NavDropdown.Item
                  as={NavLink}
                  className="text-end text-decoration-none text-black"
                  to="/user/profile"
                >
                  الملف الشخصي
                </NavDropdown.Item>
              )}

              {isAdmin() && (
                <NavDropdown.Item
                  as={NavLink}
                  className="text-end text-decoration-none text-black"
                  to="/dashboard"
                >
                  لوحة التحكم
                </NavDropdown.Item>
              )}

              <NavDropdown.Item
                as={Button}
                className="text-end text-decoration-none text-black"
                onClick={() => {
                  handleLogout();
                  handleLogoutNavigate();
                }}
              >
                تسجيل الخروج
              </NavDropdown.Item>
            </>
          ) : (
            <>
              <NavDropdown.Item
                as={NavLink}
                className="text-end text-decoration-none text-black"
                to="/auth/login"
              >
                هل تملك حساب؟
              </NavDropdown.Item>
              <NavDropdown.Item
                as={NavLink}
                className="text-end text-decoration-none text-black"
                to="/auth/register"
              >
                إنشاء حساب
              </NavDropdown.Item>
            </>
          )}
        </NavDropdown>
        <NavLink
          className="d-flex align-items-center cartBtn position-relative"
          to={!isLoggedin ? "/auth/login?message=un-auth" : "/cart"}
        >
          {isLoggedin && (
            <span className="cart-count fw-bold rounded-circle position-absolute">
              {countCart}
            </span>
          )}

          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            width="24px"
            height="24px"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="nav-svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
            />
          </svg>
        </NavLink>
        <NavLink
          className="d-flex align-items-center me-2 FavBtn"
          to={!isLoggedin ? "/auth/login?message=un-auth" : "/myFav"}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            width="24px"
            height="24px"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="nav-svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
            />
          </svg>
        </NavLink>
      </Nav>
    </>
  );

  return (
    <>
      <MotionNavbar
        animate={controls}
        expand="lg"
        className="fixed-top z-4 border-bottom p-0 shadow-sm"
        expanded={expanded}
      >
        <Container className="d-flex">
          {currentWidth >= LARGE_SCREEN_WIDTH ? wideScreenNavbar : mobileNavbar}
        </Container>
      </MotionNavbar>
    </>
  );
}

export default CustomNavbar;
