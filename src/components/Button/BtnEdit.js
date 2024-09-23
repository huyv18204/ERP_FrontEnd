import React from "react";
import { Button } from "antd";
import { EditOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
const BtnDelete = ({ onClick, to, className }) => {
  return (
    <Button className={className} onClick={onClick}>
      <Link className="text-decoration-none" to={to}>
        <EditOutlined />
      </Link>
    </Button>
  );
};

export default BtnDelete;
