import React from "react";
import { Button, Space, Popconfirm } from "antd";
import { CloseOutlined } from "@ant-design/icons";
const BtnClose = ({ event, disabled, className }) => {
  return (
    <Space className={className} size="small">
      <Popconfirm
        title="Reject"
        description="Do you want to reject?"
        okText="Yes"
        cancelText="No"
        onConfirm={event}
      >
        <Button disabled={disabled} type="primary" danger>
          <CloseOutlined />
        </Button>
      </Popconfirm>
    </Space>
  );
};

export default BtnClose;
