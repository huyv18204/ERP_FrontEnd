import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LayoutMaster from "../pages/Layouts/LayoutMaster";
import Employee from "../pages/Employees/Employee";
import Department from "../pages/Departments/Department";
import Menu from "../pages/Menus/Menu";
import Customer from "../pages/Customers/Customer";
import Line from "../pages/Lines/Line";
import Factory from "../pages/Factories/Factory";
import Process from "../pages/Processes/Process";
import NG from "../pages/NGs/NG";
import SaleOrderList from "../pages/SaleOrders/SaleOrderList";
import SaleOrderRegister from "../pages/SaleOrders/SaleOrderRegister";
import ProductionOrderRegister from "../pages/ProductionOrders/ProductionOrderRegister";
import Supplier from "../pages/Suppliers/Supplier";
import Product from "../pages/Products/Product";
import StockMaterial from "../pages/Stocks/StockMaterial";
import StockProduct from "../pages/Stocks/StockProduct";
import BOMRegister from "../pages/BOMs/BOMRegister";
import WarehouseEntryRegister from "../pages/WarehouseEntries/WarehouseEntryRegister";
import WarehouseImport from "../pages/WarehouseEntries/WarehouseImport";
import WarehouseEntryList from "../pages/WarehouseEntries/WarehouseEntryList";
import ProductionOrder from "../pages/ProductionOrders/ProductionOrder";
import PurchaseRequisition from "../pages/PurchaseRequisitions/PurchaseRequisition";
import PurchaseRequisitionRegister from "../pages/PurchaseRequisitions/PurchaseRequisitionRegister";
import PurchaseOrderRegister from "../pages/PurchaseOrders/PurchaseOrderRegister";
import PurchaseOrder from "../pages/PurchaseOrders/PurchaseOrder";
import StockOutList from "../pages/StockOuts/StockOutList";
import StockOutRegister from "../pages/StockOuts/StockOutRegister";
import WarehouseExport from "../pages/StockOuts/WarehouseExport";
import Login from "../pages/Auth/Login";
import NotFound from "../utils/NotFound";
import PrivateRoute from "./PrivateRoute";
import Dashboard from "../pages/Dashboard/Dashboard";

const RouterComponent = () => {
  const isAuthenticated = !!localStorage.getItem("user");

  return (
    <Router>
      <Routes>
        <Route path="login" element={<Login />} />
        <Route path="/erp-system" element={<LayoutMaster />}>
          <Route
            path="employees"
            element={
              <PrivateRoute isAuthenticated={isAuthenticated}>
                <Employee />
              </PrivateRoute>
            }
          />
          <Route
            path="departments"
            element={
              <PrivateRoute isAuthenticated={isAuthenticated}>
                <Department />
              </PrivateRoute>
            }
          />
          <Route
            path="menus"
            element={
              <PrivateRoute isAuthenticated={isAuthenticated}>
                <Menu />
              </PrivateRoute>
            }
          />
          <Route
            path="customers"
            element={
              <PrivateRoute isAuthenticated={isAuthenticated}>
                <Customer />
              </PrivateRoute>
            }
          />
          <Route
            path="lines"
            element={
              <PrivateRoute isAuthenticated={isAuthenticated}>
                <Line />
              </PrivateRoute>
            }
          />
          <Route
            path="factories"
            element={
              <PrivateRoute isAuthenticated={isAuthenticated}>
                <Factory />
              </PrivateRoute>
            }
          />
          <Route
            path="processes"
            element={
              <PrivateRoute isAuthenticated={isAuthenticated}>
                <Process />
              </PrivateRoute>
            }
          />
          <Route
            path="ngs"
            element={
              <PrivateRoute isAuthenticated={isAuthenticated}>
                <NG />
              </PrivateRoute>
            }
          />
          <Route
            path="sale-orders/register"
            element={
              <PrivateRoute isAuthenticated={isAuthenticated}>
                <SaleOrderRegister />
              </PrivateRoute>
            }
          />
          <Route
            path="sale-orders"
            element={
              <PrivateRoute isAuthenticated={isAuthenticated}>
                <SaleOrderList />
              </PrivateRoute>
            }
          />
          <Route
            path="suppliers"
            element={
              <PrivateRoute isAuthenticated={isAuthenticated}>
                <Supplier />
              </PrivateRoute>
            }
          />
          <Route
            path="products"
            element={
              <PrivateRoute isAuthenticated={isAuthenticated}>
                <Product />
              </PrivateRoute>
            }
          />
          <Route
            path="boms/register"
            element={
              <PrivateRoute isAuthenticated={isAuthenticated}>
                <BOMRegister />
              </PrivateRoute>
            }
          />
          <Route
            path="warehouses/import"
            element={
              <PrivateRoute isAuthenticated={isAuthenticated}>
                <WarehouseImport />
              </PrivateRoute>
            }
          />
          <Route
            path="warehouses/export"
            element={
              <PrivateRoute isAuthenticated={isAuthenticated}>
                <WarehouseExport />
              </PrivateRoute>
            }
          />
          <Route
            path="warehouse-entries/create"
            element={
              <PrivateRoute isAuthenticated={isAuthenticated}>
                <WarehouseEntryRegister />
              </PrivateRoute>
            }
          />
          <Route
            path="warehouse-entries"
            element={
              <PrivateRoute isAuthenticated={isAuthenticated}>
                <WarehouseEntryList />
              </PrivateRoute>
            }
          />
          <Route
            path="stock-outs/create"
            element={
              <PrivateRoute isAuthenticated={isAuthenticated}>
                <StockOutRegister />
              </PrivateRoute>
            }
          />
          <Route
            path="stock-outs"
            element={
              <PrivateRoute isAuthenticated={isAuthenticated}>
                <StockOutList />
              </PrivateRoute>
            }
          />
          <Route
            path="production-orders/register"
            element={
              <PrivateRoute isAuthenticated={isAuthenticated}>
                <ProductionOrderRegister />
              </PrivateRoute>
            }
          />
          <Route
            path="stock-materials"
            element={
              <PrivateRoute isAuthenticated={isAuthenticated}>
                <StockMaterial />
              </PrivateRoute>
            }
          />
          <Route
            path="stock-products"
            element={
              <PrivateRoute isAuthenticated={isAuthenticated}>
                <StockProduct />
              </PrivateRoute>
            }
          />
          <Route
            path="production-orders"
            element={
              <PrivateRoute isAuthenticated={isAuthenticated}>
                <ProductionOrder />
              </PrivateRoute>
            }
          />
          <Route
            path="purchase-requisitions"
            element={
              <PrivateRoute isAuthenticated={isAuthenticated}>
                <PurchaseRequisition />
              </PrivateRoute>
            }
          />
          <Route
            path="purchase-requisitions/register"
            element={
              <PrivateRoute isAuthenticated={isAuthenticated}>
                <PurchaseRequisitionRegister />
              </PrivateRoute>
            }
          />
          <Route
            path="purchase-orders/register"
            element={
              <PrivateRoute isAuthenticated={isAuthenticated}>
                <PurchaseOrderRegister />
              </PrivateRoute>
            }
          />
          <Route
            path="purchase-orders"
            element={
              <PrivateRoute isAuthenticated={isAuthenticated}>
                <PurchaseOrder />
              </PrivateRoute>
            }
          />

          <Route
            path="dashboard"
            element={
              <PrivateRoute isAuthenticated={isAuthenticated}>
                <Dashboard />
              </PrivateRoute>
            }
          />
        </Route>
        <Route path="not-found" element={<NotFound />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default RouterComponent;
