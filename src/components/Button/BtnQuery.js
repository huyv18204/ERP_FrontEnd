import React from "react";
import { Button } from "antd";
import { SearchOutlined } from "@ant-design/icons";
const BtnQuery = ({ event, className }) => {
  return (
    <Button className={className} onClick={event}>
      Query
      <SearchOutlined />
    </Button>
  );
};

export default BtnQuery;
