import "./home.css";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import CategoriesSwiper from "../categories/CategoriesSwiper.jsx";
import Loading from "../../loading/Loading.jsx";
import {
  getProductsDiscount,
  getProductsLastest,
  getProductsPopular,
  getProductsSpecial,
  getRecommended,
} from "../../../api/products.js";
import { useQuery } from "react-query";
import { LoginContext } from "../../../contexts/LoginContext.jsx";
import Header from "./Header.jsx";
import RecommmendedPorducts from "./RecommmendedPorducts.jsx";

function Home() {
  const navigate = useNavigate();
  const { userToken } = useContext(LoginContext);

  const {
    data: productsSpecial,
    isLoading: productsSpecialLoading,
    error: productsSpecialError,
  } = useQuery(["productsSpecial"], () => getProductsSpecial());

  const {
    data: productsDiscount,
    isLoading: productsDiscountLoading,
    error: productsDiscountError,
  } = useQuery(["productsDiscount"], () => getProductsDiscount());

  const {
    data: productsLastest,
    isLoading: productsLastestLoading,
    error: productsLastestError,
  } = useQuery(["productsLastest"], () => getProductsLastest());

  const {
    data: recommmended,
    isLoding: recommendedLoading,
    error: recommendedError,
  } = useQuery(["recommneded"], () => getRecommended(userToken), {
    enabled: !!userToken, // FIXME: when a guest user enters the store the token is null so the loading screen will keep going for ever
  });

  const {
    data: productsPopular,
    isLoading: productsPopularLoading,
    error: productsPopularError,
  } = useQuery(["productsPopular"], () => getProductsPopular());

  if (
    productsDiscountLoading ||
    productsSpecialLoading ||
    productsLastestLoading ||
    productsPopularLoading ||
    recommendedLoading
  ) {
    return <Loading />;
  }

  if (
    productsDiscountError ||
    productsSpecialError ||
    productsLastestError ||
    productsPopularError ||
    recommendedError
  ) {
    return (
      <section className="vh-100 d-flex justify-content-center align-items-center fs-1">
        <h2>خطأ في استرجاع البيانات ...</h2>
      </section>
    );
  }
  const handleProductClick = (product, sub) => {
    navigate(`/${product.slug}`, {
      state: { productId: product._id, subcategoryId: sub },
    });
  };

  return (
    <>
      <header className={`home-header min-vh-100 pt-5`}>
        <Header />
      </header>

      <section className="container py- mt-5">
        <Container>
          <div className="">
            <h2 className="text-center  ">أصنافنا</h2>
            <hr className="mb-5" />
            <CategoriesSwiper />
          </div>

          {userToken
            ? recommmended?.length > 0 && (
                <RecommmendedPorducts
                  recommmended={recommmended}
                  navigateFunction={handleProductClick}
                />
              )
            : null}

          <div className="row SpecialProducts">
            <h2 className="  text-center mb-4 border-bottom pb-2">
              منتجاتنا المميزة
            </h2>
            <Row xs={2} sm={2} md={3} lg={4}>
              {productsSpecial?.products.map((product) => (
                <Col key={product._id} className="mb-4 productCol">
                  <Card className="text-center ">
                    {product.minDiscount > 0 && (
                      <div className="bg-danger w-100  m-auto ">
                        <span className="text-white">
                          خصم بنسبة {product.minDiscount}%{" "}
                        </span>
                      </div>
                    )}

                    <div className="border border-bottom imgDiv border-top-0">
                      <Card.Img
                        variant="top"
                        src={product.image.secure_url}
                        className=" h-100 img-fluid"
                      />
                    </div>
                    <Card.Body className="d-flex flex-column justify-content-between">
                      <div>
                        <Card.Title className="text-gray">
                          {product.name}
                        </Card.Title>
                      </div>
                      <div>
                        <Card.Text>
                          {product.minDiscount > 0 ? (
                            <div className=" ">
                              <span className="fs-3 text-danger  text-decoration-line-through">
                                {product.minPrice} ₪
                              </span>
                              <span className="fs-4 d-block ">
                                {product.minPrice -
                                  (product.minPrice * product.minDiscount) /
                                    100}{" "}
                                ₪
                              </span>
                            </div>
                          ) : (
                            <span className="fs-4">{product.minPrice} ₪</span>
                          )}
                        </Card.Text>
                      </div>
                      <div className="btnsFav mt-2">
                        <Button
                          className="d-block bg-main-light m-auto border mt-1"
                          onClick={() =>
                            handleProductClick(product, product.subcategoryId)
                          }
                        >
                          <span className="favText">الذهاب إلى المنتج</span>
                        </Button>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          </div>
        </Container>
      </section>
      {/* {console.log(productsLastest?.products)} */}
      <section className="container lastestProducts pt-5 mt-5">
        <h2 className="text-center mb-4 border-bottom pb-2">
          {" "}
          المنتجات الأكثر طلبًا
        </h2>

        <Row xs={2} sm={2} md={3} lg={4}>
          {productsPopular?.products.map((product) => (
            <Col key={product._id} className="mb-4 productCol">
              <Card className="text-center ">
                {product.minDiscount > 0 && (
                  <div className="bg-danger w-100  m-auto ">
                    <span className="text-white">
                      خصم بنسبة {product.minDiscount}%{" "}
                    </span>
                  </div>
                )}

                <div className="border border-bottom imgDiv border-top-0">
                  <Card.Img
                    variant="top"
                    src={product.image.secure_url}
                    className=" h-100 img-fluid"
                  />
                </div>
                <Card.Body className="d-flex flex-column justify-content-between">
                  <div>
                    <Card.Title className="text-main-dark">
                      {product.name}
                    </Card.Title>
                  </div>
                  <div>
                    <Card.Text>
                      {product.minDiscount > 0 ? (
                        <div className="text-center">
                          <span className="fs-4 text-danger mx-1 ">
                            ₪
                            {product?.minPrice -
                              (product?.minPrice * product?.minDiscount) / 100}
                          </span>
                          <span className="fs-6 text-secondary text-decoration-line-through">
                            {product?.minPrice}
                          </span>
                        </div>
                      ) : (
                        <span className="fs-4">{product.minPrice} ₪</span>
                      )}
                    </Card.Text>
                  </div>
                  <div className="btnsFav mt-2">
                    <Button
                      className="d-block bg-main-light m-auto border mt-1"
                      onClick={() =>
                        handleProductClick(product, product.subcategoryId)
                      }
                    >
                      <span className="favText">الذهاب إلى المنتج</span>
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </section>

      <section className="container lastestProducts pt-5 mt-5">
        <h2 className="text-center mb-4 border-bottom pb-2">أحدث المنتجات</h2>

        <Row xs={2} sm={2} md={3} lg={5}>
          {productsLastest?.products.map((product) => (
            <Col key={product._id} className="mb-4 productCol">
              <Card className="text-center ">
                {product.minDiscount > 0 && (
                  <div className="bg-danger w-100  m-auto ">
                    <span className="text-white">
                      خصم بنسبة {product.minDiscount}%{" "}
                    </span>
                  </div>
                )}

                <div className="border border-bottom imgDiv border-top-0">
                  <Card.Img
                    variant="top"
                    src={product.image.secure_url}
                    className=" h-100 img-fluid"
                  />
                </div>
                <Card.Body className="d-flex flex-column justify-content-between">
                  <div>
                    <Card.Title className="text-gray">
                      {product.name}
                    </Card.Title>
                  </div>
                  <div>
                    <Card.Text>
                      {product.minDiscount > 0 ? (
                        <div className="text-center">
                          <span className="fs-4 text-danger mx-1 ">
                            ₪
                            {product?.minPrice -
                              (product?.minPrice * product?.minDiscount) / 100}
                          </span>
                          <span className="fs-6 text-secondary text-decoration-line-through">
                            {product?.minPrice}
                          </span>
                        </div>
                      ) : (
                        <span className="fs-4">{product.minPrice} ₪</span>
                      )}
                    </Card.Text>
                  </div>
                  <div className="btnsFav mt-2">
                    <Button
                      className="d-block bg-main-light m-auto border mt-1"
                      onClick={() =>
                        handleProductClick(product, product.subcategoryId)
                      }
                    >
                      <span className="favText">الذهاب إلى المنتج</span>
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </section>
      {/* {console.log(productsDiscount)} */}

      <section className="container offerProducts pt-5 mt-5">
        <h2 className="text-center mb-4 border-bottom pb-2"> عروضنا الخاصة</h2>
        <Row xs={2} sm={2} md={3} lg={6}>
          {productsDiscount?.products.map(
            (product) =>
              product.minDiscount > 0 && (
                <Col key={product._id} className="mb-4 productCol">
                  <Card className="text-center ">
                    <div className="bg-danger w-100  m-auto ">
                      <span className="text-white">
                        خصم بنسبة {product.minDiscount}%{" "}
                      </span>
                    </div>

                    <div className="border border-bottom imgDiv border-top-0">
                      <Card.Img
                        variant="top"
                        src={product.image.secure_url}
                        className=" h-100 img-fluid"
                      />
                    </div>
                    <Card.Body className="d-flex flex-column justify-content-between">
                      <div>
                        <Card.Title className="text-gray">
                          {product.name}
                        </Card.Title>
                      </div>
                      <div>
                        <Card.Text>
                          <div className="text-center">
                            <span className="fs-4 text-danger mx-1 ">
                              ₪
                              {product?.minPrice -
                                (product?.minPrice * product?.minDiscount) /
                                  100}
                            </span>
                            <span className="fs-6 text-secondary text-decoration-line-through">
                              {product?.minPrice}
                            </span>
                          </div>
                        </Card.Text>
                      </div>
                      <div className="btnsFav mt-2">
                        <Button
                          className="d-block bg-main-light m-auto border mt-1"
                          onClick={() =>
                            handleProductClick(product, product.subcategoryId)
                          }
                        >
                          <span className="favText">الذهاب إلى المنتج</span>
                        </Button>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              ),
          )}
        </Row>
      </section>

      <article className="container aboutUs pt-5 mt-5">
        <h2 className="text-center mb-4 border-bottom pb-2">من نحن ؟</h2>
        <div className="aboutUsImg"></div>
        <div className="aboutUsText  py-3 fs-5 ">
          <p className="w-75 m-auto border-bottom">
            <span className="text-main-dark fw-bold">TopTools</span> هو وجهتك
            الرئيسية للعثور على أدوات الحرفية عالية الجودة والمعدات البنائية
            المتخصصة في مكان واحد. نفتخر بتقديم مجموعة واسعة من المنتجات التي
            تلبي احتياجات الحرفيين والمقاولين على حد سواء.
          </p>
          <div className="row py-5">
            <div className="col-lg-6 col-12 d-flex align-items-center">
              <div className="">
                <h4 className="text-main-dark text-center">نحن</h4>
                <p className=" d-flex align-items-center">
                  نسعى جاهدين لتوفير أفضل المنتجات والخدمات لعملائنا، مع التركيز
                  على الجودة والاستدامة في كل خطوة نقوم بها. نحن نؤمن بأن
                  الأدوات الجيدة هي المفتاح لبناء عمل ناجح، ونسعى لتزويدك بكل ما
                  تحتاجه لتحقيق أهدافك بنجاح.
                </p>
              </div>
            </div>

            <div className="col-lg-6 col-12">
              <img
                src="/images/vector-art-6.png"
                alt="..."
                className="rounded imgsAboutUS w-100"
              />
            </div>
          </div>

          <div className="row  py-5">
            <div className="col-lg-6 col-12">
              <img
                src="/images/vector-art-10.png"
                alt="..."
                className="rounded imgsAboutUS w-100"
              />
            </div>
            <div className="col-lg-6 col-12 d-flex align-items-center">
              <div className="ourServices">
                <h4 className="text-main-dark text-center">خدماتنا</h4>
                <ul>
                  <li>
                    <span>
                      مجموعة واسعة من المعدات والأدوات الحرفية عالية الجودة.
                    </span>
                  </li>
                  <li>
                    <span>عروض خاصة وتخفيضات منتظمة على منتجات مختارة.</span>
                  </li>
                  <li>
                    <span>
                      فريق متخصص يقدم الدعم والمشورة للمساعدة في اختيار المنتجات
                      المناسبة لمشاريعك.
                    </span>
                  </li>
                  <li>
                    <span>ضمان جودة على جميع المنتجات لضمان رضا العملاء.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </article>
    </>
  );
}

export default Home;
