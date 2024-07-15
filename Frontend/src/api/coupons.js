import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL;

export const getCoupons = async () => {
  try {
    const response = await axios.get(`${baseURL}/coupon`);
    return response.data;
  } catch (error) {
    return new Error("Error while fetching data");
  }
};

export const updateCoupon = async (id, userToken, updated) => {
  try {
    const response = await axios.patch(`${baseURL}/coupon/${id}`, updated, {
      headers: { Authorization: `${BEARER_KEY}${userToken}` },
    });
    return response.data;
  } catch (error) {
    return { error: "خطأ اثناء التعديل على الكوبون" };
  }
};

export const createCoupon = async (userToken, coupon) => {
  try {
    const response = await axios.post(`${baseURL}/coupon`, coupon, {
      headers: { Authorization: `${BEARER_KEY}${userToken}` },
    });
    return response.data;
  } catch (error) {
    return { error: "خطأ اثناء انشاء الكوبون" };
  }
};

export const deleteCoupon = async (userToken, id) => {
  try {
    const response = await axios.delete(`${baseURL}/coupon/${id}`, {
      headers: { Authorization: `${BEARER_KEY}${userToken}` },
    });
    return response.data;
  } catch (error) {
    console.log(error.response.data.message);
    return { error: "خطأ اثناء انشاء الكوبون" };
  }
};
