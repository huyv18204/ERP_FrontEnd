import React from "react";
import { useLocation } from "react-router-dom";
const RenderTitle = () => {
  const location = useLocation();
  switch (location.pathname) {
    case "/erp-system/employees":
      return <span className="ms-3">Employees Management</span>;
    default:
      return <>Dashboard</>;
  }
};

export default RenderTitle;
