import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL;

export const getCustomer = async (token) => {
  try {
    const response = await axios.get(`${baseURL}/customer/`, {
      headers: {
        Authorization: `${BEARER_KEY}${token}`,
        "Content-Type": "application/json",
      },
    });
    console.log(response.data);

    return response.data;
  } catch (error) {
    console.error("Error gitting customers:", error);
  }
};

export const getOrdersCustomer = async (token, customerId) => {
  try {
    const response = await axios.get(`${baseURL}/customer/${customerId}`, {
      headers: {
        Authorization: `${BEARER_KEY}${token}`,
        "Content-Type": "application/json",
      },
    });
    console.log(response.data);

    return response.data;
  } catch (error) {
    console.error("Error gitting  orders customer:", error);
  }
};

export const deleteCustomer = async (token, customerId) => {
  try {
    const response = await axios.delete(`${baseURL}/customer/${customerId}`, {
      headers: {
        Authorization: `${BEARER_KEY}${token}`,
        "Content-Type": "application/json",
      },
    });
    console.log(response.data);

    return response.data;
  } catch (error) {
    console.error("Error gitting  orders customer:", error);
  }
};

export const updateCustomer = async (
  token,
  customerId,
  userName,
  email,
  city,
  street,
  description,
) => {
  try {
    const response = await axios.patch(
      `${baseURL}/customer/${customerId}`,
      {
        userName,
        email,
        Address: {
          city,
          street,
          description,
        },
      },
      {
        headers: {
          Authorization: `${BEARER_KEY}${token}`,
          "Content-Type": "application/json",
        },
      },
    );
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("Error update customer:", error);
  }
};

export const searchCustomer = async (token, query) => {
  try {
    const response = await axios.get(`${baseURL}/customer/search`, {
      params: { q: query },
      headers: {
        Authorization: `${BEARER_KEY}${token}`,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error searching customer:", error);
  }
};
