import React, { useContext, useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Modal,
  Form,
} from "react-bootstrap";
import Rating from "react-rating";
import {
  Link,
  Outlet,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import { FaStar } from "react-icons/fa";
import "./products.css";
import { useMutation, useQuery, useQueryClient } from "react-query";
import {
  getAllProductsActive,
  getProductDetails,
} from "../../../api/products.js";
import Loading from "../../loading/Loading.jsx";
import { addReview, getProductReview } from "../../../api/reviews.js";
import { getActiveCategories } from "../../../api/categories.js";
import { getSubcategoryDetalis } from "../../../api/subcategories.js";
import { useFormik } from "formik";
import { LoginContext } from "../../../contexts/LoginContext.jsx";
import {
  addFavorite,
  getFavorite,
  removeFavorite,
} from "../../../api/favorites.js";
import toast from "react-hot-toast";
import AddToCart from "./AddToCart.jsx";

const ProductDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { productSlug } = useParams();
  const [productId, setProductId] = useState(location.state?.productId || null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [showAddToCartDialog, setShowAddToCartDialog] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const [image, setImage] = useState(null);
  const [isLoggedin, setIsLoggedin] = useState(false);
  const { userToken } = useContext(LoginContext);
  const queryClient = useQueryClient();

  const initialValues = {
    comment: "",
  };

  const reviewMutation = useMutation(
    ({ productId, userToken, comment, rating, image }) =>
      addReview(productId, userToken, comment, rating, image),
    {
      onSuccess: (data) => {
        if (data) {
          console.log("Review added successfully:", data);

          toast.success("تم إضافة تعليقك وتقييمك بنجاح", {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          });
        } else {
          toast.error("لا يمكنك اضافة التعليق", {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          });
        }
      },
      onError: (error) => {
        console.error("Error adding review:", error);
        toast.error("تعذر إضافة التعليق، الرجاء المحاولة لاحقاً", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      },
    }
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    reviewMutation.mutate({ productId, userToken, comment, rating, image });
  };

  const formik = useFormik({
    initialValues,
    handleSubmit,
    validationSchema: addReview,
  });
  const inputs = [
    // Dynamic Inputs
    {
      id: "comment",
      type: "text",
      name: "comment",
      title: "التعليق",
      placeholder: "اكتب تعليقك هُنا",
      value: formik.values.comment,
    },
  ];

  // console.log(productId, subcategoryId);

  const {
    data: productData,
    isLoading: productLoading,
    error: productError,
  } = useQuery(["product", productId], () => getProductDetails(productId), {
    enabled: !!productId,
  });
  const {
    data: Allproducts,
    isLoading: AllproductsLoading,
    error: AllproductsError,
  } = useQuery(["Allproducts"], () => getAllProductsActive());

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

  useEffect(() => {
    //console.log(Allproducts)
    if (Allproducts && productSlug) {
      const product = Allproducts?.products?.find(
        (pro) => pro.slug == productSlug
      );
      if (!product) {
        setErrorMessage("عذرًا هذا المنتج غير متوفر...");
        return;
      } else {
        setProductId(product._id);
        setErrorMessage("");
      }
    }
  }, [Allproducts, productSlug]);

  useEffect(() => {
    setIsLoggedin(!!userToken);
  }, [userToken]);

  if (productLoading || favoriteLoading || AllproductsLoading) {
    return <Loading />;
  }

  if (productError || favoriteError || AllproductsError) {
    return (
      <section className="vh-100 d-flex justify-content-center align-items-center fs-1">
        <h2>خطأ في استرجاع البيانات ...</h2>
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
    //cheak if userToken > add to cart
    navigate("/auth/login");
  };
  const handleSubcategoryClick = (subcategory, category) => {
    const categorySlug = encodeURIComponent(category.slug);
    const subcategorySlug = encodeURIComponent(subcategory.slug);
    navigate(`/${subcategorySlug}/${categorySlug}`, {
      state: { subcategoryId: subcategory._id },
    });
    setCurrentPage(1);
  };

  return (
    <Container className="wrapper mt-5 w-75 productsDetalis">
      <Row className="border">
        <Col xs={12} md={6}>
          <Card className="border-0 ProductCard rounded-0 ">
            <Card.Body className="fs-5 text-center">
              <Card.Title className="text-center text-danger border-bottom w-50 m-auto pb-2">
                {productData?.name}
              </Card.Title>
              <Card.Text>{productData?.description}</Card.Text>
              {productData?.minDiscount > 0 && (
                <div className="bg-danger mt-3 w-50 m-auto ">
                  <span className="text-white">
                    خصم بنسبة {productData?.minDiscount}%{" "}
                  </span>
                </div>
              )}
              <Card.Text>
                السعر:
                {productData?.minDiscount > 0 ? (
                 <div className="text-center">
                 <span className="fs-4 text-danger mx-1 ">
                 ₪{productData?.minPrice - (productData?.minPrice * productData?.minDiscount) / 100} 
                 </span>
                 <span className="fs-5 text-secondary text-decoration-line-through">
                   {productData?.minPrice} 
                 </span>
                
               </div>
                ) : (
                  <span className="fs-4 d-block">
                    {productData?.minPrice} ₪
                  </span>
                )}{" "}
              </Card.Text>
              {productData?.specifications &&
              <Card.Text className="fs-6">الوصف: {productData?.specifications}</Card.Text>
              
              }
              <Card.Text  onClick={() => handleSubcategoryClick(productData?.subcategoryId, productData?.categoryId)}>التصنيف:
                
                
              <Link  className="text-dark text-decoration-none fw-bold">
              {productData?.categoryId.name}
                
                 </Link>
                
                </Card.Text>
              <Card.Text onClick={() => handleSubcategoryClick(productData?.subcategoryId, productData?.categoryId)}>
              الفئة الفرعية:
              <Link className="text-dark text-decoration-none fw-bold">
               {productData?.subcategoryId.name}
                
                 </Link>
              </Card.Text>
              <Card.Text>العلامة التجارية: {productData?.brand}</Card.Text>
              <Rating
                initialRating={productData?.avgRating}
                readonly
                emptySymbol={<FaStar className="text-secondary" />}
                fullSymbol={<FaStar className="text-warning" />}
                className="fs-3 m-auto text-center w-100"
              />
              {console.log(productData)}
              <div
                style={{ cursor: "pointer" }}
               
                onClick={()=> {
                  isLoggedin
                    ? toggleFavorite(productData?._id)
                    : navigate("/auth/login");
                }}
                className="mb-2 pointer text-center "
                title="إضافة إلى المفضلة"
              >
                {isFavorite(productData?._id) ? (
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
                variant="primar"
                onClick={() =>
                  // isLoggedIn ? setShowAddToCartDialog(true) : navigate("/")
                  setShowAddToCartDialog(true)
                }
                className="d-block m-auto border bg-main-light mt-2"
              >
                أضف إلى السلة
              </Button>
            </Card.Body>
          </Card>
        </Col>
        <Col xs={12} md={6} className="mt-4 m">
          <Card className="border-0 ">
            <Card.Img
              variant="top"
              src={productData?.image}
              className="product-img h-100   "
            />
          </Card>
        </Col>
      </Row>
      <Row className=" commentsRating">
        <Col>
          <Col>
            <div className="mt-4">
              {isLoggedin ? <h4> التعليقات</h4>:""}
              {productData?.reviews.map((review, index) => (
                <div key={index} className=" mb-3 py-2 border-bottom ">
                  <div className=" d-flex position-relative ">
                    <span className=" position-absolute bottom-0 text-success p-1">
                      {review.userId?.userName}
                    </span>
                    <br />
                    <img
                      src="/public/images/user_profile.jpg"
                      alt={review.userId?.userName}
                      style={{ width: "50px", height: "50px" }}
                      className="d-flex rounded-circle mb-4"
                    />
                    <div className="p-2  ">
                      <span> {review.comment}</span> <br />
                      {[...Array(review.rating)].map((_, i) => (
                        <FaStar key={i} className="text-warning " />
                      ))}
                      {[...Array(5 - review.rating)].map((_, i) => (
                        <FaStar key={i} className="text-secondary " />
                      ))}
                      <br />
                    </div>
                  </div>
                  <div className="reviewImg me-5">
                    {review.image && (
                      <img
                        src={review.image.secure_url}
                        alt=""
                        width={"150px"}
                        height={"150px"}
                      />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Col>

          {isLoggedin && (
            <div className="">
              <Container className="mt-4 ">
                <Form onSubmit={handleSubmit}>
                  <span className="text-danger">
                    *يمكنك إضافة تعليقك لهذا المنتج مرة واحدة فقط في حال تم
                    توصيله لك . . .
                  </span>

                  {
                    <Form.Group>
                      <Form.Control
                        as="textarea"
                        rows={3}
                        id="comment"
                        name="comment"
                        title="التعليق"
                        placeholder="اكتب تعليقك هُنا"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        required
                      />
                    </Form.Group>
                  }
                  <Form.Group controlId="formBasicRating" className="my-3">
                    <div>
                      {[...Array(5)].map((_, index) => {
                        const ratingValue = index + 1;
                        return (
                          <FaStar
                            key={index}
                            className="star fs-3 "
                            color={
                              ratingValue <= rating ? "#ffc107" : "#aaaaaa"
                            }
                            onClick={() => setRating(ratingValue)}
                          />
                        );
                      })}
                    </div>
                  </Form.Group>
                  <Button className="bg-dark border-0 mb-2" type="submit">
                    إرسال
                  </Button>
                </Form>
              </Container>
            </div>
          )}
        </Col>
      </Row>
      <AddToCart
        show={showAddToCartDialog}
        setShow={setShowAddToCartDialog}
        variants={productData?.variants}
        productId={productId}
      />
    </Container>
  );
};

export default ProductDetails;