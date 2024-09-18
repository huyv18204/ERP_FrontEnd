import React from "react";
import { Button } from "antd";
import { FormOutlined } from "@ant-design/icons";
const BtnModal = ({ event, className, disabled }) => {
  return (
    <Button disabled={disabled} className={className} onClick={event}>
      <FormOutlined />
    </Button>
  );
};

export default BtnModal;
