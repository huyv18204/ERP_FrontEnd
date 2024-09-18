import React from "react";
import { Button } from "antd";
import { PlusSquareOutlined } from "@ant-design/icons";
const BtnAddRow = ({ event, className }) => {
  return (
    <Button className={className} onClick={event} type="dashed">
      Add Row
      <PlusSquareOutlined />
    </Button>
  );
};

export default BtnAddRow;
