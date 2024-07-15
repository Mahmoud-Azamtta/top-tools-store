import React, { useContext } from "react";
import { Table } from "react-bootstrap";
import ProductRow from "./ProductRow";
import { LoginContext } from "../../../contexts/LoginContext";
import { useQuery } from "react-query";
import { getUnpopular } from "../../../api/products";
import NoWrapperLoading from "../../loading/NoWrapperLoading";

function IrrelevantProducts() {
  const { userToken } = useContext(LoginContext);

  const { data, isLoading } = useQuery(
    ["irrelevant-products"],
    () => getUnpopular(userToken),
    { enabled: !!userToken },
  );

  if (isLoading || !userToken) {
    return (
      <div className="position-relative py-5 my-5 d-flex justify-content-center">
        <NoWrapperLoading />
      </div>
    );
  }

  if (data.error) {
    return (
      <div>
        <h2 className="m-0 text-danger my-4 fs-5 text-center">{data.error}</h2>
      </div>
    );
  }

  console.log(data.products);

  return (
    <>
      <h2 className="fs-4 border-bottom pb-2 my-2 fw-bold">منتجات غير رائجة</h2>
      <Table striped>
        <thead>
          <tr>
            <th className="text-center">إسم المنتج</th>
            <th className="text-center">السعر</th>
            <th className="text-center">إخفاء من المتجر</th>
          </tr>
        </thead>
        <tbody>
          {data.products.map((product) => (
            <ProductRow
              key={product.itemNo}
              product={product}
              queryKey="irrelevant-products"
            />
          ))}
        </tbody>
      </Table>
    </>
  );
}

export default IrrelevantProducts;
