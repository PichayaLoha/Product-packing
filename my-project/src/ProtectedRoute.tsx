import { useContext } from "react";
import { AuthContext } from "./components/auth/AuthContext";
import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  children: JSX.Element;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const authContext = useContext(AuthContext);

  if (!authContext || !authContext.token) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default ProtectedRoute;
