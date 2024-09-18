import React, { useEffect, useState, useCallback } from "react";
import { Layout, theme, Table } from "antd";
import { useColumnSearch } from "../../hooks/useColumnSearch";
import { Form, Input } from "antd";
import * as sizesService from "../../services/sizes";
import { useMessage } from "../../hooks/useMessage";
import BtnClear from "../../components/Button/BtnClear";
import BtnQuery from "../../components/Button/BtnQuery";
import BtnSave from "../../components/Button/BtnSave";
import BtnDelete from "../../components/Button/BtnDelete";

const Size = () => {
  const initialSizesState = {
    name: "",
    description: "",
  };
  const [size, setSize] = useState(initialSizesState);
  const [currentPage, setCurrentPage] = useState(1);
  const [sizes, setSizes] = useState([]);
  const [changedSizes, setChangedSizes] = useState([]);
  const { Message, contextHolder } = useMessage();
  const { getColumnSearch } = useColumnSearch();
  const { Content } = Layout;
  const [form] = Form.useForm();

  const handleInputTableChange = (e, key, column) => {
    const newSizes = [...sizes];
    const index = newSizes.findIndex((item) => key === item.key);
    newSizes[index][column] = e.target.value;
    setSizes(newSizes);

    setChangedSizes((prev) => {
      const isExisting = prev.some((item) => item.key === key);
      if (!isExisting) {
        return [...prev, newSizes[index]];
      }
      return prev.map((item) => (item.key === key ? newSizes[index] : item));
    });
  };

  const columns = [
    {
      title: "No.",
      dataIndex: "size_code",
      key: "size_code",
      width: "6%",
      ...getColumnSearch("size_code"),
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      width: "13%",
      ...getColumnSearch("name"),
      render: (value, record) => (
        <Input
          className="input-no-border"
          name={`name[${record.key}]`}
          type="text"
          value={value}
          onChange={(e) => handleInputTableChange(e, record.key, "name")}
        />
      ),
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      width: "15%",
      render: (value, record) => (
        <Input
          className="input-no-border"
          name={`description[${record.key}]`}
          type="text"
          value={value}
          onChange={(e) => handleInputTableChange(e, record.key, "description")}
        />
      ),
    },
    {
      title: "Action",
      key: "operation",
      width: "7%",
      className: "text-center",
      render: (_, record) => (
        <BtnDelete event={() => handleDelete(record.id)} />
      ),
    },
  ];

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const handleInputFormChange = (e) => {
    const { name, value } = e.target;
    setSize((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleQuery = useCallback(async () => {
    try {
      const response = await sizesService.index(size);
      const data = response?.map((size, index) => ({
        ...size,
        key: index,
      }));
      setSizes(data);
    } catch (error) {
      Message(
        "error",
        "Error fetching sizes: " +
          (error.response ? error.response.data : error.message)
      );
    }
  }, [size]);

  const handleSave = useCallback(async () => {
    try {
      if (changedSizes.length > 0) {
        for (const size of changedSizes) {
          if (size && size.name) {
            const res = await sizesService.update(size.id, size);
            Message("success", res.message);
          } else {
            Message("error", "Please fill in required fields");
          }
        }
        setChangedSizes([]);
      } else {
        if (size && size.name) {
          const data = await sizesService.store(size);
          const newSize = {
            ...data,
            key: data.id,
          };
          setSizes([newSize]);
          handleClear();
          Message("success", "Add new size success");
        } else {
          Message("error", "Please fill in required fields");
        }
      }
    } catch (error) {
      Message(
        "error",
        "Error saving data: " +
          (error.response ? error.response.data : error.message)
      );
    }
  }, [size, changedSizes, sizes, Message]);

  const handleDelete = useCallback(
    async (id) => {
      try {
        await sizesService.destroy(id);
        Message("success", "Delete success");
        handleQuery();
      } catch (error) {
        Message(
          "error",
          "Error deleting data: " +
            (error.response ? error.response.data : error.message)
        );
      }
    },
    [handleQuery, Message]
  );

  const handleClear = () => {
    setSize(initialSizesState);
    form.resetFields();
  };

  useEffect(() => {
    form.setFieldsValue(size);
  }, [size, form]);

  return (
    <div>
      <Content
        style={{
          margin: "10px 16px",
          padding: 10,
          paddingLeft: 24,
          minHeight: 10,
          background: colorBgContainer,
          borderRadius: borderRadiusLG,
        }}
      >
        <BtnClear event={handleClear} />
        <BtnQuery className="ms-2" event={handleQuery} />
        <BtnSave className="ms-2" event={handleSave} />
      </Content>

      <Content
        style={{
          margin: "10px 16px",
          padding: 24,
          paddingTop: 15,
          paddingBottom: 15,
          minHeight: 100,
          background: colorBgContainer,
          borderRadius: borderRadiusLG,
        }}
      >
        <Form
          layout="inline"
          form={form}
          style={{
            maxWidth: "none",
          }}
        >
          <Form.Item
            rules={[
              {
                required: true,
                message: "Please input name",
              },
            ]}
            name="name"
            label="Name"
            className="py-2"
          >
            <Input
              name="name"
              onChange={handleInputFormChange}
              type="text"
              value={size.name}
              placeholder="Enter Name"
            />
          </Form.Item>
          <Form.Item name="description" label="Description" className="py-2">
            <Input
              name="description"
              onChange={handleInputFormChange}
              value={size.description}
              placeholder="Enter Description"
            />
          </Form.Item>
        </Form>
      </Content>

      <Content
        style={{
          margin: "18px 16px",
          padding: 24,
          paddingTop: 20,
          paddingBottom: 20,
          background: colorBgContainer,
          borderRadius: borderRadiusLG,
        }}
      >
        <Table
          pagination={{
            current: currentPage,
            pageSize: 5,
            total: sizes.length,
            onChange: (page) => {
              setCurrentPage(page);
            },
          }}
          columns={columns}
          dataSource={sizes}
        />
      </Content>

      {contextHolder}
    </div>
  );
};

export default Size;
