import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL;
const BEARER_KEY = import.meta.env.VITE_BEARER_KEY;

export const getAllSubcategories = async () => {
  try {
    const response = await axios.get(`${baseURL}/subcategories`);
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export const getSubcategories = async (userToken) => {
  try {
    const response = await axios.get(
      `${baseURL}/subcategory/getsubWithOutCateg`,
      {
        headers: { Authorization: `${BEARER_KEY}${userToken}` },
      },
    );
    return response.data;
  } catch (error) {
    console.log(error);
    return new Error("Error while retrieving subcategory names");
  }
};

export const getSubByCategory = async (userToken, categoryId) => {
  try {
    const response = await axios.get(
      `${baseURL}/categories/${categoryId}/subcategory`,
      {
        headers: { Authorization: `${BEARER_KEY}${userToken}` },
      },
    );
    return response.data;
  } catch (error) {
    console.log(error);
    return new Error("Error while retrieving subcategories");
  }
};

export const getActiveSubcategories = async (categoryId) => {
  try {
    const response = await axios.get(
      `${baseURL}/categories/${categoryId}/subcategory/Active`,
    );
    // console.log(response.data);
    return response.data.subcategory;
  } catch (error) {
    console.log(error);
  }
};

export const getSubcategoryDetalis = async (subcategoryId) => {
  try {
    const response = await axios.get(
      `${baseURL}/subcategory/${subcategoryId}/product/getActive`,
    );
    // console.log(response.data);
    return response.data.products;
  } catch (error) {
    console.log(error);
  }
};

export const createSubcategory = async (data, userToken) => {
  try {
    const response = await axios.post(`${baseURL}/subcategory`, data, {
      headers: { Authorization: `${BEARER_KEY}${userToken}` },
    });
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 409) {
      return { error: "الصنف الفرعي موجود مسبقا" };
    }
    return { error: "خطأ اثناء انشاء الصنف الفرعي" };
  }
};

export const deleteSubcategory = async (userToken, id) => {
  try {
    const response = await axios.delete(`${baseURL}/subcategory/${id}`, {
      headers: { Authorization: `${BEARER_KEY}${userToken}` },
    });
    return response.data;
  } catch (error) {
    console.log(error);
    return { error: "خطأ اثناء الحذف" };
  }
};

export const updateSubcategory = async (userToken, id, data) => {
  try {
    const response = await axios.patch(`${baseURL}/subcategory/${id}`, data, {
      headers: { Authorization: `${BEARER_KEY}${userToken}` },
    });
    return response.data;
  } catch (error) {
    return { error: "خطأ اثناء تعديل الصنف" };
  }
};
