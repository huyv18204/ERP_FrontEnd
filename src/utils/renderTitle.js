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
    case "/erp-system/processes":
      return <span className="ms-3">Process Management</span>;
    case "/erp-system/ngs":
      return <span className="ms-3">NG Management</span>;
    case "/erp-system/sale-orders/register":
      return <span className="ms-3">Sale Order Register</span>;
    case "/erp-system/sale-orders":
      return <span className="ms-3">Sale Order List</span>;
    case "/erp-system/suppliers":
      return <span className="ms-3">Supplier Management</span>;
    case "/erp-system/products":
      return <span className="ms-3">Product Management</span>;
    case "/erp-system/boms/register":
      return <span className="ms-3">BOM Register</span>;
    case "/erp-system/warehouse-entries/create":
      return <span className="ms-3">Create Warehouse Entry</span>;
    case "/erp-system/warehouse-entries":
      return <span className="ms-3">Warehouse Entry List</span>;
    case "/erp-system/warehouses/import":
      return <span className="ms-3">Warehouse Import</span>;
    case "/erp-system/stock-materials":
      return <span className="ms-3">Stock Material</span>;
    case "/erp-system/stock-products":
      return <span className="ms-3">Stock Product</span>;
    case "/erp-system/production-orders/register":
      return <span className="ms-3">Production Order Register</span>;
    case "/erp-system/production-orders":
      return <span className="ms-3">Production Order</span>;
    case "/erp-system/purchase-requisitions":
      return <span className="ms-3">Purchase Requisition</span>;
    case "/erp-system/purchase-requisitions/register":
      return <span className="ms-3">Purchase Requisition Register</span>;
    case "/erp-system/purchase-orders/register":
      return <span className="ms-3">Purchase Order Register</span>;
    case "/erp-system/purchase-orders":
      return <span className="ms-3">Purchase Order</span>;
    case "/erp-system/stock-outs/create":
      return <span className="ms-3">Stock Out Register</span>;
    case "/erp-system/stock-outs":
      return <span className="ms-3">Stock Out</span>;
    case "/erp-system/warehouses/export":
      return <span className="ms-3">Warehouse Export</span>;
    default:
      return <>Dashboard</>;
  }
};

export default RenderTitle;
