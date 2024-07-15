import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL;
const BEARER_KEY = import.meta.env.VITE_BEARER_KEY;

export const createOrder = async (userToken, data) => {
  try {
    const response = await axios.post(`${baseURL}/order`, data, {
      headers: { Authorization: `${BEARER_KEY}${userToken}` },
    });
    return response.data;
  } catch (error) {
    return { error: "خطأ اثناء رفع الطلب" };
  }
};

export const createOrderVisa = async (userToken, data) => {
  try {
    const response = await axios.post(`${baseURL}/order/orderVisa`, data, {
      headers: { Authorization: `${BEARER_KEY}${userToken}` },
    });
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.log(error);
    return { error: "خطأ اثناء رفع الطلب" };
  }
};

export const getAllOrders = async (userToken, status) => {
  try {
    const response = await axios.get(`${baseURL}/order/${status}`, {
      headers: { Authorization: `${BEARER_KEY}${userToken}` },
    });
    return response.data;
  } catch (error) {
    return { error: "حدث خطأ اثناء استرجاع البيانات " };
  }
};

export const updateStatus = async (userToken, orderId, status) => {
  try {
    const response = await axios.patch(
      `${baseURL}/order/changeStatus/${orderId}`,
      { status },
      {
        headers: { Authorization: `${BEARER_KEY}${userToken}` },
      },
    );
    return response.data;
  } catch (error) {
    return { error: "خطأ اثناء تعديل حالة الطلب" };
  }
};

export const canclOrder = async (userToken, orderId) => {
  try {
    const response = await axios.delete(`${baseURL}/order/${orderId}`, {
      headers: { authorization: `${BEARER_KEY}${userToken}` },
    });
    return response.data;
  } catch (error) {
    return { error: "خطأ اثناء الغاء الطلب" };
  }
};

export const confirmOrder = async (userToken, id) => {
  console.log(userToken);
  console.log(id);

  try {
    const response = await axios.post(`${baseURL}/order/confirmOrder/${id}`, {
      headers: { Authorization: `${BEARER_KEY}${userToken}` },
    });
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.log(error);
    return { error: "خطأ اثناء تأكيد الطلب" };
  }
};

export const getLatestOrders = async (userToken) => {
  try {
    const response = await axios.get(`${baseURL}/order/LatestPendingOrders`, {
      headers: { Authorization: `${BEARER_KEY}${userToken}` },
    });
    console.log(response.data);
    return response.data;
  } catch (error) {
    return { error: "خطأ أثناء استرجاع البيانات" };
  }
};

export const cancleOrderUser = async (userToken, orderId) => {
  try {
    const response = await axios.delete(`${baseURL}/order/${orderId}`, {
      headers: { authorization: `${BEARER_KEY}${userToken}` },
    });
    return response.data;
  } catch (error) {
    return { error: "خطأ اثناء الغاء الطلب" };
  }
};
