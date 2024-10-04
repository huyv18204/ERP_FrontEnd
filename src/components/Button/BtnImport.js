import React from "react";
import { Button } from "antd";
import { ImportOutlined } from "@ant-design/icons";
const BtnImport = ({ event, className }) => {
  return (
    <Button className={className} onClick={event}>
      Import
      <ImportOutlined />
    </Button>
  );
};

export default BtnImport;
