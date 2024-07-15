import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL;
const BEARER_KEY = import.meta.env.VITE_BEARER_KEY;

export const getProductReview = async (productId) => {
  try {
    const response = await axios.get(`${baseURL}/review/${productId}`);
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export const addReview = async (
  productId,
  token,
  comment,
  rating,
  image = null,
) => {
  const formData = new FormData();
  formData.append("comment", comment);
  formData.append("rating", rating);
  if (image) {
    formData.append("image", image);
  }
  try {
    const response = await axios.post(
      `${baseURL}/product/${productId}/review`,
      formData,
      {
        headers: {
          authorization: `${BEARER_KEY}${token}`,
        },
      },
    );
    console.log(response);

    return response.data;
  } catch (error) {
    console.log(error);
  }
};
