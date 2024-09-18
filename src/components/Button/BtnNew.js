import React from "react";
import { Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";
const BtnNew = ({ event, className }) => {
  return (
    <Button className={className} onClick={event}>
      New
      <PlusOutlined />
    </Button>
  );
};

export default BtnNew;
