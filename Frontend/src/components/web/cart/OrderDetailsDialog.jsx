import { Button, Modal, Form } from "react-bootstrap";
import { useContext, useState, useEffect } from "react";
import { sendOrder as validationSchema } from "../validation/Validate";
import { useLocation, useNavigate } from "react-router-dom";
import { useMutation, useQuery } from "react-query";
import OverlayLoading from "../../loading/OverlayLoading";
import { LoginContext } from "../../../contexts/LoginContext";
import { getUserData } from "../../../api/user";
import { useFormik } from "formik";
import { createOrder, createOrderVisa } from "../../../api/orders";
import toast from "react-hot-toast";

function OrderDetails() {
  const [show, setShow] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || "/cart";

  const paymentMethods = {
    UPON_RECEIPT: "upon-receipt",
    CREDIT_CARD: "credit-card",
  };

  const [paymentMethod, setPaymentMethod] = useState(
    paymentMethods.UPON_RECEIPT,
  );

  const { userToken } = useContext(LoginContext);

  const orderMutaion = useMutation((data) => createOrder(userToken, data), {
    onSuccess: (data) => {
      if (data.error) {
        toast.error(data.error);
      } else {
        toast.success("تم رفع طلبك, انتظر حتى يتم تأكيد الطلب", {
          duration: 5000,
        });
        navigate("/");
      }
    },
  });

  const orderVisaMutaion = useMutation(
    (data) => createOrderVisa(userToken, data),
    {
      onSuccess: (data) => {
        if (data.error) {
          toast.error(data.error);
        } else {
          toast.success("تم رفع طلبك بنجاح", {
            duration: 5000,
          });
          window.open(data.url, "_blank", "noopener,noreferrer");
        }
      },
    },
  );

  const {
    data,
    isLoading: userLoading,
    error: userError,
  } = useQuery(["user"], () => getUserData(userToken), {
    enabled: !!userToken,
  });

  const [addressUsed, setAddressUsed] = useState(
    data?.user ? "default" : "new-address",
  );

  const getInitialValues = () => {
    if (addressUsed === "default" && data?.user) {
      return {
        city: data.user.Address.city,
        street: data.user.Address.street,
        description: data.user.Address.description,
        phoneNumber: data.user.phoneNumber,
        note: "",
        couponName: "",
      };
    } else {
      return {
        city: "",
        street: "",
        description: "",
        phoneNumber: "",
        note: "",
        couponName: "",
      };
    }
  };

  const formik = useFormik({
    initialValues: getInitialValues(),
    validationSchema,
    onSubmit: (values) => {
      const denormalized = {};
      denormalized.phoneNumber = values.phoneNumber;
      denormalized.Address = {
        city: values.city,
        street: values.street,
        description: values.description,
      };
      // denormalized.note = values.note;
      if (paymentMethod === paymentMethods.UPON_RECEIPT)
        orderMutaion.mutate(denormalized);
      else orderVisaMutaion.mutate(denormalized);
    },
  });

  useEffect(() => {
    if (data?.user) {
      formik.resetForm({
        values: getInitialValues(),
      });
    }
  }, [addressUsed, data]);

  return (
    <Modal
      onExited={() => {
        navigate(from);
      }}
      show={show}
      backdrop="static"
      keyboard={false}
    >
      {(userLoading ||
        orderMutaion.isLoading ||
        orderVisaMutaion.isLoading) && <OverlayLoading />}
      <Modal.Header>
        <Modal.Title>إنهاء الطلب</Modal.Title>
      </Modal.Header>

      {userError || data?.error ? (
        <Modal.Body>
          <p className="text-danger text-center">
            خطأ اثناء استرجاع بيانات المتسخدم
          </p>
        </Modal.Body>
      ) : (
        <Modal.Body>
          <h2 className="fs-5">العنوان</h2>
          <div className="d-flex gap-2 border-bottom pb-3">
            <div className="w-50">
              <input
                type="radio"
                className="custom-radio btn-check"
                name="address-set"
                id={"default"}
                autoComplete="off"
                checked={addressUsed === "default"}
                onChange={() => setAddressUsed("default")}
                disabled={!data?.user.Address}
              />
              <label
                className="btn btn-outline d-block mt-2 text-main-dark d-flex align-items-center justify-content-center"
                htmlFor={"default"}
              >
                العنوان الافتراضي
              </label>
            </div>
            <div className="w-50">
              <input
                type="radio"
                className="custom-radio btn-check"
                name="address-set"
                id={"new-address"}
                autoComplete="off"
                checked={addressUsed === "new-address"}
                onChange={() => setAddressUsed("new-address")}
              />
              <label
                className="btn btn-outline d-block mt-2 text-main-dark d-flex align-items-center justify-content-center"
                htmlFor={"new-address"}
              >
                عنوان جديد
              </label>
            </div>
          </div>
          <form className="mt-2" onSubmit={formik.handleSubmit}>
            <Form.Group>
              <Form.Label htmlFor="city-field" className="my-1">
                المدينة
              </Form.Label>
              <Form.Control
                id="city-field"
                name="city"
                onChange={formik.handleChange}
                value={formik.values.city}
                className="checkout-input"
                onBlur={formik.handleBlur}
                isInvalid={formik.touched.city && !!formik.errors.city}
                placeholder="ادخل المدينة"
                disabled={data?.user.Address && addressUsed === "default"}
              />
              <Form.Control.Feedback type="invalid">
                {formik.errors.city}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group>
              <Form.Label htmlFor="street-field" className="my-1">
                الشارع
              </Form.Label>
              <Form.Control
                id="street-field"
                name="street"
                placeholder="ادخل الشارع"
                onChange={formik.handleChange}
                value={formik.values.street}
                onBlur={formik.handleBlur}
                isInvalid={formik.touched.street && !!formik.errors.street}
                className="checkout-input"
                disabled={data?.user.Address && addressUsed === "default"}
              />
              <Form.Control.Feedback type="invalid">
                {formik.errors.street}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="">
              <Form.Label htmlFor="description-field" className="my-1">
                الوصف
              </Form.Label>
              <Form.Control
                id="description-field"
                name="description"
                placeholder="وصف العنوان"
                onChange={formik.handleChange}
                value={formik.values.description}
                className="checkout-input"
                onBlur={formik.handleBlur}
                isInvalid={
                  formik.touched.description && !!formik.errors.description
                }
                disabled={data?.user.Address && addressUsed === "default"}
              />
              <Form.Control.Feedback type="invalid">
                {formik.errors.description}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="pb-3 border-bottom">
              <Form.Label htmlFor="phone-field" className="my-1">
                رقم الهاتف
              </Form.Label>
              <Form.Control
                id="phone-field"
                name="phoneNumber"
                placeholder="ادخل رقم الهاتف"
                onChange={formik.handleChange}
                value={formik.values.phoneNumber}
                onBlur={formik.handleBlur}
                isInvalid={
                  formik.touched.phoneNumber && !!formik.errors.phoneNumber
                }
                className="checkout-input"
              />
              <Form.Control.Feedback type="invalid">
                {formik.errors.phoneNumber}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="pb-3 border-bottom">
              <Form.Label htmlFor="coupon-field" className="my-1">
                الكوبون
              </Form.Label>
              <Form.Control
                id="coupon-field"
                name="couponName"
                placeholder="ادخل كوبون"
                onChange={formik.handleChange}
                value={formik.values.couponName}
                onBlur={formik.handleBlur}
                isInvalid={
                  formik.touched.couponName && !!formik.errors.couponName
                }
                className="checkout-input"
              />
              <Form.Control.Feedback type="invalid">
                {formik.errors.couponName}
              </Form.Control.Feedback>
            </Form.Group>
            <h2 className="fs-5 mt-2">الملاحظات</h2>
            <Form.Control
              className="checkout-input checkout-notes"
              id="note-field"
              name="note"
              onChange={formik.handleChange}
              value={formik.values.note}
              as="textarea"
              rows={3}
              placeholder="ادخل ملاحظاتك هنا"
            ></Form.Control>
          </form>
          <div className="p-2">
            <h3 className="fs-6 fw-bold">اختر طريقة الدفع</h3>
            <div>
              <input
                type="radio"
                className="custom-radio btn-check"
                name="payment-method"
                id={paymentMethods.UPON_RECEIPT}
                autoComplete="off"
                checked={paymentMethod === paymentMethods.UPON_RECEIPT}
                onChange={() => setPaymentMethod(paymentMethods.UPON_RECEIPT)}
              />
              <label
                className="btn btn-outline d-block mt-2 text-end text-gray"
                htmlFor={paymentMethods.UPON_RECEIPT}
              >
                <svg
                  width="18px"
                  height="18px"
                  viewBox="0 0 24 24"
                  fill="#282828"
                  xmlns="http://www.w3.org/2000/svg"
                  className="ms-2"
                >
                  <g id="SVGRepo_bgCarrier" strokeWidth={0} />
                  <g
                    id="SVGRepo_tracerCarrier"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <g id="SVGRepo_iconCarrier">
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M1 6C1 4.89543 1.89543 4 3 4H14C15.1046 4 16 4.89543 16 6V7H19C21.2091 7 23 8.79086 23 11V12V15V17C23.5523 17 24 17.4477 24 18C24 18.5523 23.5523 19 23 19H22H18.95C18.9828 19.1616 19 19.3288 19 19.5C19 20.8807 17.8807 22 16.5 22C15.1193 22 14 20.8807 14 19.5C14 19.3288 14.0172 19.1616 14.05 19H7.94999C7.98278 19.1616 8 19.3288 8 19.5C8 20.8807 6.88071 22 5.5 22C4.11929 22 3 20.8807 3 19.5C3 19.3288 3.01722 19.1616 3.05001 19H2H1C0.447715 19 0 18.5523 0 18C0 17.4477 0.447715 17 1 17V6ZM16.5 19C16.2239 19 16 19.2239 16 19.5C16 19.7761 16.2239 20 16.5 20C16.7761 20 17 19.7761 17 19.5C17 19.2239 16.7761 19 16.5 19ZM16.5 17H21V15V13H19C18.4477 13 18 12.5523 18 12C18 11.4477 18.4477 11 19 11H21C21 9.89543 20.1046 9 19 9H16V17H16.5ZM14 17H5.5H3V6H14V8V17ZM5 19.5C5 19.2239 5.22386 19 5.5 19C5.77614 19 6 19.2239 6 19.5C6 19.7761 5.77614 20 5.5 20C5.22386 20 5 19.7761 5 19.5Z"
                    />
                  </g>
                </svg>
                الدفع عند الاستلام
              </label>
            </div>
            <div>
              <input
                type="radio"
                className="custom-radio btn-check"
                name="payment-method"
                id={paymentMethods.CREDIT_CARD}
                autoComplete="off"
                checked={paymentMethod === paymentMethods.CREDIT_CARD}
                onChange={() => setPaymentMethod(paymentMethods.CREDIT_CARD)}
              />
              <label
                className="btn btn-outline d-block mt-2 text-end text-gray"
                htmlFor={paymentMethods.CREDIT_CARD}
              >
                <svg
                  width="18px"
                  height="18px"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="ms-2"
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
                      d="M3 9H21M7 15H9M6.2 19H17.8C18.9201 19 19.4802 19 19.908 18.782C20.2843 18.5903 20.5903 18.2843 20.782 17.908C21 17.4802 21 16.9201 21 15.8V8.2C21 7.0799 21 6.51984 20.782 6.09202C20.5903 5.71569 20.2843 5.40973 19.908 5.21799C19.4802 5 18.9201 5 17.8 5H6.2C5.0799 5 4.51984 5 4.09202 5.21799C3.71569 5.40973 3.40973 5.71569 3.21799 6.09202C3 6.51984 3 7.07989 3 8.2V15.8C3 16.9201 3 17.4802 3.21799 17.908C3.40973 18.2843 3.71569 18.5903 4.09202 18.782C4.51984 19 5.07989 19 6.2 19Z"
                      stroke="#282828"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </g>
                </svg>
                الدفع باستخدام بطاقة إتمان
              </label>
            </div>
          </div>
        </Modal.Body>
      )}

      <Modal.Footer>
        <Button variant="secondary" onClick={() => setShow(false)}>
          إغلاق
        </Button>
        <Button
          variant="success"
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

export default OrderDetails;
