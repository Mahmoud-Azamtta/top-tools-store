import { useContext, useEffect, useState } from "react";
import { Modal, Button, Row, Col, Form } from "react-bootstrap";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useMutation, useQueryClient } from "react-query";
import Loading from "../../loading/Loading";
import Input from "../../../shared/Input/Input";
import * as yup from "yup";
import { useFormik } from "formik";
import DatePicker from "react-datepicker";
import OverlayLoading from "../../loading/OverlayLoading";
import "react-datepicker/dist/react-datepicker.css";
import { toast } from "react-hot-toast";
import { createCoupon } from "../../../api/coupons";
import { LoginContext } from "../../../contexts/LoginContext";

function CreateCouponDialog() {
  const location = useLocation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [show, setShow] = useState(true);
  const from = location.state?.from || "/dashboard/coupons";
  const { userToken } = useContext(LoginContext);

  const validationSchema = yup.object({
    name: yup
      .string()
      .min(3, "يجب ان يكون اسم الكوبون مكون من 3 احرف على الاقل")
      .max(25, "يجب ان يكون اسم الكوبون مكون من 25 حرف كحد اقصى")
      .required("اسم الكوبون مطلوب"),
    amount: yup
      .number()
      .min(1, "اقل قيمة هي 1")
      .max(99, "اعلى قيمة هي 99")
      .required("الخصم تطلوب"),
    expireDate: yup
      .date()
      .min(new Date(), "التاريخ غير صالح")
      .required("تاريخ الانتهاء مطلوب"),
  });

  const mutation = useMutation(
    (newCoupon) => createCoupon(userToken, newCoupon),
    {
      onSuccess: (data) => {
        if (data.error) {
          toast.error(data.error);
        } else {
          toast.success("تم إنشاء الكوبون");
          queryClient.invalidateQueries(["coupons"]);
          setShow(false);
        }
      },
    },
  );

  const formik = useFormik({
    initialValues: {
      name: "",
      amount: "",
      expireDate: new Date(),
    },
    validationSchema,
    onSubmit: (values) => {
      values.amount = values.amount;
      mutation.mutate(values);
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
        <Modal.Title>انشاء كوبون جديد</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <form>
          <Row>
            <Col xs={12}>
              <Input
                name="name"
                id="name"
                value={formik.values.name}
                onChange={formik.handleChange}
                errorMessage={formik.errors.name}
                isTouched={formik.touched.name}
                onBlur={formik.handleBlur}
                title="اسم الكوبون"
                placeholder="ادخل اسم الكوبون"
              />
            </Col>
            <Col xs={6}>
              <Input
                name="amount"
                id="amount"
                type="number"
                value={formik.values.amount}
                onChange={formik.handleChange}
                errorMessage={formik.errors.amount}
                isTouched={formik.touched.amount}
                onBlur={formik.handleBlur}
                title="الخصم"
                placeholder="نسبة الخصم (1 - 99)"
              />
            </Col>
            <Col xs={6}>
              <label htmlFor="expireDate" className="mb-1 text-main-dark">
                ادخل تاريخ الانتهاء
              </label>
              <DatePicker
                className={`date-picker d-block w-100 rounded border p-1 ${formik.errors.expireDate && "error-style"}`}
                name="expireDate"
                id="expireDate"
                selected={formik.values.expireDate}
                onChange={(val) => formik.setFieldValue("expireDate", val)}
                placeholderText="ادخل تاريخ الانتهاء"
              />
              {formik.errors.expireDate ? (
                <Form.Text className="text-danger d-block mt-1">
                  {formik.errors.expireDate}
                </Form.Text>
              ) : null}
            </Col>
          </Row>
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

export default CreateCouponDialog;
