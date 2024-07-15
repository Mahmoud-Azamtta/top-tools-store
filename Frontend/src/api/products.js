import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL;
const BEARER_KEY = import.meta.env.VITE_BEARER_KEY;

export const getAllProducts = async (userToken, limit, page, sort, search) => {
  const params = { limit, page };
  if (sort) params.sort = sort;
  if (search) params.search = search;
  try {
    const response = await axios.get(`${baseURL}/product/getAllProducts`, {
      params,
      headers: { Authorization: `${BEARER_KEY}${userToken}` },
    });
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export const getAllProductsActive = async (limit = 500, search = "") => {
  try {
    const response = await axios.get(`${baseURL}/product/getActive`, {
      params: {
        limit,
        search,
      },
    });
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export const getActiveProducts = async (
  subcategoryId,
  page,
  limit = 8,
  sort = "",
  search = "",
  minPrice = 0,
  maxPrice = 1000,
) => {
  try {
    const response = await axios.get(
      `${baseURL}/subcategory/${subcategoryId}/product/getActiveSub`,
      {
        params: {
          page,
          limit,
          sort,
          search,
          "minPrice[gte]": minPrice,
          "minPrice[lte]": maxPrice,
        },
      },
    );
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export const getProductDetails = async (productId) => {
  console.log("reached");
  try {
    const response = await axios.get(
      `${baseURL}/product/getSpecific/${productId}`,
    );
    return response.data.product;
  } catch (error) {
    console.log(error);
  }
};

export const createProduct = async (productData, userToken) => {
  try {
    const response = await axios.post(`${baseURL}/product`, productData, {
      headers: { Authorization: `${BEARER_KEY}${userToken}` },
    });
    return response.data;
  } catch (error) {
    if (error.response) {
      if (error.response.status === 409) {
        return { error: "المنتج او احد اصنافه موجود في قائمة المنتجات" };
      }
      if (error.response.data.message === "validation error") {
        return { error: "خطأ في البيانات المدخلة" };
      }
    }
    return { error: "خطأ غير معروف اعد المحاولة لاحقا" };
  }
};

export const updateProduct = async (productData, userToken, id) => {
  try {
    const response = await axios.patch(
      `${baseURL}/product/${id}`,
      productData,
      {
        headers: { Authorization: `${BEARER_KEY}${userToken}` },
      },
    );
    return response.data;
  } catch (error) {
    console.log(error);
    if (error.response) {
      if (error.response.status === 409) {
        return { error: "احد اصناف المنتج موجود مسبقا" };
      }
      if (error.response.data.message === "validation error") {
        return { error: "خطأ في البيانات المدخلة" };
      }
    }
    return { error: "خطأ غير معروف اعد المحاولة لاحقا" };
  }
};

export const getProductsDiscount = async () => {
  try {
    const response = await axios.get(`${baseURL}/product/getDiscount`);
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export const getProductsSpecial = async () => {
  try {
    const response = await axios.get(`${baseURL}/product/getSpecial`);
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export const getProductsLastest = async () => {
  try {
    const response = await axios.get(`${baseURL}/product/getLastest `);
    return response.data;
  } catch (error) {
    console.log(error);
  }
};
export const getProductsPopular = async () => {
  try {
    const response = await axios.get(`${baseURL}/product/getPopular `);
    //console.log(response.data)
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export const hideProduct = async (userToken, id, status) => {
  try {
    const response = await axios.patch(
      `${baseURL}/product/changeStatus/${id}`,
      status,
      {
        headers: { Authorization: `${BEARER_KEY}${userToken}` },
      },
    );
    return response.data;
  } catch (error) {
    return { error: "خطأ غير متوقع" };
  }
};

export const getLowInStoke = async (userToken) => {
  try {
    const response = await axios.get(`${baseURL}/product/lessStock`, {
      headers: { Authorization: `${BEARER_KEY}${userToken}` },
    });
    return response.data;
  } catch (error) {
    return { error: "خطأ اثناء استرجاع البيانات" };
  }
};

export const getUnpopular = async (userToken) => {
  try {
    const response = await axios.get(`${baseURL}/product/unpopularProducts`, {
      headers: { Authorization: `${BEARER_KEY}${userToken}` },
    });
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.log(error);
    return { error: "خطأ اثناء استرجاع البيانات" };
  }
};

export const getRecommended = async (userToken) => {
  try {
    const response = await axios.get(`${baseURL}/product/get-recommended`, {
      headers: { Authorization: `${BEARER_KEY}${userToken}` },
    });
    return response.data;
  } catch (error) {
    return { error: "خطأ في استرجاع المقترحات" };
  }
};
