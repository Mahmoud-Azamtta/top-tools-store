import { useContext } from "react";
import { UserContext } from "../contexts/UserContext";
import { Navigate } from "react-router-dom";

function RoleProtectedRoute({ children }) {
  const { role } = useContext(UserContext);

  if (role === "Admin") {
    return children;
  } else {
    return <Navigate to="/not-found" />;
  }
}

export default RoleProtectedRoute;
