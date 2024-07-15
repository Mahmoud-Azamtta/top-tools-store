import React, { useContext } from "react";
import { Button } from "react-bootstrap";
import { LoginContext } from "../../../contexts/LoginContext";
import { useMutation, useQueryClient } from "react-query";
import { hideProduct } from "../../../api/products";
import { toast } from "react-hot-toast";

function ProductRow({ product, queryKey }) {
  const { userToken } = useContext(LoginContext);
  const queryClient = useQueryClient();

  const hideMutation = useMutation(
    () =>
      hideProduct(userToken, product._id, {
        status: product.status === "Active" ? "Inactive" : "Active",
      }),
    {
      onSuccess: (data) => {
        if (data.error) {
          toast.error(data.error);
        } else {
          queryClient.invalidateQueries([queryKey]);
        }
      },
    },
  );

  return (
    <tr>
      <td>
        <p className="m-0">{product.name}</p>
      </td>
      <td>
        <p className="text-center m-0">
          {product.totalInStoke >= 0
            ? product.totalInStoke
            : `يبدأ من ${product.minPrice}₪`}
        </p>
      </td>
      <td>
        <div className="table-column-wrapper d-flex justify-content-center align-items-center">
          <Button className=" py-0 px-2 bg-main-dark border-0" onClick={() => hideMutation.mutate()}>
            {product.status === "Inactive" ? (
              <svg
                width="18px"
                height="18px"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g id="SVGRepo_bgCarrier" strokeWidth={0} />
                <g
                  id="SVGRepo_tracerCarrier"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <g id="SVGRepo_iconCarrier">
                  <g id="Edit / Hide">
                    <path
                      id="Vector"
                      d="M3.99989 4L19.9999 20M16.4999 16.7559C15.1473 17.4845 13.6185 17.9999 11.9999 17.9999C8.46924 17.9999 5.36624 15.5478 3.5868 13.7788C3.1171 13.3119 2.88229 13.0784 2.7328 12.6201C2.62619 12.2933 2.62616 11.7066 2.7328 11.3797C2.88233 10.9215 3.11763 10.6875 3.58827 10.2197C4.48515 9.32821 5.71801 8.26359 7.17219 7.42676M19.4999 14.6335C19.8329 14.3405 20.138 14.0523 20.4117 13.7803L20.4146 13.7772C20.8832 13.3114 21.1182 13.0779 21.2674 12.6206C21.374 12.2938 21.3738 11.7068 21.2672 11.38C21.1178 10.9219 20.8827 10.6877 20.4133 10.2211C18.6338 8.45208 15.5305 6 11.9999 6C11.6624 6 11.3288 6.02241 10.9999 6.06448M13.3228 13.5C12.9702 13.8112 12.5071 14 11.9999 14C10.8953 14 9.99989 13.1046 9.99989 12C9.99989 11.4605 10.2135 10.9711 10.5608 10.6113"
                      stroke="#fff"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </g>
                </g>
              </svg>
            ) : (
              <svg
                width="18px"
                height="18px"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g id="SVGRepo_bgCarrier" strokeWidth={0} />
                <g
                  id="SVGRepo_tracerCarrier"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <g id="SVGRepo_iconCarrier">
                  {" "}
                  <path
                    d="M12 7C7.60743 7 4.49054 10.5081 3.41345 11.9208C3.15417 12.2609 3.17881 12.7211 3.4696 13.0347C4.66556 14.3243 8.01521 17.5 12 17.5C15.9848 17.5 19.3344 14.3243 20.5304 13.0347C20.8212 12.7211 20.8458 12.2609 20.5865 11.9208C19.5095 10.5081 16.3926 7 12 7Z"
                    stroke="#fff"
                    strokeWidth={2}
                  />{" "}
                  <path
                    d="M14 12C14 13.1046 13.1046 14 12 14C10.8954 14 10 13.1046 10 12C10 10.8954 10.8954 10 12 10C13.1046 10 14 10.8954 14 12Z"
                    fill="#fff"
                  />{" "}
                </g>
              </svg>
            )}
          </Button>
        </div>
      </td>
    </tr>
  );
}

export default ProductRow;
