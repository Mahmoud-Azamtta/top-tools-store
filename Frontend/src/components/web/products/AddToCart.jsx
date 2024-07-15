import "./products.css";
import React, { useContext, useEffect, useState } from "react";
import { Button, Modal, Table } from "react-bootstrap";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { LoginContext } from "../../../contexts/LoginContext.jsx";
import Loading from "../../loading/Loading.jsx";
import { addCart, getCart } from "../../../api/cart.js";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

function AddToCart({ show, setShow, variants, productId }) {
  const [isLoggedin, setIsLoggedin] = useState(false);
  const { userToken } = useContext(LoginContext);
  const [itemNo, setItemNo] = useState();
  const queryClient = useQueryClient();
  //onsole.log(variants);
  //console.log(productId);
  const navigate = useNavigate();

  const {
    data: cartData,
    isLoading: cartLoading,
    error: cartError,
  } = useQuery(["cart", userToken], () => getCart(userToken), {
    enabled: !!userToken,
  });
  const addCartMutation = useMutation(
    ({ productId, itemNo, userToken }) => addCart(productId, itemNo, userToken),
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries(["cart", userToken]);

        if (data) {
          toast.success("تم إضافة المنتج إلى السلة", {
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
          toast.error("هذا المنتج موجود بالسلة", {
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
    }
  );

  const handleAddCart = (itemNo) => {
    setItemNo(itemNo);

    addCartMutation.mutate({ productId, itemNo, userToken });
  };
  useEffect(() => {
    setIsLoggedin(!!userToken);
  }, [userToken]);

  const renderedVariants = variants?.map((variant) => (
    <div key={variant.itemNo} className="position-relative">
      <Table className="border rounded-1">
        <thead>
          <tr>
            {Object.keys(variant.attributes).map((attribute) => (
              <th key={attribute} className="text-center">
                {attribute}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            {Object.keys(variant.attributes).map((attribute) => (
              <td key={attribute} dir="ltr" className="text-center">
                {variant.attributes[attribute]}
              </td>
            ))}
          </tr>
        </tbody>
      </Table>
      <div className="d-flex justify-content-between border-bottom pb-2 px-2">
        <p className="m-0 fs-5">
          السعر:{" "}
          {variant.discount > 0 && (
            <>
              <span className="fs-6 text-danger discount-text ">
                {" "}
                ₪{variant.price}{" "}
              </span>{" "}
            </>
          )}
          <span className="fw-bold px-1">₪{variant.finalPrice}</span>
        </p>
        <Button
          className="bg-main-dark border-0 text-dark"
          onClick={() => {
            {
              isLoggedin
                ? handleAddCart(variant.itemNo)
                : navigate("/auth/login");
            }
          }}
        >
          أضف إلى السلة
        </Button>
      </div>
      {/*
      <div className="discount-wrapper position-absolute bg-warning text-black p-2 rounded-pill border ">
        <span className="fw-bold">{variant.discount}0%</span>
      </div>
      */}
    </div>
  ));

  if (cartLoading) {
    return <Loading />;
  }

  if (cartError) {
    return (
      <section className="vh-100 d-flex justify-content-center align-items-center fs-1">
        <h2>خطأ في استرجاع البيانات ...</h2>
      </section>
    );
  }

  return (
    <Modal show={show} onHide={() => setShow(false)} fullscreen="sm-down">
      <Modal.Header>أضف إلى السلة</Modal.Header>

      <Modal.Body>{renderedVariants}</Modal.Body>
      <Modal.Footer>
        <Button
          variant="secondary"
          onClick={() => {
            setShow(false);
          }}
        >
          إلغاء
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default AddToCart;
