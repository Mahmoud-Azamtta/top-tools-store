import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL;

export const getAllCategories = async (userToken) => {
  try {
    const response = await axios.get(`${baseURL}/categories`, {
      headers: { Authorization: `${BEARER_KEY}${userToken}` },
    });
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export const getActiveCategories = async () => {
  try {
    const response = await axios.get(`${baseURL}/categories/ActiveCategory`);
    //console.log(response.category)
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export const createCategory = async (userToken, data) => {
  try {
    const response = await axios.post(`${baseURL}/categories`, data, {
      headers: { Authorization: `${BEARER_KEY}${userToken}` },
    });
    return response.data;
  } catch (error) {
    if (error.response) {
      if (error.response.status === 409) {
        return { error: "هذا الصنف موجود مسبقا" };
      }
    }
    return { error: "خطأ غير معروف حاول مرة اخرى" };
  }
};

export const deleteCategory = async (userToken, id) => {
  try {
    const response = await axios.delete(`${baseURL}/categories/${id}`, {
      headers: { Authorization: `${BEARER_KEY}${userToken}` },
    });
    return response.data;
  } catch (error) {
    return { error: "خطأ غير معروف حاول مرة اخرى" };
  }
};

export const updateCategory = async (userToken, id, data) => {
  try {
    const response = await axios.patch(`${baseURL}/categories/${id}`, data, {
      headers: { Authorization: `${BEARER_KEY}${userToken}` },
    });
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.log(error);
    return { error: "خطأ اثناء التعديل على الصنف" };
  }
};
