import React from "react";
import { useCookies } from "react-cookie";
import { Navigate } from "react-router-dom";

const AuthRoute = ({ children, allowedRoles }) => {
  const [cookies, setCookies] = useCookies(["access_token"]);
  const role = window.localStorage.getItem("role");

  if(!cookies.access_token){
    // If no access_token is found, navigate to the login page
    return <Navigate to="/auth" />;
  }
  if (!role) {
    // If no role is found, navigate to the login page
    return <Navigate to="/auth" />;
  }

  if (!allowedRoles.includes(role)) {
    // If role is not authorized, navigate to an unauthorized page
    return <Navigate to="/unauthorized" />;
  }

  // If role is authorized, render the children components
  return children;
};

export default AuthRoute;
