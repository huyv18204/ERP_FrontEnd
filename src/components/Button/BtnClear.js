import React from "react";
import { Button } from "antd";
import { ClearOutlined } from "@ant-design/icons";
const BtnClear = ({ event, className }) => {
  return (
    <Button className={className} onClick={event} type="dashed" danger>
      Clear
      <ClearOutlined />
    </Button>
  );
};

export default BtnClear;
