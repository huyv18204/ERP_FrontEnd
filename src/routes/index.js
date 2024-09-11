import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import LayoutMaster from "../pages/Layouts/LayoutMaster";
// import Category from "../pages/Category/page";
// import Home from "../pages/Home/Home";
// import NotFound from "../pages/NotFound/NotFound";
// import CreateProduct from "../pages/Product/_component/CreateProduct";
// import ProductManagePage from "../pages/Product/page";
// import TrashCategory from "../pages/Category/_components/TrashCategory";
// import Page404 from "../components/base/Result/Page404";
import Employee from "../pages/Employees/Employee";
import Department from "../pages/Departments/Department";
import Menu from "../pages/Menus/Menu";
import Customer from "../pages/Customers/Customer";
import Line from "../pages/Lines/Line";
import Factory from "../pages/Factories/Factory";

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

            {/* <Route path="categories" element={<Category />} />
            <Route path="categories/trash" element={<TrashCategory />} />
            <Route path="products" element={<ProductManagePage />} />
            <Route path="products/add" element={<CreateProduct />} />
            <Route path="products/:id/edit" element={<CreateProduct />} />
            <Route path="*" element={<Page404 />} /> */}
          </Route>
        </Routes>
      </Router>
    </div>
  );
};

export default RouterComponent;
