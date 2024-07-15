import React, { useState, useContext, useEffect } from "react";
import "./productsList.css";
import {
  Row,
  Col,
  Dropdown,
  Button,
  OverlayTrigger,
  Popover,
  Form,
} from "react-bootstrap";
import { Link, useLocation, useNavigate } from "react-router-dom";
import ConfirmActionDialog from "./ConfirmActionDialog";
import Loading from "../../loading/Loading";
import * as yup from "yup";
import { useQuery, useQueryClient } from "react-query";
import { getAllProducts } from "../../../api/products";
import { LoginContext } from "../../../contexts/LoginContext";
import ProductsPagination from "./ProductsPagination";
import { getAllCategories } from "../../../api/categories";
import { getSubcategories } from "../../../api/subcategories";
import {} from "react-select";
import { useFormik } from "formik";

function ProductsList() {
  const actions = { H: "hide", D: "delete", V: "visible" };
  const [action, setAction] = useState("");
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [selectedProduct, setProduct] = useState("");
  const querClient = useQueryClient();

  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(12);
  const [sort, setSort] = useState(null);
  const [search, setSearch] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const page = parseInt(params.get("page")) || 1;
    const limitParam = parseInt(params.get("limit")) || 12;
    const sortParam = params.get("sort") || "";
    const queryParam = params.get("query") || "";

    setCurrentPage(page);
    setLimit(limitParam);
    setSort(sortParam);
    setSearch(queryParam);
  }, [location.search]);

  const handlePageChange = (page) => {
    console.log(page);
    setCurrentPage(page);
    navigate(`?page=${page}&limit=${limit}&sort=${sort}&query=${search}`);
  };

  const handleLimitChange = (event) => {
    const newLimit = parseInt(event.target.value);
    setLimit(newLimit);
    navigate(
      `?page=${currentPage}&limit=${newLimit}&sort=${sort}&query=${search}`,
    );
  };

  const handleSortChange = (event) => {
    const newSort = event.target.value;
    setSort(newSort);
    navigate(
      `?page=${currentPage}&limit=${limit}&sort=${newSort}&query=${search}`,
    );
  };

  const searchForm = useFormik({
    initialValues: {
      query: search,
    },
    validationSchema: yup.object({
      query: yup.string(),
    }),
    onSubmit: (values) => {
      setSearch(values.query);
      navigate(
        `?page=${currentPage}&limit=${limit}&sort=${sort}&query=${values.query}`,
      );
    },
  });

  const { userToken } = useContext(LoginContext);

  const handleActionConfirm = (action, product) => {
    setAction(action);
    setProduct(product);
    setShowConfirmDialog(true);
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentPage]);

  const {
    data: categories,
    isLoading: catLoading,
    error: catError,
  } = useQuery(["categories"], () => getAllCategories(userToken), {
    enabled: !!userToken,
  });

  const {
    data: subcategories,
    isLoading: subLoading,
    error: subError,
  } = useQuery(["subcategories_names"], () => getSubcategories(userToken), {
    enabled: !!userToken,
  });

  const { data, error, isLoading } = useQuery(
    ["all-products", currentPage, limit, sort, search],
    () => getAllProducts(userToken, limit, currentPage, sort, search),
    { enabled: !!userToken },
  );

  if (isLoading || catLoading || subLoading) {
    return <Loading />;
  }

  if (error || !data || catError || !categories || subError || !subcategories) {
    return (
      <div className="d-flex vh-100 justify-content-center align-items-center">
        <p className="text-danger fs-4">حدث خطأ غير متوقع</p>
      </div>
    );
  }

  const renderedProducts = data.products.map((product) => (
    <div key={product.name + product.variants[0].itemNo}>
      <Row className="product-wrapper mt-2 mx-2 py-2 border rounded">
        <Col xs={3} className="">
          <Link className="d-block w-100 product-name-link m-0 text-center text-black text-decoration-none">
            {product.name}
          </Link>
        </Col>
        <Col xs={3}>
          <p className="m-0 text-center">{product.brand}</p>
        </Col>
        <Col xs={3}>
          <p className="m-0 text-center">
            {
              categories.category.find((cat) => cat._id === product.categoryId)
                .name
            }
          </p>
        </Col>
        <Col xs={2}>
          <p className="m-0 text-center">
            {subcategories.subcategories.find(
              (subcateg) => subcateg._id === product.subcategoryId,
            )?.name ?? "*لم يحدد*"}
          </p>
        </Col>
        <Col xs={1} className="d-flex justify-content-center">
          <Dropdown drop="down-centered">
            <Dropdown.Toggle className="m-0 p-0" as={CustomToggle}>
              <img src="/svgs/dashboard-options.svg" alt="Dashboard options" />
            </Dropdown.Toggle>
            <Dropdown.Menu className="dashboard-options-dropdown px-2">
              <Button
                className="d-block w-100"
                as={Link}
                to={`update/${product.slug}`}
                state={{ data: product }}
                variant="primary"
              >
                تعديل المنتج
              </Button>
              <Button
                className="d-block w-100 mt-2"
                variant={product.status === "Active" ? "warning" : "success"}
                onClick={() =>
                  handleActionConfirm(
                    product.status === "Active" ? actions.H : actions.V,
                    product,
                  )
                }
              >
                {product.status === "Active"
                  ? "اخفاء من المتجر"
                  : "اظهار المنتج"}
              </Button>
              <Button
                className="d-block w-100 mt-2"
                variant="danger"
                onClick={() => handleActionConfirm(actions.D, product)}
              >
                حذف
              </Button>
            </Dropdown.Menu>
          </Dropdown>
        </Col>
      </Row>
      <div className="varient-wrapper mx-5 mt-1 border rounded">
        <Row className="border-bottom mx-3 my-2 pb-1">
          <Col xs={3}>
            <p className="m-0 text-center">رقم المنتج</p>
          </Col>
          <Col xs={3}>
            <p className="m-0 text-center">المتبقي في المخزون</p>
          </Col>
          <Col xs={3}>
            <p className="m-0 text-center">السعر</p>
          </Col>
          <Col xs={3}>
            <p className="m-0 text-center">الخصم</p>
          </Col>
        </Row>
        {product.variants.map((item) => (
          <Row className="mx-3 pb-1" key={item.itemNo}>
            <Col xs={3}>
              <p className="m-0 text-center">{item.itemNo}</p>
            </Col>
            <Col xs={3}>
              <p className="m-0 text-center">{item.inStoke}</p>
            </Col>
            <Col xs={3}>
              <p className="m-0 text-center">{item.price}</p>
            </Col>
            <Col xs={3}>
              <p className="m-0 text-center">{item.discount}</p>
            </Col>
          </Row>
        ))}
      </div>
    </div>
  ));

  return (
    <section>
      <h2 className="border-bottom pb-2 mt-2">قائمة المنتجات</h2>

      <Row as="article">
        <Col xl={3} lg={4} sm={6}>
          <h3 className="fs-6">عدد المنتجات في الصفحة الواحدة</h3>
          <Form.Select value={limit} onChange={handleLimitChange}>
            <option value={12}>12</option>
            <option value={16}>16</option>
            <option value={20}>20</option>
          </Form.Select>
        </Col>

        <Col xl={3} lg={4} sm={6}>
          <h3 className="fs-6">ترتيب حسب</h3>
          <Form.Select value={sort} onChange={handleSortChange}>
            <option className="select-option" value="">
              بلا
            </option>
            <option className="select-option" value="minPrice">
              Price: Low to High
            </option>
            <option className="select-option" value="-minPrice">
              Price: High to Low
            </option>
          </Form.Select>
        </Col>

        <Col xl={3} lg={4} sm={6}>
          <h3 className="fs-6">البحث</h3>
          <form className="d-flex gap-2" onSubmit={searchForm.handleSubmit}>
            <Form.Control
              id="query"
              name="query"
              type="text"
              placeholder="ابحث..."
              value={searchForm.values.query}
              onChange={searchForm.handleChange}
            />
            <Button type="submit" variant="success" className="bg-main-dark border-0">
              بحث
            </Button>
          </form>
        </Col>
      </Row>

      <OverlayTrigger
        trigger={["hover", "focus"]}
        overlay={<Popover className="p-2 mb-1">إضافة منتج جديد</Popover>}
      >
        <Button as={Link} to="create" className="add-new-btn my-3">
          <img src="/svgs/plus-sign.svg" />
        </Button>
      </OverlayTrigger>

      <Row className="mt-4 mx-2 pb-1 border-bottom">
        <Col xs={3}>
          <p className="m-0 text-center fw-bold">إسم المنتج</p>
        </Col>
        <Col xs={3}>
          <p className="m-0 text-center fw-bold">الشركة</p>
        </Col>
        <Col xs={3}>
          <p className="m-0 text-center fw-bold">الفئة</p>
        </Col>
        <Col xs={2}>
          <p className="m-0 text-center fw-bold">الفئة الفرعية</p>
        </Col>
        <Col xs={1}>
          <p className="m-0 text-center fw-bold">خيارات</p>
        </Col>
      </Row>
      {renderedProducts}
      <ConfirmActionDialog
        show={showConfirmDialog}
        handleClose={() => setShowConfirmDialog(false)}
        action={action}
        actionSet={actions}
        product={selectedProduct}
      />

      <ProductsPagination
        numberOfPages={Math.ceil(data.countAllProducts / limit)}
        activePage={currentPage}
        setActivePage={handlePageChange}
      />
    </section>
  );
}

const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
  <button
    className="m-0 p-0 btn"
    ref={ref}
    onClick={(e) => {
      e.preventDefault();
      onClick(e);
    }}
  >
    {children}
  </button>
));

CustomToggle.displayName = "CustomToggle";

export default ProductsList;
