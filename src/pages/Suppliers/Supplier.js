import React, { useEffect, useState, useCallback } from "react";
import { Layout, theme, Table } from "antd";
import { useColumnSearch } from "../../hooks/useColumnSearch";
import { Form, Input } from "antd";
import * as suppliersService from "../../services/suppliers";
import { useMessage } from "../../hooks/useMessage";
import BtnClear from "../../components/Button/BtnClear";
import BtnQuery from "../../components/Button/BtnQuery";
import BtnSave from "../../components/Button/BtnSave";
import BtnDelete from "../../components/Button/BtnDelete";
const Supplier = () => {
  const initialState = {
    name: "",
    phone: "",
    address: "",
  };
  const [supplier, setSupplier] = useState(initialState);
  const [currentPage, setCurrentPage] = useState(1);
  const [suppliers, setSuppliers] = useState([]);
  const [changedValue, setChangedValue] = useState([]);
  const { Message, contextHolder } = useMessage();
  const { getColumnSearch } = useColumnSearch();
  const { Content } = Layout;
  const [form] = Form.useForm();

  const handleInputTableChange = (e, key, column) => {
    const newValues = [...suppliers];
    const index = newValues.findIndex((item) => key === item.key);
    newValues[index][column] = e.target.value;
    setSuppliers(newValues);

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
      width: "15%",
      ...getColumnSearch("code"),
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      width: "20%",
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
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
      width: "20%",
      ...getColumnSearch("phone"),
      render: (value, record) => (
        <Input
          className="input-no-border"
          name={`phone[${record.key}]`}
          type="text"
          value={value}
          onChange={(e) => handleInputTableChange(e, record.key, "phone")}
        />
      ),
    },

    {
      title: "Address",
      dataIndex: "address",
      key: "address",
      ...getColumnSearch("address"),
      sorter: (a, b) => a.address.length - b.address.length,
      sortDirections: ["descend", "ascend"],
      render: (value, record) => (
        <Input
          className="input-no-border"
          name={`address[${record.key}]`}
          type="text"
          value={value}
          onChange={(e) => handleInputTableChange(e, record.key, "address")}
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
    setSupplier((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleQuery = async () => {
    try {
      const response = await suppliersService.index(supplier);
      const data = response?.map((supplier, index) => ({
        ...supplier,
        key: index,
      }));
      setSuppliers(data);
    } catch (error) {
      Message(
        "error",
        "Error fetching suppliers: " +
          (error.response ? error.response.data : error.message)
      );
    }
  };

  const handleSave = useCallback(async () => {
    try {
      if (changedValue.length > 0) {
        for (const cust of changedValue) {
          if (cust && cust.name && cust.phone) {
            const res = await suppliersService.update(cust.id, cust);
            Message("success", res.message);
          } else {
            Message("error", "Please fill in required fields");
          }
        }
        setChangedValue([]);
      } else {
        if (supplier && supplier.name && supplier.phone) {
          const data = await suppliersService.store(supplier);
          const newValue = {
            ...data,
            key: data.code,
          };
          setSuppliers([newValue]);
          handleClear();
          Message("success", "Add new supplier success");
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
  }, [supplier, suppliers]);

  const handleDelete = useCallback(
    async (id) => {
      try {
        await suppliersService.destroy(id);
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
    [suppliers]
  );

  const handleClear = () => {
    setSupplier(initialState);
    form.resetFields();
  };

  useEffect(() => {
    form.setFieldsValue(supplier);
  }, [supplier, form]);
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
              value={supplier.name}
              placeholder="Enter Name"
            />
          </Form.Item>
          <Form.Item
            rules={[
              {
                required: true,
                message: "Please input name",
              },
            ]}
            name="phone"
            label="Phone"
            className="py-2"
          >
            <Input
              name="phone"
              onChange={handleInputFormChange}
              value={supplier.phone}
              placeholder="Enter Phone"
            />
          </Form.Item>

          <Form.Item name="address" label="Address" className="py-2">
            <Input
              name="address"
              onChange={handleInputFormChange}
              type="text"
              value={supplier.address}
              style={{ width: 350 }}
              placeholder="Enter Address"
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
          size="small"
          pagination={{
            current: currentPage,
            pageSize: 7,
            total: suppliers.length,
            onChange: (page) => {
              setCurrentPage(page);
            },
          }}
          columns={columns}
          dataSource={suppliers}
        />
      </Content>

      {contextHolder}
    </div>
  );
};

export default Supplier;
