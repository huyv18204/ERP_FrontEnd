import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children, isAuthenticated }) => {
  const [check, setCheck] = useState(isAuthenticated);

  useEffect(() => {
    setCheck(isAuthenticated);
  }, [isAuthenticated]);

  return check ? children : <Navigate to="/not-found" />;
};

export default PrivateRoute;
