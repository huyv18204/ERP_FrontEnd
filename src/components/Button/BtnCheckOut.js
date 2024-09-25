import React from "react";
import { CheckOutlined } from "@ant-design/icons";
import { Button, Space, Popconfirm } from "antd";
const BtnCheckOut = ({ event, className }) => {
  return (
    <Space className={className} size="small">
      <Popconfirm
        title="Confirm"
        description="Are you sure confirm sale order?"
        okText="Yes"
        cancelText="No"
        onConfirm={event}
      >
        <Button>
          <CheckOutlined />
        </Button>
      </Popconfirm>
    </Space>
  );
};

export default BtnCheckOut;
