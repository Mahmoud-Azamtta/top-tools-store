import React from "react";
import { Col, Container, Row } from "react-bootstrap";
import LowInStockProducts from "./LowInStockProducts";
import LatestOrders from "./LatestOrders";
import IrrelevantProducts from "./IrrelevantProducts";

function Home() {
  return (
    <Container fluid as="section">
      <Row>
        <Col sm={12} md={5} as="aside" className="">
          <article className="border rounded-3 mx-2 my-3 p-2 shadow-sm">
            <LowInStockProducts />
          </article>
          <article className="border rounded-3 mx-2 my-3 p-2 shadow-sm">
            <IrrelevantProducts />
          </article>
        </Col>
        <Col sm={12} md={7} as="aside" className="">
          <article className="border rounded-3 mx-2 my-3 p-2 shadow-sm">
            <LatestOrders />
          </article>
        </Col>
      </Row>
    </Container>
  );
}

export default Home;
