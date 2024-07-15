import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL;

export const register = async (userData) => {
  try {
    const response = await axios.post(`${baseURL}/auth/signup`, userData);
    return response.data;
  } catch (error) {
    if (error.response) {
      if (error.response.status === 409)
        return { error: "عنوان البريد الاكتروني مستخدم" };
      return { error: "خطأ اثناء إنشاء الحساب" };
    } else {
      return { error: "خطأ غير معروف اعد المحاولة لاحقا" };
    }
  }
};

export const login = async (userData) => {
  try {
    const response = await axios.post(`${baseURL}/auth/signin`, userData);
    return response.data;
  } catch (error) {
    if (error.response) {
      if (error.response.status === 400) {
        if (error.response.data.message === "plz confirm your email") {
          return { error: "قم بتأكيد البريد الاكترني قبل تسجيل الدخول" };
        }
        if (error.response.data.message === "email not found") {
          return { error: "عنوان البريد الاكتروني غير موجود" };
        }
        return { error: "بيانات تسجيل الدخول خاطئة" };
      }
      return { error: "خطأ اثناء عملة تسجيل الدخول" };
    }
    return { error: "خطأ غير معروف اعد المحاولة لاحقا" };
  }
};

export const sendCode = async (email) => {
  try {
    const response = await axios.patch(`${baseURL}/auth/sendcode`, email);
    return response.data;
  } catch (error) {
    return { error: "خطأ غير معروف اعد المحاولة لاحقا" };
  }
};

export const resetPassword = async (values) => {
  try {
    const response = await axios.patch(`${baseURL}/auth/forgotPass`, values);
    return response.data;
  } catch (error) {
    if (error.response) {
      if (error.response.data.message === "not register account") {
        return { error: "عنوان البريد الاكتروني غير متصل بحساب خاص بالمتجر" };
      }
      if (error.response.status === 409) {
        return { error: "لا يمكنك ادخال كلمة المرور السابقة" };
      }
      if (error.response.data.message === "invalid code") {
        return { error: "رمز تأكيد الملكية غير صحيح" };
      }
      if (error.response.data.message === "validation error") {
        console.log(error);
        return { error: "البيانات غير صالحة" };
      }
      return { error: "خطأ اثناء تغيير كلمة المرور" };
    }
    return { error: "خطأ غير معروف اعد المحاولة لاحقا" };
  }
};
