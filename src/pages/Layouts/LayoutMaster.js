import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Menus from "../../components/Menu";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import { Button, Layout, theme } from "antd";
import RenderTitle from "../../utils/renderTitle";
import { logout } from "../../services/auth";

const { Header, Sider } = Layout;

const LayoutMaster = () => {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const handleLogout = async () => {
    const response = await logout();
    if (response) {
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <div className="demo-logo-vertical"></div>
        <Menus />
      </Sider>
      <Layout>
        <Header
          style={{
            padding: 0,
            background: colorBgContainer,
          }}
        >
          <div className="d-flex justify-content-between">
            <div>
              <Button
                type="text"
                icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                onClick={() => setCollapsed(!collapsed)}
                style={{
                  fontSize: "16px",
                  width: 64,
                  height: 64,
                }}
              />

              <RenderTitle />
            </div>
            <div className="me-3">
              <Button type="text" onClick={handleLogout}>
                Logout
              </Button>
            </div>
          </div>
        </Header>
        <Outlet />
      </Layout>
    </Layout>
  );
};

export default LayoutMaster;
