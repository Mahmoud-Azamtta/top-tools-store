import React, { useEffect, useState, useContext } from "react";
import * as yup from "yup";
import { Modal, Button, Form } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "react-query";
import { LoginContext } from "../../../contexts/LoginContext";
import { useFormik } from "formik";
import Input from "../../../shared/Input/Input";
import OverlayLoading from "../../loading/OverlayLoading";
import { updateCategory } from "../../../api/categories";
import { toast } from "react-hot-toast";

function UpdateCategory() {
  const location = useLocation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [show, setShow] = useState(true);
  const from = location.state?.from || "/dashboard/categories";

  const { data } = location.state || {};

  const { userToken } = useContext(LoginContext);

  const [previewImage, setPreviewImage] = useState(data?.image ?? null);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
      formik.setFieldValue("image", file);
      console.log(formik.values);
    }
    console.log("Not uploaded");
  };

  const mutation = useMutation(
    (newCategory) => updateCategory(userToken, data._id, newCategory),
    {
      onSuccess: (data) => {
        if (data.error) {
          toast.error(data.error);
        } else {
          toast.success("تم تعديل الصنف");
          queryClient.invalidateQueries(["categories"]);
          setShow(false);
        }
      },
    },
  );

  const formik = useFormik({
    initialValues: {
      image: null,
      name: data.name,
    },
    validationSchema: yup.object({
      name: yup.string().required(),
    }),
    onSubmit: (values) => {
      const formData = new FormData();
      formData.set("name", values.name);
      if (values.image instanceof File) formData.set("image", values.image);
      formData.set("status", data.status);

      mutation.mutate(formData);
    },
  });

  useEffect(() => {
    setShow(true);
  }, []);

  return (
    <Modal
      show={show}
      onExited={() => {
        navigate(from);
      }}
      onHide={() => setShow(false)}
    >
      {mutation.isLoading && <OverlayLoading />}

      <Modal.Header>
        <Modal.Title>تعديل الصنف</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <form onSubmit={formik.handleSubmit} encType="multipart/form-data">
          <Input
            title="اسم الصنف"
            name="name"
            id="name"
            placeholder="أدخل اسم الصنف"
            value={formik.values.name}
            onChange={formik.handleChange}
            errorMessage={formik.errors.name}
          />

          <Form.Group controlId="formFile" className="mb-3 mx-auto">
            <Form.Label className="text-main-dark">صورة الصنف</Form.Label>

            <div className="px-5 py-3 mb-3 border rounded-3">
              {previewImage ? (
                <img
                  className="w-100 rounded-3"
                  src={previewImage}
                  alt="اضافة منتج"
                />
              ) : (
                <div className="d-flex flex-column justify-content-center align-item-center">
                  <img
                    className="w-50 rounded-3 mx-auto"
                    src="/svgs/image-placeholder.svg"
                    alt="اضافة منتج"
                  />{" "}
                  <p className="text-center mt-3 text-secondary">
                    لم يتم اختيار صورة!
                  </p>
                </div>
              )}
            </div>

            <Form.Control
              type="file"
              className="product-image"
              onChange={handleImageChange}
            />
          </Form.Group>
        </form>
      </Modal.Body>

      <Modal.Footer>
        <Button
          variant="secondary"
          onClick={() => {
            setShow(false);
          }}
        >
          إغلاق
        </Button>

        <Button
          variant="success"
          disabled={!formik.isValid || !formik.dirty}
          onClick={() => {
            formik.submitForm();
          }}
        >
          تأكيد
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default UpdateCategory;
