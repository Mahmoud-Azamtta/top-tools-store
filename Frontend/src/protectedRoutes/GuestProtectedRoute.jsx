import { useContext, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { LoginContext } from "../contexts/LoginContext.jsx";

function GuestProtectedRoute({ children }) {
  const { userToken } = useContext(LoginContext);
  const [isLoggedin, setIsLoggedin] = useState(false);
  useEffect(() => {
    if (userToken) setIsLoggedin(true);
    else setIsLoggedin(false);
  }, [userToken]);
  console.log(children)

  return isLoggedin ? children : <Navigate to="/auth/login" />;
}

export default GuestProtectedRoute;
