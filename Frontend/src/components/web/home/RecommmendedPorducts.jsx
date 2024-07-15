import React from "react";
import { Card, Row, Col, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

function RecommmendedPorducts({ recommmended, navigateFunction }) {
  return (
    <section className="container lastestProducts pt-5 mt-5">
      <h2 className="text-center mb-4 border-bottom pb-2">
        منتجات قد تنال على اعجابك
      </h2>

      <Row xs={2} sm={2} md={3} lg={4}>
        {recommmended?.map((product) => (
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
                      navigateFunction(product, product.subcategoryId)
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
  );
}

export default RecommmendedPorducts;
