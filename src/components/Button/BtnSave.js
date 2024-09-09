import React from "react";
import { Button } from "antd";
import { SaveOutlined } from "@ant-design/icons";
const BtnSave = ({ event, className }) => {
  return (
    <Button className={className} onClick={event}>
      Save
      <SaveOutlined />
    </Button>
  );
};

export default BtnSave;
