import { Outlet } from "react-router-dom";
import { Toaster } from "react-hot-toast";

function Layout() {
  return (
    <>
      <Toaster reverseOrder={false} position="top-left" />
      <Outlet />
    </>
  );
}

export default Layout;
