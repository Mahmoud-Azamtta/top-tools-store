import React, { useContext } from "react";
import { Button, Modal } from "react-bootstrap";
import { useMutation, useQueryClient } from "react-query";
import { deleteCoupon } from "../../../api/coupons";
import toast from "react-hot-toast";
import { LoginContext } from "../../../contexts/LoginContext";

function ConfrimDeleteDialog({ show, setShow, coupon }) {
  const queryClient = useQueryClient();
  const { userToken } = useContext(LoginContext);

  const deleteCouponMutation = useMutation(
    () => deleteCoupon(userToken, coupon._id),
    {
      onSuccess: (data) => {
        if (data.error) {
          toast.error(data.error);
        } else {
          toast.success("تم حذف الكوبون");
          queryClient.invalidateQueries(["coupons"]);
          setShow(false);
        }
      },
    },
  );

  return (
    <Modal show={show} onHide={() => setShow(false)}>
      {coupon && (
        <Modal.Header className="fs-5">
          هل تريد حذ الكوبون <span className="fw-bold"> {coupon.name}؟ </span>
        </Modal.Header>
      )}
      <Modal.Footer>
        <Button variant="danger" onClick={() => deleteCouponMutation.mutate()}>
          حذف
        </Button>
        <Button variant="secondary" onClick={() => setShow(false)}>
          إلغاء
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ConfrimDeleteDialog;
