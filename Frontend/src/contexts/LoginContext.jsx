import { createContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";

export const LoginContext = createContext(null);

export function LoginContextProvider({ children }) {
  const [userToken, setUserToken] = useState(null);
  const [role, setRole] = useState(null);
  const [userId, setUserId] = useState(null);

  const saveUser = (token, loginStatus) => {
    setUserToken(token);
    if (loginStatus == "cookies") Cookies.set("userToken", token);
    else localStorage.setItem("userToken", token);

    const decoded = jwtDecode(token);
    console.log(decoded);
    setRole(decoded.role);
  };

  const handleLogout = () => {
    if (Cookies.get("userToken")) Cookies.remove("userToken", { path: "/" });
    if (localStorage.getItem("userToken")) localStorage.removeItem("userToken");
    setUserToken(null);
    setRole(null);
  };

  const checkLoginStatus = () => {
    if (localStorage.getItem("userToken")) {
      setUserToken(localStorage.getItem("userToken"));
    }

    if (Cookies.get("userToken")) {
      setUserToken(Cookies.get("userToken"));
    }
  };

  const isAdmin = () => role === "Admin";

  const getUserId = () => userId;

  useEffect(() => {
    if (userToken) {
      let tokenLocation = "loc-strg";
      if (Cookies.get("userToken")) tokenLocation = "cookies";

      saveUser(userToken, tokenLocation);
    }
  }, [userToken]);

  return (
    <LoginContext.Provider
      value={{
        userToken,
        setUserToken,
        saveUser,
        isAdmin,
        getUserId,
        handleLogout,
        checkLoginStatus,
      }}
    >
      {children}
    </LoginContext.Provider>
  );
}
