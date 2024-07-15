import React, { useState, useEffect, useContext } from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "react-query";
import Loading from "../../loading/Loading.jsx";
import { getAllProductsActive } from "../../../api/products.js";

const SearchProducts = () => {
  const location = useLocation();
  const [searchValue, setSearchValue] = useState(
    location.state?.searchValue || ""
  );
  const [limit, setLimit] = useState(500);
  const queryClient = useQueryClient();

  const navigate = useNavigate();

  useEffect(() => {
    if (location.state?.searchValue) {
      setSearchValue(location.state.searchValue);
    }
  }, [location.state?.searchValue]);

  const {
    data: searchProducts,
    isLoading: searchProductsLoading,
    error: searchProductsError,
  } = useQuery(
    ["productSearch", limit, searchValue],
    () => getAllProductsActive(limit, searchValue),
    { enabled: !!searchValue }
  );

  if (searchProductsLoading) {
    return <Loading />;
  }

  if (searchProductsError) {
    return (
      <section className="vh-100 d-flex justify-content-center align-items-center fs-1">
        <h2>خطأ في استرجاع البيانات ...</h2>
      </section>
    );
  }
  const handleProductClick = (product, sub) => {
    //  setProductSlug(product.slug);
    navigate(`/${product.slug}`, {
      state: { productId: product._id, subcategoryId: sub },
    });
  };

  return searchProducts?.products.length ? (
    <Container className="my-5 py-5 ">
      <Row xs={1} sm={2} md={3} lg={5}>
        {searchProducts?.products.map((product) => (
          <Col key={product.productId} className="mb-4 productCol">
            <Card className="text-center ">
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
                  <Card.Title className="text-main-dark">
                    {product.name}
                  </Card.Title>

                 
                </div>
                <div className="btnsFav mt-2">
                <Card.Text>
                    {product.minDiscount > 0 ? (
                      <div className="text-center">
                        <span className="fs-4 text-danger mx-1 ">
                          ₪
                          {product?.minPrice -
                            (product?.minPrice * product?.minDiscount) / 100}
                        </span>
                        <span className="fs-6 text-secondary text-decoration-line-through">
                          {product?.minPrice}
                        </span>
                      </div>
                    ) : (
                      <span className="fs-4 d-block">{product.minPrice} ₪</span>
                    )}{" "}
                  </Card.Text>
                  <Button
                    variant="dark"
                    className="d-block w-75 m-auto border mt-1"
                    onClick={() =>
                      handleProductClick(product, product.subcategoryId)
                    }
                  >
                    <span className="favText">الذهاب إلى المنتج</span>
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  ) : (
    <section className="vh-100 d-flex justify-content-center align-items-center fs-1">
      <h2>لا يوجد منتجات بهذا الاسم ..</h2>
    </section>
  );
};

export default SearchProducts;
