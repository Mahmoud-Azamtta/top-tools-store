import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL;
const BEARER_KEY = import.meta.env.VITE_BEARER_KEY;

export const getUserData = async (token) => {
  try {
    const response = await axios.get(`${baseURL}/profile/`, {
      headers: {
        Authorization: `${BEARER_KEY}${token}`,
        "Content-Type": "application/json",
      },
    });
    console.log(response.data);

    return response.data;
  } catch (error) {
    console.error("Error get userData:", error);
    return { error: "خطأ اثناء استرجاع البيانات" };
  }
};

export const editUserData = async (
  token,
  userName,
  email,
  city,
  street,
  description,
) => {
  try {
    const response = await axios.patch(
      `${baseURL}/profile/`,
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
    return response.data;
  } catch (error) {
    console.error("Error updating user data:", error);
  }
};

export const updatePassword = async (token, formData) => {
  try {
    const { currentPassword, newPassword, checkPassword } = formData;
    const response = await axios.patch(
      `${baseURL}/profile/updatePassword`,
      {
        currentPassword,
        newPassword,
        checkPassword,
      },
      {
        headers: {
          Authorization: `${BEARER_KEY}${token}`,
          "Content-Type": "application/json",
        },
      },
    );
    return response.data;
  } catch (error) {
    console.error("Error updating password:", error);
    throw error;
  }
};
