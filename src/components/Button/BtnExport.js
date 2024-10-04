import React from "react";
import { Button } from "antd";
import { ExportOutlined } from "@ant-design/icons";
const BtnExport = ({ event, className }) => {
  return (
    <Button className={className} onClick={event}>
      Export
      <ExportOutlined />
    </Button>
  );
};

export default BtnExport;
