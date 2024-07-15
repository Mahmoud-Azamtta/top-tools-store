import React, { useContext } from "react";
import { Modal, Button } from "react-bootstrap";
import OverlayLoading from "../../loading/OverlayLoading";
import { deleteCategory } from "../../../api/categories";
import { useMutation, useQueryClient } from "react-query";
import toast from "react-hot-toast";
import { LoginContext } from "../../../contexts/LoginContext";

function DeleteCategory({ selectedCategory, show, setShow }) {
  const { userToken } = useContext(LoginContext);

  const queryClient = useQueryClient();

  const deleteCategoryMutation = useMutation(
    (id) => deleteCategory(userToken, id),
    {
      onSuccess: (data) => {
        if (data.error) {
          toast.error("خطأ اثناء حذف الصنف");
        } else {
          toast.success("تم حذف الصنف بنجاح");
          queryClient.invalidateQueries(["categories"]);
          setShow(false);
        }
      },
    },
  );

  return (
    <Modal show={show} onHide={() => setShow(false)} className="">
      {deleteCategoryMutation.isLoading && <OverlayLoading />}

      <Modal.Header>
        <h2 className="fs-5">تأكيد عملية الحذف</h2>
      </Modal.Header>
      <Modal.Body>
        <p>
          هل تريد <span className="text-decoration-underline fw-bold">حذف</span>{" "}
          {selectedCategory.name}
        </p>
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="danger"
          onClick={() => deleteCategoryMutation.mutate(selectedCategory.id)}
        >
          حذف
        </Button>
        <Button variant="secondary" onClick={() => setShow(false)}>
          إلغاء
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default DeleteCategory;
