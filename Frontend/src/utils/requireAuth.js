import { redirect } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";

export const authenticate = () => {
  let token = null;
  if (Cookies.get("userToken")) token = Cookies.get("userToken");
  else if (localStorage.getItem("userToken"))
    token = localStorage.getItem("userToken");

  if (!token) {
    return redirect("/");
  }

  const role = extractRole(token);
  if (role !== "Admin") return redirect("/");

  return null;
};

const extractRole = (token) => {
  return jwtDecode(token).role;
};
