import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL;
const BEARER_KEY = import.meta.env.VITE_BEARER_KEY;

export const addFavorite = async (productId, token) => {
  try {
    const response = await axios.post(
      `${baseURL}/favorite/`,
      { productId },
      {
        headers: {
          Authorization: `${BEARER_KEY}${token}`,
          "Content-Type": "application/json",
        },
      },
    );

    return response.data;
  } catch (error) {
    console.error("Error adding favorite:", error);
  }
};

export const getFavorite = async (token) => {
  try {
    const response = await axios.get(`${baseURL}/favorite/`, {
      headers: {
        Authorization: `${BEARER_KEY}${token}`,
        "Content-Type": "application/json",
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error get favorite:", error);
  }
};

export const removeFavorite = async (productId, token) => {
  try {
    const response = await axios.patch(
      `${baseURL}/favorite/${productId}`,
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
    console.error("Error removing favorite:", error);
  }
};

export const clearFavorite = async (token) => {
  try {
    const response = await axios.put(
      `${baseURL}/favorite/clearFavList`,
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
    console.error("Error removing favorite:", error);
  }
};
