import React, { useEffect, useState, useCallback } from "react";
import { Layout, theme, Table } from "antd";
import { useColumnSearch } from "../../hooks/useColumnSearch";
import { Form, Input, Select } from "antd";
import * as employeeService from "../../services/employees";
import * as departmentService from "../../services/departments";
import { useMessage } from "../../hooks/useMessage";
import BtnClear from "../../components/Button/BtnClear";
import BtnQuery from "../../components/Button/BtnQuery";
import BtnSave from "../../components/Button/BtnSave";
import BtnDelete from "../../components/Button/BtnDelete";
const Employee = () => {
  const initialEmployeeState = {
    name: "",
    phone: "",
    address: "",
    work_date: "",
    department_id: "",
    email: "",
    password: "",
    role: "",
  };

  const [employee, setEmployee] = useState(initialEmployeeState);
  const [currentPage, setCurrentPage] = useState(1);
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [changedEmployees, setChangedEmployees] = useState([]);
  const { Message, contextHolder } = useMessage();
  const { getColumnSearch } = useColumnSearch();
  const { Content } = Layout;
  const { Option } = Select;
  const [form] = Form.useForm();
  console.log(employees);
  const handleInputTableChange = (e, key, column) => {
    const newEmployees = [...employees];
    const index = newEmployees.findIndex((item) => key === item.key);
    newEmployees[index][column] = e.target.value;
    setEmployees(newEmployees);

    // Cập nhật danh sách các bản ghi đã thay đổi
    setChangedEmployees((prev) => {
      const isExisting = prev.some((item) => item.key === key);
      if (!isExisting) {
        return [...prev, newEmployees[index]];
      }
      return prev.map((item) =>
        item.key === key ? newEmployees[index] : item
      );
    });
  };

  const handleOptionTableChange = (value, key, column) => {
    const newEmployees = [...employees];
    const index = newEmployees.findIndex((item) => key === item.key);
    if (index !== -1) {
      newEmployees[index][column] = value;
      setEmployees(newEmployees);

      setChangedEmployees((prev) => {
        const isExisting = prev.some((item) => item.key === key);
        if (!isExisting) {
          return [...prev, newEmployees[index]];
        }
        return prev.map((item) =>
          item.key === key ? newEmployees[index] : item
        );
      });
    }
  };

  const columns = [
    {
      title: "No.",
      dataIndex: "code",
      key: "code",
      width: "9%",
      ...getColumnSearch("code"),
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
      title: "Email",
      dataIndex: "email",
      key: "email",
      width: "16%",
      ...getColumnSearch("email"),
      render: (value, record) => (
        <Input
          className="input-no-border"
          name={`email[${record.key}]`}
          type="text"
          value={value}
          onChange={(e) => handleInputTableChange(e, record.key, "email")}
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
      title: "Department",
      dataIndex: "department",
      key: "department",
      width: "12%",
      ...getColumnSearch("department"),
      render: (value, record) => (
        <Select
          name={`department_id[${record.key}]`}
          placeholder="Select a department"
          onChange={(newValue) =>
            handleOptionTableChange(newValue, record.key, "department_id")
          }
          allowClear
          value={record.department_id}
          style={{ minWidth: 130 }}
        >
          {departments.map((item) => (
            <Option key={item.id} value={item.id}>
              {item.name}
            </Option>
          ))}
        </Select>
      ),
    },

    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      width: "12%",
      ...getColumnSearch("role"),
      render: (value, record) => (
        <Select
          name={`role[${record.key}]`}
          placeholder="Select a role"
          onChange={(newValue) =>
            handleOptionTableChange(newValue, record.key, "role")
          }
          allowClear
          value={value}
          style={{ minWidth: 130 }}
        >
          <Option key="Admin" value="Admin">
            Admin
          </Option>

          <Option key="Manager" value="Manager">
            Manager
          </Option>

          <Option key="Employee" value="Employee">
            Employee
          </Option>
        </Select>
      ),
    },
    {
      title: "Work Date",
      dataIndex: "work_date",
      key: "work_date",
      width: "11%",
      ...getColumnSearch("work_date"),
      render: (value, record) => (
        <Input
          className="input-no-border"
          name={`work_date[${record.key}]`}
          type="date"
          value={value}
          onChange={(e) => handleInputTableChange(e, record.key, "work_date")}
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
    setEmployee((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleOptionFormChange = (name, value) => {
    setEmployee((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleQuery = async () => {
    try {
      const response = await employeeService.index(employee);
      const data = response?.map((employee, index) => ({
        ...employee,
        key: index,
        department: employee.department.name,
      }));
      console.log(data);

      setEmployees(data);
    } catch (error) {
      Message(
        "error",
        "Error fetching employees: " +
          (error.response ? error.response.data : error.message)
      );
    }
  };

  const handleSave = useCallback(async () => {
    try {
      if (changedEmployees.length > 0) {
        for (const emp of changedEmployees) {
          if (emp && emp.name && emp.department_id) {
            const res = await employeeService.update(emp.id, emp);
            Message("success", res.message);
          } else {
            Message("error", "Please fill in required fields");
          }
        }
        setChangedEmployees([]);
      } else {
        if (employee && employee.name && employee.department_id) {
          const data = await employeeService.store(employee);
          const newEmployee = {
            ...data,
            key: data.code,
            department: data.department ? data.department.name : "",
          };
          setEmployees([newEmployee]);
          handleClear();
          Message("success", "Add new employee success");
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
  }, [employee, employees]);

  const handleDelete = useCallback(
    async (id) => {
      try {
        await employeeService.destroy(id);
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
    [employees]
  );

  const handleClear = () => {
    setEmployee(initialEmployeeState);
    form.resetFields();
  };

  const getDepartment = async () => {
    const data = await departmentService.index();
    setDepartments(data);
  };

  useEffect(() => {
    getDepartment();
  }, []);

  useEffect(() => {
    form.setFieldsValue(employee);
  }, [employee, form]);
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
              value={employee.name}
              placeholder="Enter Name"
            />
          </Form.Item>

          <Form.Item
            rules={[
              {
                required: true,
                message: "Please input email",
              },
            ]}
            name="email"
            label="Email"
            className="py-2"
          >
            <Input
              name="email"
              onChange={handleInputFormChange}
              type="text"
              value={employee.email}
              placeholder="Enter Email"
            />
          </Form.Item>

          <Form.Item
            rules={[
              {
                required: true,
                message: "Please input password",
              },
            ]}
            name="password"
            label="Password"
            className="py-2"
          >
            <Input
              name="password"
              onChange={handleInputFormChange}
              type="password"
              value={employee.password}
              placeholder="Enter Email"
            />
          </Form.Item>

          <Form.Item name="phone" label="Phone" className="py-2">
            <Input
              name="phone"
              onChange={handleInputFormChange}
              value={employee.phone}
              placeholder="Enter Phone"
            />
          </Form.Item>

          <Form.Item name="address" label="Address" className="py-2">
            <Input
              name="address"
              onChange={handleInputFormChange}
              type="text"
              value={employee.address}
              placeholder="Enter Address"
            />
          </Form.Item>

          <Form.Item
            rules={[
              {
                required: true,
                message: "Please input department",
              },
            ]}
            name="department"
            label="Department"
            className="py-2"
          >
            <Select
              style={{ width: 180 }}
              name="department_id"
              placeholder="Select a department"
              onChange={(value) =>
                handleOptionFormChange("department_id", value)
              }
              allowClear
            >
              {departments.map((item) => (
                <Option key={item.id} value={item.id}>
                  {item.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            rules={[
              {
                required: true,
                message: "Please input role",
              },
            ]}
            name="role"
            label="Role"
            className="py-2"
          >
            <Select
              style={{ width: 180 }}
              name="role"
              placeholder="Select a role"
              // onChange={handleOptionFormChange("role")}
              onChange={(value) => handleOptionFormChange("role", value)}
              allowClear
            >
              <Option key="Admin" value="Admin">
                Admin
              </Option>

              <Option key="Manager" value="Manager">
                Manager
              </Option>

              <Option key="Employee" value="Employee">
                Employee
              </Option>
            </Select>
          </Form.Item>

          <Form.Item name="work_date" label="Work Date" className="py-2">
            <Input
              name="work_date"
              onChange={handleInputFormChange}
              type="date"
              value={employee.work_date}
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
          // minHeight: 510,
          background: colorBgContainer,
          borderRadius: borderRadiusLG,
        }}
      >
        <Table
          size="small"
          scroll={{
            x: 1500,
            y: 350,
          }}
          pagination={{
            current: currentPage,
            pageSize: 5,
            total: employees.length,
            onChange: (page) => {
              setCurrentPage(page);
            },
          }}
          columns={columns}
          dataSource={employees}
        />
      </Content>

      {contextHolder}
    </div>
  );
};

export default Employee;
