import { createContext, useContext, useEffect, useState } from "react";
import { useQuery } from "react-query";
import { getCart } from "../api/cart.js";
import { LoginContext } from "./LoginContext.jsx";
import Loading from "../components/loading/Loading.jsx";

export const CartContext = createContext(null);

export function CartContextProvider({ children }) {
  const [countCart, setCountCart] = useState(0);
  const { userToken } = useContext(LoginContext);

  const {
    data: cartData,
    isLoading: cartLoading,
    error: cartError,
  } = useQuery(["cart", userToken], () => getCart(userToken), {
    enabled: !!userToken,
  });

  useEffect(() => {
    if (cartData &&  !cartLoading && !cartError) {
      setCountCart(cartData.cart?.products?.length || 0);
    }
  }, [cartData, cartLoading, cartError]);


  return (
    <CartContext.Provider
      value={{
        countCart
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
