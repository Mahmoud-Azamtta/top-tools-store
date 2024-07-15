import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { redirect } from "react-router-dom";

export const checkToken = () => {
  let token = null;

  if (Cookies.get("userToken")) token = Cookies.get("userToken");
  else if (localStorage.getItem("userToken"))
    token = localStorage.getItem("userToken");

  if (token === null) return null;

  const role = jwtDecode(token).role;
  if (role == "Admin") return redirect("/dashboard");
  else return redirect("/");
};

export const checkLoginStatus = () => {
  let token = null;

  if (Cookies.get("userToken")) token = Cookies.get("userToken");
  else if (localStorage.getItem("userToken"))
    token = localStorage.getItem("userToken");

  if (token === null) return redirect("/");
  else return null;
};
