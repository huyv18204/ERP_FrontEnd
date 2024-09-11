import React, { useEffect, useState, useCallback } from "react";
import { Layout, theme, Table } from "antd";
import { useColumnSearch } from "../../hooks/useColumnSearch";
import { Form, Input } from "antd";
import * as customersService from "../../services/customers";
import { useMessage } from "../../hooks/useMessage";
import BtnClear from "../../components/Button/BtnClear";
import BtnQuery from "../../components/Button/BtnQuery";
import BtnSave from "../../components/Button/BtnSave";
import BtnDelete from "../../components/Button/BtnDelete";
const Customer = () => {
  const initialCustomerState = {
    name: "",
    phone: "",
    address: "",
    fax: "",
  };
  const [customer, setCustomer] = useState(initialCustomerState);
  const [currentPage, setCurrentPage] = useState(1);
  const [customers, setCustomers] = useState([]);
  const [changedCustomers, setChangedCustomers] = useState([]);
  const { Message, contextHolder } = useMessage();
  const { getColumnSearch } = useColumnSearch();
  const { Content } = Layout;
  const [form] = Form.useForm();

  const handleInputTableChange = (e, key, column) => {
    const newCustomers = [...customers];
    const index = newCustomers.findIndex((item) => key === item.key);
    newCustomers[index][column] = e.target.value;
    setCustomers(newCustomers);

    // Cập nhật danh sách các bản ghi đã thay đổi
    setChangedCustomers((prev) => {
      const isExisting = prev.some((item) => item.key === key);
      if (!isExisting) {
        return [...prev, newCustomers[index]];
      }
      return prev.map((item) =>
        item.key === key ? newCustomers[index] : item
      );
    });
  };

  const columns = [
    {
      title: "No.",
      dataIndex: "customer_code",
      key: "customer_code",
      width: "10%",
      ...getColumnSearch("customer_code"),
      fixed: "left",
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      width: "16%",
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
      width: "15%",
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
      title: "Fax",
      dataIndex: "fax",
      key: "fax",
      width: "15%",
      ...getColumnSearch("fax"),
      render: (value, record) => (
        <Input
          className="input-no-border"
          name={`fax[${record.key}]`}
          type="text"
          value={value}
          onChange={(e) => handleInputTableChange(e, record.key, "fax")}
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
    setCustomer((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleQuery = async () => {
    try {
      const response = await customersService.index(customer);
      const data = response?.map((customer, index) => ({
        ...customer,
        key: index,
      }));
      setCustomers(data);
    } catch (error) {
      Message(
        "error",
        "Error fetching customers: " +
          (error.response ? error.response.data : error.message)
      );
    }
  };

  const handleSave = useCallback(async () => {
    try {
      if (changedCustomers.length > 0) {
        for (const cust of changedCustomers) {
          if (cust && cust.name && cust.phone && cust.fax) {
            const res = await customersService.update(cust.id, cust);
            Message("success", res.message);
          } else {
            Message("error", "Please fill in required fields");
          }
        }
        setChangedCustomers([]);
      } else {
        if (customer && customer.name && customer.fax && customer.phone) {
          const data = await customersService.store(customer);
          const newCustomer = {
            ...data,
            key: data.employee_code,
            department: data.department ? data.department.name : "",
          };
          setCustomers([newCustomer]);
          handleClear();
          Message("success", "Add new customer success");
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
  }, [customer, customers]);

  const handleDelete = useCallback(
    async (id) => {
      try {
        await customersService.destroy(id);
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
    [customers]
  );

  const handleClear = () => {
    setCustomer(initialCustomerState);
    form.resetFields();
  };

  useEffect(() => {
    form.setFieldsValue(customer);
  }, [customer, form]);
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
              value={customer.name}
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
              value={customer.phone}
              placeholder="Enter Phone"
            />
          </Form.Item>

          <Form.Item
            rules={[
              {
                required: true,
                message: "Please input name",
              },
            ]}
            name="fax"
            label="Fax"
            className="py-2"
          >
            <Input
              name="fax"
              onChange={handleInputFormChange}
              type="number"
              value={customer.fax}
              placeholder="Enter Fax"
            />
          </Form.Item>

          <Form.Item name="address" label="Address" className="py-2">
            <Input
              name="address"
              onChange={handleInputFormChange}
              type="text"
              value={customer.address}
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
          pagination={{
            current: currentPage,
            pageSize: 5,
            total: customers.length,
            onChange: (page) => {
              setCurrentPage(page);
            },
          }}
          columns={columns}
          dataSource={customers}
        />
      </Content>

      {contextHolder}
    </div>
  );
};

export default Customer;
