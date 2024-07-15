import React, { useContext, useEffect, useState } from "react";
import {
  Button,
  Card,
  Col,
  Container,
  Dropdown,
  FormControl,
  InputGroup,
  Pagination,
  Row,
  Offcanvas,
} from "react-bootstrap";
import Rating from "react-rating";
import "./products.css";
import {
  Link,
  Outlet,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "react-query";
import Loading from "../../loading/Loading.jsx";
import { getActiveProducts } from "../../../api/products.js";
import { getActiveCategories } from "../../../api/categories.js";
import { LoginContext } from "../../../contexts/LoginContext.jsx";
import {
  addFavorite,
  getFavorite,
  removeFavorite,
} from "../../../api/favorites.js";

function Products() {
  const location = useLocation();
  const { subcategoryId } = location.state || {};
  const { subcategorySlug, categorySlug } = useParams();
  const [selectedSubCategory, setSelectedSubCategory] = useState(null);
  const [hoveredCategory, setHoveredCategory] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchValue, setSearchValue] = useState("");
  const [sortBy, setSortBy] = useState("--");
  const [sortName, setSortName] = useState("الترتيب حسب...");
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [showOffcanvas, setShowOffcanvas] = useState(false);

  const [errorMessage, setErrorMessage] = useState(null);
  const [productSlug, setProductSlug] = useState(null);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(1000);
  const [minPriceValue, setMinPriceValue] = useState(0);
  const [maxPriceValue, setMaxPriceValue] = useState(1000);

  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(8);

  const [isLoggedin, setIsLoggedin] = useState(false);
  const { userToken } = useContext(LoginContext);

  const queryClient = useQueryClient();

  const {
    data: productsData,
    isLoading: productsLoading,
    error: productsError,
  } = useQuery(
    [
      "products",
      subcategoryId,
      currentPage,
      productsPerPage,
      sortBy,
      searchValue,
      minPrice,
      maxPrice,
    ],
    () =>
      getActiveProducts(
        subcategoryId,
        currentPage,
        productsPerPage,
        sortBy,
        searchValue,
        minPrice,
        maxPrice
      ),
    { enabled: !!subcategoryId }
  );

  const {
    data: categoriesData,
    isLoading: categoriesLoading,
    error: categoriesError,
  } = useQuery(["categories"], getActiveCategories);

  console.log(productsData);

  useEffect(() => {
    setIsLoggedin(!!userToken);
  }, [userToken]);

  useEffect(() => {
    if (categoriesData && categorySlug && subcategorySlug) {
      const category = categoriesData.category?.find((cat) => cat.slug === categorySlug);
      if (!category) {
        setErrorMessage("عذرًا هذه الفئة غير متوفرة...");
        return;
      }

      const subcategory = category.subcategory?.find(
        (sub) => sub.slug === subcategorySlug
      );
      if (!subcategory) {
        setErrorMessage("عذرًا هذه الفئة غير متوفرة...");
        return;
      }

      setErrorMessage(null);
    }
  }, [
    categoriesData,
    productsData,
    categorySlug,
    subcategorySlug,
    location.pathname,
    sortBy,
    minPrice,
    maxPrice,
    currentPage,
  ]);
  const {
    data: favoriteData,
    isLoading: favoriteLoding,
    error: favoriteError,
  } = useQuery(["productFav", userToken], () => getFavorite(userToken), {
    enabled: !!userToken,
  });
  const removeFavoriteMutation = useMutation(
    ({ productId, userToken }) => removeFavorite(productId, userToken),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["productFav", userToken]);
      },
    }
  );
  const addFavoriteMutation = useMutation(
    ({ productId, userToken }) => addFavorite(productId, userToken),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["productFav", userToken]);
      },
    }
  );

  const removeFromFavorites = (productId) => {
    removeFavoriteMutation.mutate({ productId, userToken });
  };

  const addToFavorites = (productId) => {
    addFavoriteMutation.mutate({ productId, userToken });
  };

  if (categoriesLoading || productsLoading || favoriteLoding) {
    return <Loading />;
  }

  if (categoriesError || productsError || favoriteError) {
    return (
      <section className="vh-100 d-flex justify-content-center align-items-center fs-1">
        <h2>خطأ في استرجاع البيانات</h2>
      </section>
    );
  }

  if (errorMessage) {
    return (
      <div className="vh-100 d-flex justify-content-center align-items-center fs-1">
        {errorMessage}
      </div>
    );
  }

  const totalPages = Math.ceil(productsData?.totalProducts / productsPerPage);

  const handleCloseOffcanvas = () => setShowOffcanvas(false);
  const handleShowOffcanvas = () => setShowOffcanvas(true);

  const toggleBrand = (brand) => {
    const newSelectedBrands = selectedBrands.includes(brand)
      ? selectedBrands.filter((b) => b !== brand)
      : [...selectedBrands, brand];
    setSelectedBrands(newSelectedBrands);
  };

  const toggleFavorite = (productId) => {
    if (isFavorite(productId)) {
      removeFromFavorites(productId);
    } else {
      addToFavorites(productId);
    }
  };

  const isFavorite = (productId) => {
    //console.log(productId)
    const x = favoriteData?.products?.find(
      (product) => product.productId == productId
    );
    //console.log(favoriteData?.products);
    //console.log(x);
    return x;
  };

  const addToCart = () => {
    navigate("/auth/login");
  };

  const handleCategoryHover = (category) => {
    if (!selectedCategory) {
      setHoveredCategory(category);
    }
  };

  const handleCategoryLeave = () => {
    if (!selectedCategory) {
      setHoveredCategory(null);
    }
  };

  const handleSubcategoryClick = (subcategory, category) => {
    const categorySlug = encodeURIComponent(category.slug);
    const subcategorySlug = encodeURIComponent(subcategory.slug);
    navigate(`/${subcategorySlug}/${categorySlug}`, {
      state: { subcategoryId: subcategory._id },
    });
    setCurrentPage(1);
  };

  const handleProductClick = (product, sub) => {
    setProductSlug(product.slug);
    navigate(`/${product.slug}`, {
      state: { productId: product._id, subcategoryId: sub },
    });
  };

  const handlePriceSearch = () => {
    setMinPrice(minPriceValue);
    setMaxPrice(maxPriceValue);
    setCurrentPage(1);
  };

  const handleSearch = (e) => {
    setSearchValue(e.target.value);
  };

  const SidebarContent = () => (
    <div>
      <div className="mt-2">
        <h5 className="text-main-dark">الفئات</h5>
        {categoriesData?.category?.map((category) => (
          <div
            key={category._id}
            onMouseEnter={() => handleCategoryHover(category)}
            onMouseLeave={handleCategoryLeave}
            className="category-container"
          >
            <Button className="btn-sort custom-outline w-75 text-black-">
              {category.name}
            </Button>
            {(hoveredCategory === category ||
              selectedCategory === category) && (
              <div className="subcategories-dropdown">
                {category.subcategory.map((sub) => (
                  <div
                    key={sub._id}
                    onClick={() => handleSubcategoryClick(sub, category)}
                    className="subcategory-item"
                  >
                    {sub.name}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
      <hr />
      <div>
        <h5 className="text-main-dark">العلامات التجارية</h5>
        {Array.from(
          new Set(productsData?.products?.map((product) => product.brand))
        ).map((brand) => (
          <div className="category-container" key={brand}>
            <Button
              variant={
                selectedBrands.includes(brand) ? "success" : "outline-success"
              }
              className="mr-2 mb-2 btn-sort custom-outline w-75"
              onClick={() => toggleBrand(brand)}
            >
              {brand}
            </Button>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    !productSlug && (
      <Container className="wrapper">
        <Row className="position-relative">
          <Col
            xs={2}
            className="border-end mt-5 mb-5 bg-body shadow-sm rounded d-none d-lg-block"
          >
            <SidebarContent />
          </Col>
          <Col xs={12} className="my- d-lg-none ">
            <Button
              variant=""
              className=" position-absolute"
              onClick={handleShowOffcanvas}
            >
              <svg
                width="31px"
                height="31px"
                viewBox="-0.5 0 25 25"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                classname="ms-2 bg-warning rounded-circle"
              >
                <g id="SVGRepo_bgCarrier" strokeWidth={0} />
                <g
                  id="SVGRepo_tracerCarrier"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <g id="SVGRepo_iconCarrier">
                  <path
                    d="M12 22.4199C17.5228 22.4199 22 17.9428 22 12.4199C22 6.89707 17.5228 2.41992 12 2.41992C6.47715 2.41992 2 6.89707 2 12.4199C2 17.9428 6.47715 22.4199 12 22.4199Z"
                    stroke="#000"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M10.5596 8.41992L13.6196 11.29C13.778 11.4326 13.9047 11.6068 13.9914 11.8015C14.0781 11.9962 14.123 12.2068 14.123 12.4199C14.123 12.633 14.0781 12.8439 13.9914 13.0386C13.9047 13.2332 13.778 13.4075 13.6196 13.55L10.5596 16.4199"
                    stroke="#000"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </g>
              </svg>
              عرض الفئات
            </Button>
            <Offcanvas
              show={showOffcanvas}
              onHide={handleCloseOffcanvas}
              placement="end"
              className="bg-white"
            >
              <Offcanvas.Header closeButton></Offcanvas.Header>
              <Offcanvas.Body>
                <SidebarContent />
              </Offcanvas.Body>
            </Offcanvas>
          </Col>
          <Col xs={12} lg={9} className="border-end mt-4 mb-5">
            <h2 className="my-4 text-center text-main-dark">منتجاتنا</h2>

            <div className="d-flex">
              <div>
                <Dropdown className="mb-3 sort">
                  <Dropdown.Toggle
                    id="dropdown-basic"
                    className="rounded-start-0"
                  >
                    {sortName ? sortName : "الترتيب حسب..."}
                  </Dropdown.Toggle>
                  {sortName != "الترتيب حسب..." ? (
                    <Dropdown.Menu>
                      <Dropdown.Item
                        onClick={() => {
                          setSortBy("--");
                          setSortName("الترتيب حسب...");
                        }}
                      >
                        بدون ترتيب
                      </Dropdown.Item>
                      <Dropdown.Item
                        onClick={() => {
                          setSortBy("minPrice");
                          setSortName("السعر");
                        }}
                      >
                        السعر
                      </Dropdown.Item>
                      <Dropdown.Item
                        onClick={() => {
                          setSortBy("avgRating");
                          setSortName("التقييم");
                        }}
                      >
                        التقييم
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  ) : (
                    <Dropdown.Menu>
                      <Dropdown.Item
                        onClick={() => {
                          setSortBy("minPrice");
                          setSortName("السعر");
                        }}
                      >
                        السعر
                      </Dropdown.Item>
                      <Dropdown.Item
                        onClick={() => {
                          setSortBy("avgRating");
                          setSortName("التقييم");
                        }}
                      >
                        التقييم
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  )}
                </Dropdown>
              </div>
              <div className="w-50">
                <InputGroup className="mb-3">
                  <FormControl
                    placeholder="ابحث في المنتجات ( الاسم، الوصف)"
                    aria-label="Search products"
                    defaultValue={searchValue}
                    onMouseLeave={(e) => {
                      handleSearch(e);
                    }}
                    className="rounded-end-0 products-earch-field"
                  />
                </InputGroup>
              </div>
            </div>
            <div className="filterDiv">
              <span>السعر الذي تريده ؟</span>
              <div className="price-input py-1 px-1 shadow-s border my-1 shadow-sm">
                <div className="separator">من</div>
                <div className="field">
                  <input
                    type="number"
                    className="input-min"
                    defaultValue={minPrice}
                    onChange={(e) => setMinPriceValue(e.target.value)}
                  />
                </div>
                <div className="separator">إلى</div>
                <div className="field">
                  <input
                    type="number"
                    className="input-max"
                    defaultValue={maxPrice}
                    onChange={(e) => setMaxPriceValue(e.target.value)}
                  />
                </div>
                <div className="">
                  <Button
                    className="d-flex serachPriceBtn"
                    title="اضغط للبحث في السعر"
                    onClick={handlePriceSearch}
                  >
                    <svg
                      width="15px"
                      height="15px"
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
                          d="M4 12.6111L8.92308 17.5L20 6.5"
                          stroke="#FFF"
                          strokeWidth={4}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </g>
                    </svg>
                  </Button>
                </div>
              </div>
            </div>
            <Row xs={1} sm={2} md={3} lg={4}>
              <div className="selected-category-subcategory w-100 my-3">
                {categorySlug && categorySlug} &gt;{" "}
                {subcategorySlug && subcategorySlug}
              </div>
              {productsData?.products?.map((product) => (
                <Col key={product._id} className="mb-4 productCol">
                  <Card className="text-center h-1 ">
                    {product.minDiscount > 0 ? (
                      <div className="bg-danger w-100  m-auto ">
                        <span className="text-white">
                          خصم بنسبة {product.minDiscount}%{" "}
                        </span>
                      </div>
                    ) : (
                      <div className=" w-100  m-auto ">
                        <span className="text-white">.</span>
                      </div>
                    )}
                    <div className="border border-bottom imgDiv border-top-0">
                      <Card.Img
                        variant="top"
                        src={product.image.secure_url}
                        className=" h-100 img-fluid"
                      />
                    </div>

                    <Card.Body className="d-flex flex-column justify-content-between">
                      <div>
                        <Card.Title className="text-gray">
                          {product.name}
                        </Card.Title>
                      </div>
                      <div className="mt-1">
                        <Card.Text>
                          {product.minDiscount > 0 ? (
                            <div className="text-center">
                              <span className="fs-4 text-danger mx-1 ">
                                ₪
                                {product?.minPrice -
                                  (product?.minPrice * product?.minDiscount) / 100}
                              </span>
                              <span className="fs-5 text-secondary text-decoration-line-through">
                                {product?.minPrice}
                              </span>
                            </div>
                          ) : (
                            <span className="fs-4 d-block">
                              {product.minPrice} ₪
                            </span>
                          )}{" "}
                        </Card.Text>

                        <Rating
                          initialRating={product.avgRating}
                          readonly
                          emptySymbol={
                            <span className="text-secondary">&#9734;</span>
                          }
                          fullSymbol={
                            <span className="text-warning">&#9733;</span>
                          }
                          className="w-2 m-auto fs-4"
                        />

                        <div
                          style={{ cursor: "pointer" }}
                          onClick={() => {
                            isLoggedin
                              ? toggleFavorite(product._id)
                              : navigate("/auth/login");
                          }}
                          className="mb-2 pointer "
                          title="إضافة إلى المفضلة"
                        >
                          {isFavorite(product._id) ? (
                            <svg
                              width="25px"
                              height="25px"
                              viewBox="0 0 24.00 24.00"
                              xmlns="http://www.w3.org/2000/svg"
                              stroke="#593a3a"
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
                                  d="M12 6.00019C10.2006 3.90317 7.19377 3.2551 4.93923 5.17534C2.68468 7.09558 2.36727 10.3061 4.13778 12.5772C5.60984 14.4654 10.0648 18.4479 11.5249 19.7369C11.6882 19.8811 11.7699 19.9532 11.8652 19.9815C11.9483 20.0062 12.0393 20.0062 12.1225 19.9815C12.2178 19.9532 12.2994 19.8811 12.4628 19.7369C13.9229 18.4479 18.3778 14.4654 19.8499 12.5772C21.6204 10.3061 21.3417 7.07538 19.0484 5.17534C16.7551 3.2753 13.7994 3.90317 12 6.00019Z"
                                  stroke="#dc2e2e"
                                  strokeWidth="2.4"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  fill="red"
                                />
                              </g>
                            </svg>
                          ) : (
                            <svg
                              width="25px"
                              height="25px"
                              viewBox="0 0 24.00 24.00"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                              stroke="#593a3a"
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
                                  d="M12 6.00019C10.2006 3.90317 7.19377 3.2551 4.93923 5.17534C2.68468 7.09558 2.36727 10.3061 4.13778 12.5772C5.60984 14.4654 10.0648 18.4479 11.5249 19.7369C11.6882 19.8811 11.7699 19.9532 11.8652 19.9815C11.9483 20.0062 12.0393 20.0062 12.1225 19.9815C12.2178 19.9532 12.2994 19.8811 12.4628 19.7369C13.9229 18.4479 18.3778 14.4654 19.8499 12.5772C21.6204 10.3061 21.3417 7.07538 19.0484 5.17534C16.7551 3.2753 13.7994 3.90317 12 6.00019Z"
                                  stroke="#0f0f0f"
                                  strokeWidth="2.4"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </g>
                            </svg>
                          )}
                        </div>
                        <Button
                          onClick={() =>
                            handleProductClick(product, product.subcategoryId)
                          }
                          className="product-details-btn d-block m-auto border text-dark bg-main-dark"
                        >
                          عرض المنتج
                        </Button>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
            <Pagination dir="ltr" className="mt-4 justify-content-center">
              <Pagination.Prev
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
              />
              {Array.from({ length: totalPages }, (_, i) => (
                <span key={i + 1} className="rounded-circle mx-1">
                  <Pagination.Item
                    active={i + 1 === currentPage}
                    onClick={() => setCurrentPage(i + 1)}
                    className={i + 1 === currentPage ? "active-page" : ""}
                  >
                    {i + 1}
                  </Pagination.Item>
                </span>
              ))}
              <Pagination.Next
                className="rounded-0"
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === totalPages}
              />
            </Pagination>
          </Col>
        </Row>
      </Container>
    )
  );
}

export default Products;
