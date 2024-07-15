import React, { useContext } from "react";
import { Modal, Button } from "react-bootstrap";
import OverlayLoading from "../../loading/OverlayLoading";
import { deleteSubcategory } from "../../../api/subcategories";
import { useMutation, useQueryClient } from "react-query";
import toast from "react-hot-toast";
import { LoginContext } from "../../../contexts/LoginContext";

function DeleteSub({ selectedSub, show, setShow }) {
  const { userToken } = useContext(LoginContext);

  const queryClient = useQueryClient();

  const deleteSubMutation = useMutation(
    (id) => deleteSubcategory(userToken, id),
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
      {deleteSubMutation.isLoading && <OverlayLoading />}

      <Modal.Header>
        <h2 className="fs-5">تأكيد عملية الحذف</h2>
      </Modal.Header>
      <Modal.Body>
        <p>
          هل تريد <span className="text-decoration-underline fw-bold">حذف</span>{" "}
          {selectedSub.name}
        </p>
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="danger"
          onClick={() => deleteSubMutation.mutate(selectedSub._id)}
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

export default DeleteSub;
