import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL;
const BEARER_KEY = import.meta.env.VITE_BEARER_KEY;

export const getCart = async (token) => {
  try {
    const response = await axios.get(`${baseURL}/cart/`, {
      headers: {
        Authorization: `${BEARER_KEY}${token}`,
        "Content-Type": "application/json",
      },
    });
    console.log(response.data);

    return response.data;
  } catch (error) {
    console.error("Error gitting cart:", error);
  }
};

export const addCart = async (productId, itemNo, token) => {
  try {
    const response = await axios.post(
      `${baseURL}/cart/`,
      { productId, itemNo },
      {
        headers: {
          Authorization: `${BEARER_KEY}${token}`,
          "Content-Type": "application/json",
        },
      },
    );

    return response.data;
  } catch (error) {
    console.error("Error adding to cart:", error);
  }
};

export const removeFromCart = async (productId, itemNo, token) => {
  try {
    const response = await axios.patch(
      `${baseURL}/cart/${productId}`,
      { itemNo },
      {
        headers: {
          Authorization: `${BEARER_KEY}${token}`,
          "Content-Type": "application/json",
        },
      },
    );

    return response.data;
  } catch (error) {
    console.error("Error removing from cart:", error);
  }
};

export const updateQuantCart = async (
  productId,
  itemNo,
  quantity,
  operator = "",
  token,
) => {
  try {
    const response = await axios.patch(
      `${baseURL}/cart/updateQuantity/${productId}`,
      { itemNo, quantity, operator },
      {
        headers: {
          Authorization: `${BEARER_KEY}${token}`,
          "Content-Type": "application/json",
        },
      },
    );

    return response.data;
  } catch (error) {
    console.error("Error Update Quantity for Product in cart:", error);
  }
};

export const clearCart = async (token) => {
  //console.log(token)
  try {
    const response = await axios.put(
      `${baseURL}/cart/clearCart`,
      {},
      {
        headers: {
          Authorization: `${BEARER_KEY}${token}`,
          "Content-Type": "application/json",
        },
      },
    );

    return response.data;
  } catch (error) {
    console.error("Error clear cart:", error);
  }
};
