import React from "react";
import { useLocation } from "react-router-dom";
const RenderTitle = () => {
  const location = useLocation();
  switch (location.pathname) {
    case "/erp-system/employees":
      return <span className="ms-3">Employee Management</span>;
    case "/erp-system/departments":
      return <span className="ms-3">Department Management</span>;
    case "/erp-system/menus":
      return <span className="ms-3">Menu Management</span>;
    case "/erp-system/customers":
      return <span className="ms-3">Customer Management</span>;
    case "/erp-system/lines":
      return <span className="ms-3">Line Management</span>;
    case "/erp-system/factories":
      return <span className="ms-3">Factory Management</span>;
    default:
      return <>Dashboard</>;
  }
};

export default RenderTitle;
