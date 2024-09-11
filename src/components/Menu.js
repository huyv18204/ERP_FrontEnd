import React, { useEffect, useState } from "react";
import * as menusService from "../services/menus";
import { Link } from "react-router-dom";
import { Menu } from "antd";
import {
  UserOutlined,
  PieChartOutlined,
  DesktopOutlined,
  FileOutlined,
  TeamOutlined,
} from "@ant-design/icons";
const Menus = () => {
  const [menuItems, setMenuItems] = useState([]);
  const iconMapping = {
    PieChartOutlined: <PieChartOutlined />,
    DesktopOutlined: <DesktopOutlined />,
    UserOutlined: <UserOutlined />,
    TeamOutlined: <TeamOutlined />,
    FileOutlined: <FileOutlined />,
  };
  useEffect(() => {
    getMenuTree();
  }, []);
  const getMenuTree = async () => {
    const menus = await menusService.getMenuTree();
    setMenuItems(transformIcon(menus));
  };
  const transformIcon = (menuData) => {
    return menuData.map((item) => {
      return {
        ...item,
        label: item.url ? (
          <Link className="text-decoration-none" to={item.url}>
            {item.label}
          </Link>
        ) : (
          item.label
        ),
        key: item.id.toString(),
        icon: iconMapping[item.icon] || null,
        children: item.children ? transformIcon(item.children) : null,
      };
    });
  };

  return (
    <Menu
      theme="dark"
      mode="inline"
      defaultSelectedKeys={["1"]}
      items={menuItems}
    />
  );
};

export default Menus;
