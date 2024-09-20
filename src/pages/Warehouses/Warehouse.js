import React, { useEffect, useState, useCallback } from "react";
import { Layout, theme, Table } from "antd";
import { useColumnSearch } from "../../hooks/useColumnSearch";
import { Form, Input } from "antd";
import * as warehouseService from "../../services/warehouses";
import { useMessage } from "../../hooks/useMessage";
import BtnClear from "../../components/Button/BtnClear";
import BtnQuery from "../../components/Button/BtnQuery";
import BtnSave from "../../components/Button/BtnSave";
import BtnDelete from "../../components/Button/BtnDelete";
const Warehouse = () => {
  const initialState = {
    name: "",
    description: "",
  };
  const [warehouse, setWarehouse] = useState(initialState);
  const [currentPage, setCurrentPage] = useState(1);
  const [warehouses, setWarehouses] = useState([]);
  const [changedValue, setChangedValue] = useState([]);
  const { Message, contextHolder } = useMessage();
  const { getColumnSearch } = useColumnSearch();
  const { Content } = Layout;
  const [form] = Form.useForm();

  const handleInputTableChange = (e, key, column) => {
    const newValues = [...warehouses];
    const index = newValues.findIndex((item) => key === item.key);
    newValues[index][column] = e.target.value;
    setWarehouses(newValues);

    // Cập nhật danh sách các bản ghi đã thay đổi
    setChangedValue((prev) => {
      const isExisting = prev.some((item) => item.key === key);
      if (!isExisting) {
        return [...prev, newValues[index]];
      }
      return prev.map((item) => (item.key === key ? newValues[index] : item));
    });
  };

  const columns = [
    {
      title: "No.",
      dataIndex: "code",
      key: "code",
      width: "20%",
      ...getColumnSearch("code"),
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      width: "30%",
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
      ...getColumnSearch("description"),
      sorter: (a, b) => a.description.length - b.description.length,
      sortDirections: ["descend", "ascend"],
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
      fixed: "right",
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
    setWarehouse((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleQuery = async () => {
    try {
      const response = await warehouseService.index(warehouse);
      const data = response?.map((warehouse, index) => ({
        ...warehouse,
        key: index,
      }));
      setWarehouses(data);
    } catch (error) {
      Message(
        "error",
        "Error fetching warehouses: " +
          (error.response ? error.response.data : error.message)
      );
    }
  };

  const handleSave = useCallback(async () => {
    try {
      if (changedValue.length > 0) {
        for (const cust of changedValue) {
          if (cust && cust.name) {
            const res = await warehouseService.update(cust.id, cust);
            Message("success", res.message);
          } else {
            Message("error", "Please fill in required fields");
          }
        }
        setChangedValue([]);
      } else {
        if (warehouse && warehouse.name) {
          const data = await warehouseService.store(warehouse);
          const newValue = {
            ...data,
            key: data.code,
          };
          setWarehouses([newValue]);
          handleClear();
          Message("success", "Add new warehouse success");
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
  }, [warehouse, warehouses]);

  const handleDelete = useCallback(
    async (id) => {
      try {
        await warehouseService.destroy(id);
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
    [warehouses]
  );

  const handleClear = () => {
    setWarehouse(initialState);
    form.resetFields();
  };

  useEffect(() => {
    form.setFieldsValue(warehouse);
  }, [warehouse, form]);
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
              value={warehouse.name}
              placeholder="Enter Name"
            />
          </Form.Item>

          <Form.Item name="description" label="Description" className="py-2">
            <Input
              name="description"
              onChange={handleInputFormChange}
              type="text"
              value={warehouse.description}
              style={{ width: 350 }}
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
            total: warehouses.length,
            onChange: (page) => {
              setCurrentPage(page);
            },
          }}
          columns={columns}
          dataSource={warehouses}
        />
      </Content>

      {contextHolder}
    </div>
  );
};

export default Warehouse;
