// WebLayout.js

import React, { useContext, useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import CustomNavbar from "../components/web/navbar/Navbar";
import Footer from "../components/web/footer/Footer";
import useScript from "../utils/useScript";
import { CartContextProvider } from "../contexts/CartContext.jsx";
import { LoginContext } from "../contexts/LoginContext.jsx";

function WebLayout() {
  const [isLoggedin, setIsLoggedin] = useState(false);
  const { userToken } = useContext(LoginContext);
  
  useScript("https://call.chatra.io/chatra.js", "chatraScript");

  React.useEffect(() => {
    window.ChatraID = "LE4PZm7bpA7cEqSKX";
    window.Chatra =
      window.Chatra ||
      function () {
        (window.Chatra.q = window.Chatra.q || []).push(arguments);
      };
  }, []);
  useEffect(() => {
    if (userToken) setIsLoggedin(true);
    else setIsLoggedin(false);
  }, [userToken]);

  return (
    <>
    <CartContextProvider>
      <CustomNavbar />
      <main className="bg-light-gray">
        <Outlet />
      </main>
      <Footer />
    </CartContextProvider>
  </>
 
  );
}

export default WebLayout;
