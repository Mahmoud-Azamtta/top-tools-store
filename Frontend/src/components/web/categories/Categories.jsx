import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import Container from "react-bootstrap/Container";
import "./categories.css";
import { Button, Offcanvas, Accordion, ListGroup } from "react-bootstrap";

function Categories() {
  const categories = [
    {
      categoryName: "الأدوات اليدوية",
      products: [
        {
          productName: "مطارق",
        },
        {
          productName: "مفكات",
        },
        {
          productName: "كماشات",
        },
        {
          productName: "مفاتيح ربط",
        },
        {
          productName: "مناشير يدوية",
        },
        {
          productName: "مسننات",
        },
      ],
    },
    {
      categoryName: "أدوات القياس والتخطيط",
      products: [
        {
          productName: "مسطرة قياس",
        },
        {
          productName: "مستوي",
        },
        {
          productName: "مربع",
        },
        {
          productName: "قياسات الكاليبر",
        },
      ],
    },
    {
      categoryName: "مواد البناء",
      products: [
        {
          productName: "الخشب",
        },
        {
          productName: "الخشب الرقائقي",
        },
        {
          productName: "العزل",
        },
        {
          productName: "الخرسانة",
        },
        {
          productName: "الطوب والكتل",
        },
      ],
    },
    {
      categoryName: "مستلزمات الطلاء",
      products: [
        {
          productName: "فرش الطلاء",
        },
        {
          productName: "أسطوانات الطلاء وصوانيه",
        },
        {
          productName: "رشاشات الطلاء",
        },
        {
          productName: "غطاء السقوط",
        },
        {
          productName: "شريط رسام",
        },
        {
          productName: "مذيبات الطلاء",
        },
      ],
    },
    {
      categoryName: "مسلتزمات الكهرباء",
      products: [
        {
          productName: "الأسلاك",
        },
        {
          productName: "صناديق الكهرباء",
        },
        {
          productName: "المفاتيح",
        },
      ],
    },
    {
      categoryName: "مستلزمات السباكة",
      products: [
        {
          productName: "الأنابيب",
        },
        {
          productName: "الصمامات",
        },
        {
          productName: "عزل الأنابيب",
        },
        {
          productName: "مقطاعات الأنابيب",
        },
        {
          productName: "المكبس",
        },
      ],
    },
  ];

  // const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  // const [selectedCategory, setSelectedCategory] = useState(null);
  //
  // const toggleCategSidebar = () => {
  //   setIsSidebarVisible(!isSidebarVisible);
  // };
  //
  // const toggleCategory = (category) => {
  //   setSelectedCategory(selectedCategory == category ? null : category);
  // };

  // const dispatch = useDispatch();
  //
  // const {
  //   loading,
  //   error,
  //   records: categoriesList,
  // } = useSelector((state) => state.categories);
  //
  // useEffect(() => {
  //   if (!loading) dispatch(actGetCategories());
  // }, [dispatch]);
  //
  // console.log(categoriesList);

  const location = useLocation();
  const [hideCategories, setHideCategories] = useState(false);
  const mobileCategoriesRef = useRef(null);
  const wideScreenCategoriesRef = useRef(null);
  const [currentWidth, setCurrentWidth] = useState(window.innerWidth);
  const [sidebarVisibility, setSidebarVisibility] = useState(false);
  const LARGE_SCREEN_WIDTH = 992;

  useEffect(() => {
    const handleResize = () => {
      setCurrentWidth(window.innerWidth);
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (location.pathname.startsWith("/auth")) {
      setHideCategories(true);
    } else {
      setHideCategories(false);
    }
  }, [location]);

  const mobileScreenCategories = (
    <section ref={mobileCategoriesRef}>
      <Button
        className={`toggle-categories position-fixed rounded-start-pill ${hideCategories && "d-none"}`}
        onClick={() => setSidebarVisibility(true)}
      >
        الفئات
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
              d="M6 12H18M6 12L11 7M6 12L11 17"
              stroke="#fff"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />{" "}
          </g>
        </svg>
      </Button>
      <Offcanvas
        show={sidebarVisibility}
        placement="end"
        className="bg-second-color"
        onHide={() => setSidebarVisibility(false)}
      >
        <Offcanvas.Header className="d-flex justify-content-between">
          <Offcanvas.Title>الفئات</Offcanvas.Title>
          <button className="btn" onClick={() => setSidebarVisibility(false)}>
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
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M19.207 6.207a1 1 0 0 0-1.414-1.414L12 10.586 6.207 4.793a1 1 0 0 0-1.414 1.414L10.586 12l-5.793 5.793a1 1 0 1 0 1.414 1.414L12 13.414l5.793 5.793a1 1 0 0 0 1.414-1.414L13.414 12l5.793-5.793z"
                  fill="#000000"
                />
              </g>
            </svg>
          </button>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <Accordion>
            {categories.map((category, index) => (
              <Accordion.Item key={index} eventKey={index}>
                <Accordion.Header>{category.categoryName}</Accordion.Header>
                <Accordion.Body>
                  <ListGroup>
                    {category.products.map((product, index) => (
                      <ListGroup.Item key={index}>
                        <Link
                          className="text-decoration-none text-black"
                          to={""}
                        >
                          {product.productName}
                        </Link>
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                </Accordion.Body>
              </Accordion.Item>
            ))}
          </Accordion>
        </Offcanvas.Body>
      </Offcanvas>
    </section>
  );

  const wideScreenCategories = (
    <nav
      className={`nav-categories py-2 border-0 border-bottom bg-second-color fixed-top z-3 ${hideCategories && "d-none"}`}
      ref={wideScreenCategoriesRef}
    >
      <Container className="d-flex  justify-content-around fw-medium ">
        {categories.map((category, index) => (
          <div className="dropdown category" key={index}>
            <span>{category.categoryName}</span>
            <ul
              className="categories-dropdown dropdown-menu rounded-0 text-end rounded-2"
              aria-labelledby="dropdownMenuButton"
            >
              {category.products.map((product, index) => (
                <li className="product" key={index}>
                  <Link
                    className="category-item dropdown-item text-main-dark"
                    to="/"
                  >
                    {product.productName}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </Container>
    </nav>
  );

  return currentWidth >= LARGE_SCREEN_WIDTH
    ? wideScreenCategories
    : mobileScreenCategories;
}

export default Categories;
