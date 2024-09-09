import React from "react";
import { Button, Space, Popconfirm } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
const BtnDelete = ({ event, title, description }) => {
  return (
    <Space size="small">
      <Popconfirm
        title={title}
        description={description}
        okText="Yes"
        cancelText="No"
        onConfirm={event}
      >
        <Button type="primary" danger>
          <DeleteOutlined />
        </Button>
      </Popconfirm>
    </Space>
  );
};

export default BtnDelete;
