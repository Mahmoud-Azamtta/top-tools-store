import { useContext, useState } from "react";
import "./cart.css";
import { Container, Button } from "react-bootstrap";
import { Link, Outlet, useNavigate } from "react-router-dom";
import OrderDetails from "./OrderDetailsDialog";
import { useMutation, useQuery, useQueryClient } from "react-query";
import {
  clearCart,
  getCart,
  removeFromCart,
  updateQuantCart,
} from "../../../api/cart.js";
import { LoginContext } from "../../../contexts/LoginContext.jsx";
import Loading from "../../loading/Loading.jsx";

function Cart() {
  const [isLoggedin, setIsLoggedin] = useState(false);
  const { userToken } = useContext(LoginContext);
  const [itemNo, setItemNo] = useState();
  const [productId, setProductId] = useState();
  const queryClient = useQueryClient();

  const navigate = useNavigate();

  const [show, setShow] = useState(false);

  const {
    data: cartData,
    isLoading: cartLoading,
    error: cartError,
  } = useQuery(["cart", userToken], () => getCart(userToken), {
    enabled: !!userToken,
  });

  const removeCartMutation = useMutation(
    ({ productId, itemNo, userToken }) =>
      removeFromCart(productId, itemNo, userToken),
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries(["cart", userToken]);
      },
    },
  );

  const clearCartMutation = useMutation(
    ({ userToken }) => clearCart(userToken),
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries(["cart", userToken]);
      },
    },
  );

  const updateQuanCartMutation = useMutation(
    ({ productId, itemNo, quantity, operator, userToken }) =>
      updateQuantCart(productId, itemNo, quantity, operator, userToken),
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries(["cart", userToken]);
      },
    },
  );
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////

  const handleRemoveCart = (productId, itemNo) => {
    // setItemNo(itemNo);

    removeCartMutation.mutate({ productId, itemNo, userToken });
  };
  const handleClearCart = () => {
    // console.log("fff")
    clearCartMutation.mutate({ userToken });
  };
  const handleUpdateQuanCart = (productId, itemNo, quantity, operator) => {
    updateQuanCartMutation.mutate({
      productId,
      itemNo,
      quantity,
      operator,
      userToken,
    });
  };

  if (cartLoading || !cartData) {
    return <Loading />;
  }

  if (cartError) {
    return (
      <section className="vh-100 d-flex justify-content-center align-items-center fs-1">
        <h2>خطأ في استرجاع البيانات ...</h2>
      </section>
    );
  }

  const products = cartData?.cart?.products?.map((product) => (
    <div
      key={product.itemNo}
      className="cart-product border shadow-sm rounded-3 "
    >
      <div className="row d-flex align-items-center">
        <div className="imgDiv col-3 ">
          <img
            src={product.productId?.image?.secure_url}
            alt=""
            className="w-100 rounded-1"
          />
        </div>
        <div className="cart-product-details col-2">
          <h4 className="cart-product-name m-0">
            <Link
              to={`/${product.productId?.slug}`}
              className="text-dark text-decoration-none fw-bold"
            >
              {" "}
              {product.productId?.name}
            </Link>
            <br /> {product.itemNo}
          </h4>
        </div>
        <div className="cart-product-quantity col-3 d-flex justify-content-center">
          <div className="d-flex align-items-center">
            <button
              disabled={product.quantity === 1}
              onClick={() =>
                handleUpdateQuanCart(
                  product.productId._id,
                  product.itemNo,
                  1,
                  "-",
                )
              }
              className="quantity-button btn btn-outline-secondary rounded-pill d-flex justify-content-center align-items-center"
            >
              <svg
                width="13px"
                height="13px"
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
                    d="M6 12L18 12"
                    stroke="#222"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </g>
              </svg>
            </button>
            <p className="cart-quantity text-center m-0 mx-3">
              {product.quantity}
            </p>
            <button
              onClick={() =>
                handleUpdateQuanCart(
                  product.productId._id,
                  product.itemNo,
                  1,
                  "+",
                )
              }
              className="quantity-button btn btn-outline-secondary rounded-pill d-flex justify-content-center align-items-center"
            >
              <svg
                width="13px"
                height="13px"
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
                    stroke="#222"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />{" "}
                </g>
              </svg>
            </button>
          </div>
        </div>
        <div className="col-2 d-flex justify-content-center">
          {product?.discount ? (
            <div className="text-center">
              <div className="bg-warning">save {product?.discount}%</div>
              <span className="fs-5 text-danger mx-1 ">
                ₪{product?.price - (product?.price * product?.discount) / 100}
              </span>
              <span className="fs-6 text-secondary text-decoration-line-through">
                {product?.price}
              </span>
            </div>
          ) : (
            <span className="fs-4 d-block">{product?.price} ₪</span>
          )}{" "}
        </div>
        <div className="col-2 d-flex justify-content-center">
          <button
            onClick={() =>
              handleRemoveCart(product.productId._id, product.itemNo)
            }
            className="cart-remove-btn py-1 d-flex justify-content-center align-items-center"
          >
            <svg
              width="24px"
              height="24px"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              stroke="#E02424"
              strokeWidth={1}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <g id="SVGRepo_bgCarrier" strokeWidth={0} />
              <g
                id="SVGRepo_tracerCarrier"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <g id="SVGRepo_iconCarrier">
                <path d="M10 11V17" /> <path d="M14 11V17" />
                <path d="M4 7H20" />
                <path d="M6 7H12H18V18C18 19.6569 16.6569 21 15 21H9C7.34315 21 6 19.6569 6 18V7Z" />{" "}
                <path d="M9 5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5V7H9V5Z" />{" "}
              </g>
            </svg>
          </button>
        </div>
      </div>
    </div>
  ));

  return (
    <section className="cart mb-5">
      <Container className="mt-5">
        <h2 className="fw-bold border-bottom pb-2 mb-4">السلة</h2>
        <div className="row">
          <div className="col-lg-8 col-12">
            <div className="mx-2">
              <div className="cart-indicators-list row border-bottom mb-2 pb-1">
                <div className="col-5 d-flex justify-content-center align-items-center fw-bold">
                  المنتج
                </div>
                <div className="col-3 d-flex justify-content-center align-items-center fw-bold">
                  الكمية
                </div>
                <div className="col-2 d-flex justify-content-center align-items-center fw-bold">
                  السعر
                </div>
                <div className="col-2 d-flex justify-content-center align-items-center fw-bold">
                  حذف
                </div>
              </div>
            </div>
            {cartData.cart.products.length === 0 ? (
              <p className="text-center text-secondary mt-4">
                لا يوجد منتجات في السلة
              </p>
            ) : (
              products
            )}
          </div>

          <div className="col-lg-4 col-12 mt-3">
            <div className="border rounded p-2 shadow-sm">
              <h2 className="text-center fs-5 fw-bold m-0 my-2 border-bottom pb-2">
                إنهاء الطلب
              </h2>
              <div className="final-order p-2 border-bottom">
                <div className="d-flex justify-content-between">
                  <p className="fs-6 fw-bold m-0">السعر النهائي</p>
                  <p className="fs-6 fw-bold m-0">{cartData?.cart?.total} ₪</p>
                </div>
              </div>

              <div className="d-flex gap-2 p-2">
                <Button
                  as={Link}
                  className="finish-button btn w-50"
                  to="order-details"
                >
                  انهاء الطلب
                </Button>
                <button
                  onClick={() => handleClearCart()}
                  className="clear-button btn w-50"
                >
                  افراغ السلة
                </button>
              </div>
            </div>
          </div>
        </div>
        <Outlet />
      </Container>
    </section>
  );
}

export default Cart;
