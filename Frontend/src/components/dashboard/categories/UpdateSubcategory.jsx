import React, { useContext } from "react";
import * as yup from "yup";
import { Modal, Button } from "react-bootstrap";
import OverlayLoading from "../../loading/OverlayLoading";
import { useMutation, useQueryClient } from "react-query";
import toast from "react-hot-toast";
import { LoginContext } from "../../../contexts/LoginContext";
import { useFormik } from "formik";
import { updateSubcategory } from "../../../api/subcategories";
import Input from "../../../shared/Input/Input";

function UpdateSubcategory({ selectedSub, show, setShow }) {
  const { userToken } = useContext(LoginContext);

  const queryClient = useQueryClient();

  const createMutation = useMutation(
    (name) =>
      updateSubcategory(userToken, selectedSub.id, {
        name,
        status: selectedSub.status,
      }),
    {
      onSuccess: (data) => {
        if (data.error) {
          toast.error(data.error);
        } else {
          toast.success("تم اضافة الصنف بنجاح");
          queryClient.invalidateQueries(["categories"]);
          setShow(false);
        }
      },
    },
  );

  const formik = useFormik({
    initialValues: {
      name: selectedSub.name,
    },
    enableReinitialize: true,
    validationSchema: yup.object({
      name: yup.string().required().min(3),
    }),
    onSubmit: (values) => {
      createMutation.mutate(values.name);
    },
  });

  return (
    <Modal
      show={show}
      onHide={() => {
        formik.resetForm();
        setShow(false);
      }}
      className=""
    >
      {createMutation.isLoading && <OverlayLoading />}

      <Modal.Header>
        <h2 className="fs-5">
          تعديل الصنف <span>{selectedSub.name}</span>
        </h2>
      </Modal.Header>

      <Modal.Body>
        <Input
          title="اسم الصنف الفرعي"
          name="name"
          id="name"
          placeholder="ادخل الاسم هنا"
          value={formik.values.name || ""}
          onChange={formik.handleChange}
          isTouched={formik.touched.name}
          errorMessage={formik.errors.name}
        />
      </Modal.Body>

      <Modal.Footer>
        <Button
          variant="secondary"
          onClick={() => {
            formik.resetForm();
            setShow(false);
          }}
        >
          إلغاء
        </Button>
        <Button
          type="submit"
          disabled={!formik.isValid || !formik.dirty}
          variant="success"
          onClick={() => formik.submitForm()}
        >
          تأكيد
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default UpdateSubcategory;
