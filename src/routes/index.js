import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import LayoutMaster from "../pages/Layouts/LayoutMaster";
import Employee from "../pages/Employees/Employee";
import Department from "../pages/Departments/Department";
import Menu from "../pages/Menus/Menu";
import Customer from "../pages/Customers/Customer";
import Line from "../pages/Lines/Line";
import Factory from "../pages/Factories/Factory";
import Color from "../pages/Colors/Color";
import Size from "../pages/Sizes/Size";
import Process from "../pages/Processes/Process";
import NG from "../pages/NGs/NG";
import SaleOrderList from "../pages/SaleOrders/SaleOrderList";
import SaleOrderRegister from "../pages/SaleOrders/SaleOrderRegister";
import ProductionOrderRegister from "../pages/ProductionOrders/ProductionOrderRegister";
import Supplier from "../pages/Suppliers/Supplier";
import Warehouse from "../pages/Warehouses/Warehouse";
import Product from "../pages/Products/Product";
import StockMaterial from "../pages/Stocks/StockMaterial";
import StockProduct from "../pages/Stocks/StockProduct";
import BOMRegister from "../pages/BOMs/BOMRegister";
import WarehouseEntryRegister from "../pages/WarehouseEntries/WarehouseEntryRegister";
import WarehouseImport from "../pages/WarehouseEntries/WarehousrImport";
import WarehouseEntryList from "../pages/WarehouseEntries/WarehouseEntryList";

const RouterComponent = () => {
  return (
    <div>
      <Router>
        <Routes>
          {/* <Route path="/" element={<NotFound />} /> */}
          <Route path="/erp-system" element={<LayoutMaster />}>
            {/* <Route index element={<Employee />} /> */}
            <Route path="employees" element={<Employee />} />
            <Route path="departments" element={<Department />} />
            <Route path="menus" element={<Menu />} />
            <Route path="customers" element={<Customer />} />
            <Route path="lines" element={<Line />} />
            <Route path="factories" element={<Factory />} />
            <Route path="colors" element={<Color />} />
            <Route path="sizes" element={<Size />} />
            <Route path="processes" element={<Process />} />
            <Route path="ngs" element={<NG />} />
            <Route
              path="sale-orders/register"
              element={<SaleOrderRegister />}
            />

            <Route path="sale-orders" element={<SaleOrderList />} />
            <Route path="suppliers" element={<Supplier />} />
            <Route path="warehouses" element={<Warehouse />} />
            <Route path="products" element={<Product />} />
            <Route path="boms/register" element={<BOMRegister />} />
            <Route path="warehouses/import" element={<WarehouseImport />} />
            <Route
              path="warehouse-entries/create"
              element={<WarehouseEntryRegister />}
            />
            <Route path="warehouse-entries" element={<WarehouseEntryList />} />
            <Route
              path="production-orders/register"
              element={<ProductionOrderRegister />}
            />
            <Route path="stock-materials" element={<StockMaterial />} />
            <Route path="stock-products" element={<StockProduct />} />
            {/* <Route path="*" element={<Page404 />} />  */}
          </Route>
        </Routes>
      </Router>
    </div>
  );
};

export default RouterComponent;
