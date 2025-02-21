import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  const { authToken, pending } = useAuth();

  if (pending) return <p>Loading...</p>;
  return authToken ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
