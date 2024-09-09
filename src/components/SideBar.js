import React from "react";
import { Link } from "react-router-dom";

const SideBar = () => {
  return (
    <div className="col-auto col-md-3 col-xl-2 px-sm-2 px-0 bg-dark">
      <div className="d-flex flex-column align-items-center align-items-sm-start px-3 pt-2 text-white min-vh-100">
        <Link
          to="/"
          className="d-flex align-items-center pb-3 mb-md-0 me-md-auto text-white text-decoration-none"
        >
          <span className="fs-5 d-none d-sm-inline">Menu</span>
        </Link>
        <ul
          className="nav nav-pills flex-column mb-sm-auto mb-0 align-items-center align-items-sm-start"
          id="menu"
        >
          <li className="nav-item">
            <Link to="/home" className="nav-link align-middle px-0">
              <i className="fs-4 bi-house"></i>
              <span className="ms-1 d-none d-sm-inline">Trang web</span>
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/posts" className="nav-link align-middle px-0">
              <i className="fs-4 bi-house"></i>
              <span className="ms-1 d-none d-sm-inline">Quản lí bài viết</span>
            </Link>
          </li>
          <li>
            <Link to="/categories" className="nav-link px-0 align-middle">
              <i className="fs-4 bi-people"></i>
              <span className="ms-1 d-none d-sm-inline">Quản lí danh mục</span>
            </Link>
          </li>

          <li>
            <Link to="/users" className="nav-link px-0 align-middle">
              <i className="fs-4 bi-people"></i>
              <span className="ms-1 d-none d-sm-inline">
                Quản lí người dùng
              </span>
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default SideBar;
