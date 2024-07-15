import React, { useState, useEffect, useContext } from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import favoriteProductsData from "./favorites.json";
import { Link, useNavigate } from "react-router-dom";
import "./favorites.css";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { LoginContext } from "../../../contexts/LoginContext.jsx";
import {
  clearFavorite,
  getFavorite,
  removeFavorite,
} from "../../../api/favorites.js";
import Loading from "../../loading/Loading.jsx";

const FavoriteProducts = () => {
  const [isLoggedin, setIsLoggedin] = useState(false);
  const { userToken } = useContext(LoginContext);

  const [productSlug, setProductSlug] = useState(null);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const {
    data: favoriteData,
    isLoading: favoriteLoading,
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
  const clearFavoriteMutation = useMutation(
    ({ userToken }) => clearFavorite(userToken),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["productFav", userToken]);
      },
    }
  );
  useEffect(() => {
    setIsLoggedin(!!userToken);
  }, [userToken]);

  if (favoriteLoading) {
    return <Loading />;
  }

  if (favoriteError) {
    return (
      <section className="vh-100 d-flex justify-content-center align-items-center fs-1">
        <h2>خطأ في استرجاع البيانات ...</h2>
      </section>
    );
  }
  const handleProductClick = (product, sub) => {
    setProductSlug(product.slug);
    navigate(`/${product.slug}`, {
      state: { productId: product.productId, subcategoryId: sub },
    });
  };

  const removeFromFavorites = (productId) => {
    removeFavoriteMutation.mutate({ productId, userToken });
  };
  const clearFavorites = () => {
    clearFavoriteMutation.mutate({ userToken });
  };
  console.log(favoriteData);

  return favoriteData?.products.length ? (
    <Container className="my-5 py-5 ">
      <div className="border-bottom d-flex mb-3 justify-content-between">
        <h2 className=" text-main-dark  pb-3 ">منتجاتي المفضلة</h2>
        <Button
          variant="body"
          className=""
          title=" حذف كل المنتجات في المفضلة"
          onClick={() => clearFavorites()}
        >
          <svg
            width="30px"
            height="30px"
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
                d="M10 11V17"
                stroke="#000000"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />{" "}
              <path
                d="M14 11V17"
                stroke="#000000"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />{" "}
              <path
                d="M4 7H20"
                stroke="#000000"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />{" "}
              <path
                d="M6 7H12H18V18C18 19.6569 16.6569 21 15 21H9C7.34315 21 6 19.6569 6 18V7Z"
                stroke="#000000"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />{" "}
              <path
                d="M9 5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5V7H9V5Z"
                stroke="#000000"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />{" "}
            </g>
          </svg>
        </Button>
      </div>

      <Row xs={1} sm={2} md={3} lg={5}>
        {favoriteData?.products.map((product) => (
          <Col key={product.productId} className="mb-4 productCol">
            <Card className="text-center ">
              {product.discount > 0 ? (
                <div className="bg-danger w-100  m-auto ">
                  
                  <span className="text-white">
                    خصم بنسبة {product.discount}%{" "}
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

                <div className="btnsFav mt-">
                  <Card.Text>
                    {product.discount > 0 ? (
                      <div className="text-center">
                        <span className="fs-4 text-danger mx-1 ">
                          ₪
                          {product?.price -
                            (product?.price * product?.discount) / 100}
                        </span>
                        <span className="fs-6 text-secondary text-decoration-line-through">
                          {product?.price}
                        </span>
                      </div>
                    ) : (
                      <span className="fs-4 d-block">{product.price} ₪</span>
                    )}{" "}
                  </Card.Text>
                  <Button
                    className="w-75 border-0 d-block m-auto"
                    variant="dark"
                    onClick={() => removeFromFavorites(product.productId)}
                  >
                    <FontAwesomeIcon icon={faHeart} />{" "}
                    <span className="favText">إزالة من المفضلة</span>
                  </Button>
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
      <h2>لا يوجد منتجات في المفضلة ..</h2>
    </section>
  );
};

export default FavoriteProducts;
