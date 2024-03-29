import React from "react";
import { Navigate } from "react-router-dom";
// import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import { ProtectedRouteProps } from "../interface/ProtectedRouteProps";

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  // const auth = getAuth();
  // const navigate = useNavigate();

  // useEffect(() => {
  //   const unsubscribe = onAuthStateChanged(auth, (user: User | null) => {
  //     if (!user) {
  //       navigate("/login");
  //     }
  //   });
  //   return () => unsubscribe();
  // }, [auth, navigate]);

  const user = JSON.parse(localStorage.getItem("user") || "null");
  // useEffect(() => {
  //   localStorage.setItem("user", JSON.stringify(user));
  // }, [user]);

  if (!user) {
    return <Navigate to="/login" />;
  }
  return <React.Fragment>{children}</React.Fragment>;
};

export default ProtectedRoute;
