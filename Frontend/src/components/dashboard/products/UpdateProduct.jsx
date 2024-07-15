import React, { useContext, useEffect, useState } from "react";
import * as yup from "yup";
import {
  Container,
  Row,
  Col,
  Form,
  Modal,
  Button,
  OverlayTrigger,
  Popover,
} from "react-bootstrap";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Input from "../../../shared/Input/Input";
import "react-bootstrap-typeahead/css/Typeahead.css";
import Loading from "../../loading/Loading";
import { useFormik } from "formik";
import { Typeahead } from "react-bootstrap-typeahead";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { getAllCategories } from "../../../api/categories.js";
import { getSubByCategory } from "../../../api/subcategories.js";
import { updateProduct } from "../../../api/products.js";
import { toast } from "react-hot-toast";
import { LoginContext } from "../../../contexts/LoginContext.jsx";

function UpdateProduct() {
  const location = useLocation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [selectedCategory, setSelectedCategory] = useState([]);
  const [selectedSubcategory, setSelectedSubcategory] = useState([]);

  const { userToken } = useContext(LoginContext);

  const { data: currentProduct } = location.state || {};

  // TODO: Get current product from the props and extract its category and subcatagory but their provided ids
  const {
    data: categories,
    isLoading: catLoading,
    error: catError,
  } = useQuery(["categories"], () => getAllCategories(userToken), {
    enabled: !!userToken,
    onSuccess: (data) => {
      setSelectedCategory([
        data.category.find(
          (categ) => categ._id === currentProduct.categoryId,
        ) ?? "",
      ]);
    },
  });

  const {
    data: subcategories,
    isLoading: subLoading,
    error: subError,
  } = useQuery(
    ["subcategories", selectedCategory ? selectedCategory[0]?._id : ""],
    () => getSubByCategory(userToken, selectedCategory[0]._id),
    {
      enabled: selectedCategory.length > 0,
      onSuccess: (data) => {
        setSelectedSubcategory([
          data.subcategory.find(
            (sub) => sub._id === currentProduct.subcategoryId,
          ) ?? "",
        ]);
      },
    },
  );

  const updateMutation = useMutation(
    (data) => updateProduct(data, userToken, currentProduct._id),
    {
      onSuccess: (data) => {
        if (data.error) {
          toast.error(data.error);
        } else {
          toast.success("تم انشاء المنتج بنجاح");
          queryClient.invalidateQueries(["all-products"]);
          navigate("..");
        }
      },
      onError: (error) => {
        console.log(error);
        toast.error("خطأ");
      },
    },
  );

  const onSubmit = (data) => {
    const temp = JSON.parse(JSON.stringify(data));

    temp.categoryId = selectedCategory[0].id;
    delete temp.category;
    temp.subcategoryId = selectedSubcategory[0].id;
    delete temp.subcategory;
    temp.variants = { items: data.variants };

    const formData = new FormData();

    for (const formKey of Object.keys(temp)) {
      const value = temp[formKey];
      if (typeof value === "object" && value !== null) {
        formData.append(formKey, JSON.stringify(value));
        continue;
      }

      formData.append(formKey, temp[formKey]);
    }

    formData.delete("image");
    if (data.image instanceof File) formData.append("image", data.image);

    console.log(formData.get("id"));

    updateMutation.mutate(formData);
  };

  const formik = useFormik({
    initialValues: {
      image: currentProduct.image,
      name: currentProduct?.name ?? "",
      category: currentProduct?.category ?? "",
      brand: currentProduct?.brand ?? "",
      subcategory: currentProduct?.subcategory ?? "",
      specifications: currentProduct?.specifications ?? "",
      variants: [...(currentProduct?.variants ?? [])],
    },
    onSubmit,
  });

  const [showAttributeDialog, setShowAttributeDialog] = useState(false);

  const [activeVariantPopover, setActiveVariantPopover] = useState(-1); // determined by its index
  const [selectedVariantToRemove, setSelectedVariantToRemove] = useState(-1);

  const removeVariant = () => {
    formik.values.variants.splice(selectedVariantToRemove, 1);
    setActiveVariantPopover(null);
    setSelectedVariantToRemove(null);
    console.log(formik.values.variants);
  };

  const removeVariantOverlay = (
    <Popover
      variant="dark"
      className="d-flex justify-content-center align-items-center m-0 p-2"
    >
      {formik.values.variants.length > 1 ? (
        <>
          <p className="m-0">هل تريد حذف هذا الصنف؟</p>
          <Button
            className="me-2 p-1"
            variant="success"
            onClick={removeVariant}
          >
            <img src="/svgs/check.svg" alt="" />
          </Button>
        </>
      ) : (
        <p className="m-0">
          <span>
            <img src="/svgs/info-circle.svg" className="ms-1" />
          </span>
          يوجد فئة واحدة لهذا المنتج
        </p>
      )}
    </Popover>
  );

  /*** New attribute ***/

  const attributeNameSchema = yup.object({
    attributeName: yup
      .string()
      .matches(
        /^[A-Za-z ]*$/,
        "يمكنك استخدام الاحرف الانجليزية الصغيرة والكبيرة والمسافات فقط",
      ),
  });

  const attributeName = useFormik({
    initialValues: {
      attributeName: "",
    },
    validationSchema: attributeNameSchema,
  });

  const [showAttributeNameError, setShowAttributeNameError] = useState(false);
  const [activeAttributePopover, setActiveAttributePopover] = useState(null);
  const [selectedAttributeToRemove, setSelectedAttributeToRemove] =
    useState(null);

  const toCamelCase = (str) => {
    return str
      .split(" ")
      .map((word, index) => {
        if (index === 0) {
          return word.toLowerCase();
        } else {
          return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
        }
      })
      .join("");
  };

  const decamelCase = (str) => {
    return str
      .replace(/([A-Z])/g, " $1")
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };

  const removeAttribute = () => {
    formik.values.variants.forEach((variant) => {
      delete variant.attributes[selectedAttributeToRemove];
    });
    setActiveAttributePopover(null);
    setSelectedAttributeToRemove(null);
    console.log(formik.values.variants);
  };

  const removeAttributeOverlay = (
    <Popover
      variant="dark"
      className="d-flex justify-content-center align-items-center m-0 p-2"
    >
      <p className="m-0">هل تريد حذف هذه الصفة</p>
      <Button className="me-2 p-1" variant="success" onClick={removeAttribute}>
        <img src="/svgs/check.svg" alt="" />
      </Button>
    </Popover>
  );

  const validateAttributeName = () => {
    attributeNameSchema
      .validate(attributeName.values)
      .then(() => {
        formik.values.variants.forEach((variant) => {
          variant.attributes[toCamelCase(attributeName.values.attributeName)] =
            "";
        });
        setShowAttributeDialog(false);
      })
      .catch((_) => {
        setShowAttributeNameError(true);
      });
  };

  /****** Product image ******/

  const [previewImage, setPreviewImage] = useState(
    currentProduct?.image.secure_url ?? null,
  );

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

  /****** Attribute Dialog ******/

  const attributeDialog = (
    <Modal
      show={showAttributeDialog}
      onHide={() => {
        setShowAttributeDialog(false);
      }}
    >
      <Modal.Header>
        <Modal.Title>إضافة صفة للمنتج</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>اسم الصفة (يجب ان يتكون من حروف انجليزية ومسافات فقط)</p>
        <Form.Control
          className="attribute-input"
          name="attributeName"
          value={attributeName.values.attributeName}
          onChange={attributeName.handleChange}
          placeholder="ادخل اسم الصفة هنا"
        />
        {showAttributeNameError && (
          <Form.Text className="text-danger">
            {attributeName.errors.attributeName}
          </Form.Text>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="secondary"
          onClick={() => {
            setShowAttributeDialog(false);
          }}
        >
          إلغاء
        </Button>
        <Button variant="success" onClick={() => validateAttributeName()}>
          تأكيد
        </Button>
      </Modal.Footer>
    </Modal>
  );

  /********** New Variant ***********/

  const addVariant = () => {
    let variant = {
      itemNo: "",
      inStoke: "",
      price: "",
    };
    let attributes = {};
    Object.keys(formik.values.variants[0].attributes).forEach((key) => {
      attributes[key] = "";
    });
    console.log("attributes: ", attributes);
    variant["attributes"] = attributes;
    console.log("variant: ", variant);
    formik.setFieldValue("variants", [...formik.values.variants, variant]);
    console.log("formik: ", formik.values);
  };

  if (catLoading || !categories) {
    return <Loading />;
  }

  if (catError || subError) {
    return (
      <div className="d-flex vh-100 justify-content-center align-items-center">
        <p className="text-danger fs-4">حدث خطأ غير متوقع</p>
      </div>
    );
  }

  return (
    <section>
      <Container fluid className="mb-3">
        <h2 className="border-bottom pb-2 mt-2">تعديل المنتج</h2>

        <div className="update-product-card mx-auto">
          <form onSubmit={formik.handleSubmit} encType="multipart/form-data">
            <Form.Text
              as="h3"
              className="sub-title fs-4 m-0 my-3 p-2 border rounded text-black"
            >
              معلومات المنتج
            </Form.Text>

            <Row className="border-bottom mb-4 pb-4">
              <Col xs={12} md={6} className="">
                <Form.Group controlId="formFile" className="mb-3 mx-auto">
                  <Form.Label className="text-main-dark">
                    تعديل صورة المنتج
                  </Form.Label>
                  <div className="px-5 py-3 mb-3 border rounded-3">
                    <img
                      className="w-100 rounded-3"
                      src={previewImage}
                      alt="صورة للمنتج المراد تعديله"
                    />
                  </div>
                  <Form.Control
                    type="file"
                    className="product-image"
                    onChange={handleImageChange}
                  />
                </Form.Group>
              </Col>
              <Col xs={12} md={6}>
                <Row className="">
                  <Col xs={12}>
                    <Input
                      id="product-name"
                      name="name"
                      onChange={formik.handleChange}
                      type="text"
                      value={formik.values.name}
                      title="إسم المنتج"
                      errorMessage={formik.errors.name}
                    />
                  </Col>

                  <Col xs={12}>
                    <Input
                      id="brand"
                      name="brand"
                      type="text"
                      onChange={formik.handleChange}
                      value={formik.values.brand}
                      title="الشركة"
                      errorMessage={formik.errors.brand}
                    />
                  </Col>

                  <Col xs={12}>
                    <Form.Group>
                      <Form.Label htmlFor="category" className="text-main-dark">
                        الفئة
                      </Form.Label>

                      <Typeahead
                        className="mb-2"
                        id="category"
                        options={categories.category}
                        labelKey="name"
                        placeholder="اختر الفئة..."
                        selected={selectedCategory}
                        onChange={setSelectedCategory}
                      />
                    </Form.Group>
                  </Col>

                  <Col xs={12}>
                    <Form.Group>
                      <Form.Label
                        htmlFor="subcategory"
                        className="text-main-dark"
                      >
                        الفئة الفرعية
                      </Form.Label>
                      <Typeahead
                        className="mb-2"
                        id="subcategory"
                        disabled={selectedCategory.length === 0 || subLoading}
                        isLoading={subLoading}
                        options={subcategories?.subcategory}
                        labelKey="name"
                        placeholder="اختر الفئة الفرعية..."
                        selected={selectedSubcategory}
                        onChange={setSelectedSubcategory}
                      />
                    </Form.Group>
                  </Col>
                </Row>
              </Col>
            </Row>

            <Form.Text
              as="h3"
              className="sub-title fs-4 m-0 my-3 p-2 border rounded text-black"
            >
              أصناف المنتج
            </Form.Text>

            <h3 className="fs-5 fw-bold mb-1 mt-3">
              قائمة المواصفات لهذا المنتج
            </h3>
            <Row className="border-bottom mb-4 pb-4">
              {Object.keys(formik.values.variants[0]?.attributes ?? []).map(
                (attribute) => (
                  <Col key={attribute} xs={3} className="mt-3">
                    <div className="attribute-label position-relative">
                      <p className="m-0 text-center text-capitalize">
                        {decamelCase(attribute)}
                      </p>
                      <OverlayTrigger
                        trigger="click"
                        overlay={removeAttributeOverlay}
                        show={activeAttributePopover === attribute}
                        onToggle={() => {
                          setSelectedAttributeToRemove(attribute);
                          setActiveAttributePopover(
                            attribute === activeAttributePopover
                              ? null
                              : attribute,
                          );
                        }}
                      >
                        <Button
                          className="remove-attribute-btn position-absolute rounded-pill p-1 py-0"
                          variant="danger"
                        >
                          <img src="/svgs/close-icon.svg" alt="" />
                        </Button>
                      </OverlayTrigger>
                    </div>
                  </Col>
                ),
              )}

              <Col xs={3} className="mt-3">
                <OverlayTrigger
                  trigger={["hover", "focus"]}
                  overlay={
                    <Popover className="p-2 mb-1">إضافة صفة جديدة</Popover>
                  }
                >
                  <Button
                    className="add-new-btn"
                    onClick={() => setShowAttributeDialog(true)}
                  >
                    <img src="/svgs/plus-sign.svg" />
                  </Button>
                </OverlayTrigger>
              </Col>
            </Row>

            {formik.values.variants.map((_, index) => (
              <Row key={index} className="mb-4 justify-content-center">
                <Col xs={12} className="position-relative">
                  <OverlayTrigger
                    trigger="click"
                    overlay={removeVariantOverlay}
                    show={activeVariantPopover === index}
                    onToggle={() => {
                      setSelectedVariantToRemove(index);
                      setActiveVariantPopover(
                        index === activeVariantPopover ? -1 : index,
                      );
                    }}
                  >
                    <Button
                      className="remove-variant-btn position-absolute rounded-pill p-1 py-0"
                      variant="danger"
                    >
                      <img src="/svgs/close-icon.svg" alt="" />
                    </Button>
                  </OverlayTrigger>
                  <h4 className="variant-header fs-5 p-1 px-2 border rounded">
                    الصنف {index + 1}
                  </h4>
                </Col>
                <Col xs={4}>
                  <Input
                    id="item-no"
                    name={`variants[${index}].itemNo`}
                    type="text"
                    onChange={formik.handleChange}
                    value={formik.values.variants[index].itemNo}
                    title="رقم المنتج"
                  />
                </Col>
                <Col xs={4}>
                  <Input
                    id="price"
                    name={`variants[${index}].price`}
                    type="text"
                    onChange={formik.handleChange}
                    value={formik.values.variants[index].price}
                    title="السعر"
                  />
                </Col>
                <Col xs={4}>
                  <Input
                    id="in-stoke"
                    name={`variants[${index}].inStoke`}
                    type="number"
                    onChange={formik.handleChange}
                    value={formik.values.variants[index].inStoke}
                    title="الكمية"
                  />
                </Col>
                <Col xs={12}>
                  <h5 className="mt-2 pb-1 border-bottom">المواصفات</h5>
                </Col>
                <Row xs={12}>
                  {Object.keys(formik.values.variants[index].attributes)
                    .length == 0 ? (
                    <p className="text-center text-secondary">
                      لا يوجد مواصفات لهذا الصنف
                    </p>
                  ) : (
                    Object.keys(formik.values.variants[index].attributes).map(
                      (attribute) => (
                        <Col key={attribute} xs={6} md={4} lg={3}>
                          <Input
                            name={`variants[${index}].attributes[${attribute}]`}
                            title={decamelCase(attribute)}
                            onChange={formik.handleChange}
                            value={
                              formik.values.variants[index].attributes[
                                attribute
                              ]
                            }
                          />
                        </Col>
                      ),
                    )
                  )}
                </Row>
              </Row>
            ))}

            <OverlayTrigger
              trigger={["hover", "focus"]}
              overlay={<Popover className="p-2 mb-1">إضافة صنف جديد</Popover>}
            >
              <Button className="add-new-btn" onClick={() => addVariant()}>
                <img src="/svgs/plus-sign.svg" />
              </Button>
            </OverlayTrigger>

            <Form.Group className="mt-3">
              <Form.Label>وصف المنتج (إختياري)</Form.Label>
              <Form.Control
                className="product-description-field"
                as="textarea"
                placeholder="أدخل وصف المنتج هنا"
                onChange={formik.handleChange}
                value={formik.values.specifications}
              />
            </Form.Group>
            <div className="d-flex justify-content-end mt-3 gap-4">
              <Button type="button" variant="secondary">
                <span>إلغاء</span>
              </Button>

              <OverlayTrigger
                trigger={["hover", "focus"]}
                overlay={
                  <Popover className="p-2 mb-1">
                    <img src="/svgs/info-circle.svg" className="ms-1" />
                    قم بمراجعة التغييرات قبل الحفظ
                  </Popover>
                }
              >
                <Button type="submit" variant="success">
                  <span>حفظ التغيرات</span>
                </Button>
              </OverlayTrigger>
            </div>
          </form>
        </div>
      </Container>
      {attributeDialog}
    </section>
  );
}

export default UpdateProduct;
