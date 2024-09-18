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
import SaleOrderRegister from "../pages/SaleOrders/SaleOrderRegister";

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

            {/* <Route path="*" element={<Page404 />} />  */}
          </Route>
        </Routes>
      </Router>
    </div>
  );
};

export default RouterComponent;
