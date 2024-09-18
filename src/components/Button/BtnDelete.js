import React from "react";
import { Button, Space, Popconfirm } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
const BtnDelete = ({ event, disabled }) => {
  return (
    <Space size="small">
      <Popconfirm
        title="Delete"
        description="Do you want to delete?"
        okText="Yes"
        cancelText="No"
        onConfirm={event}
      >
        <Button disabled={disabled} type="primary" danger>
          <DeleteOutlined />
        </Button>
      </Popconfirm>
    </Space>
  );
};

export default BtnDelete;
