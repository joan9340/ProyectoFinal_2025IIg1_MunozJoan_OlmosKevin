import { useAuth } from "../../Context/AuthContext";
import { Navigate } from "react-router-dom";

export default function RoleRoute({ rolesAllowed, children }) {
  const { user, userData } = useAuth();
  if (!user || !rolesAllowed.includes(userData?.role)) return <Navigate to="/dashboard" />;
  return children;
}

