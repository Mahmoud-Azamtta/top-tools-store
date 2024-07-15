import React, { useContext, useEffect } from "react";
import toast from "react-hot-toast";
import { useMutation } from "react-query";
import { Link, useParams } from "react-router-dom";
import { LoginContext } from "../../../contexts/LoginContext";
import { confirmOrder } from "../../../api/orders";
import { Button } from "react-bootstrap";

function ConfirmOrder() {
  const { id } = useParams();

  const { userToken } = useContext(LoginContext);

  const mutation = useMutation(() => confirmOrder(userToken, id), {
    onSuccess: (data) => {
      console.log(data);
      if (data.error) {
        toast.success("تم رفع الطلب");
      } else {
        toast.success("تم رفع الطلب");
      }
    },
  });

  useEffect(() => {
    if (id && userToken) {
      mutation.mutate();
    }
  }, [id, userToken]);

  return (
    <div className="vh-100 d-flex justify-content-center align-items-center">
      <div className="payment-confirmation">
        <h1 className="confirm-payment-header">تمت عملية الدفع بنجاح!</h1>
        <Button className="go-back" as={Link} to="/">
          عودة إلى الصفحة الرئيسية
        </Button>
      </div>
    </div>
  );
}

export default ConfirmOrder;
