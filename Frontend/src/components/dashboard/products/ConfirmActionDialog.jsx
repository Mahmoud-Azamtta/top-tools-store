import React, { useContext } from "react";
import { Modal, Button } from "react-bootstrap";
import { useMutation, useQueryClient } from "react-query";
import { hideProduct } from "../../../api/products";
import { LoginContext } from "../../../contexts/LoginContext";
import toast from "react-hot-toast";

function ConfirmActionDialog({
  show,
  handleClose,
  action,
  actionSet,
  product,
}) {
  const actionTitle =
    action === actionSet.D ? "حذف" : action === actionSet.H ? "اخفاء" : "اظهار";
  const queryClient = useQueryClient();

  const { userToken } = useContext(LoginContext);

  const hideMutation = useMutation(
    () =>
      hideProduct(userToken, product._id, {
        status: product.status === "Active" ? "Inactive" : "Active",
      }),
    {
      onSuccess: (data) => {
        if (data.error) {
          toast.error(data.error);
        } else {
          toast.success("تم اخفاء المنتج");
          queryClient.invalidateQueries(["all-products"]);
          handleClose();
        }
      },
    },
  );

  const handleClick = () => {
    if (action === actionSet.D) {
      console.log("delete");
    } else if (action) {
      hideMutation.mutate();
    }
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header>
        <Modal.Title>تأكيد العملية</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        هل تريد{" "}
        <span className="fw-bold text-decoration-underline">{actionTitle}</span>{" "}
        المنتج <span className="fw-bold">{product.name}</span>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          إلغاء
        </Button>
        <Button
          variant={
            action === actionSet.D
              ? "danger"
              : action === actionSet.H
                ? "warning"
                : "success"
          }
          onClick={handleClick}
        >
          تأكيد
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ConfirmActionDialog;
